import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Alert,
  CircularProgress,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import {
  fetchProgressNotesByPatient,
  fetchProgressNoteTemplates,
  createProgressNote,
  reviewProgressNote,
  deleteProgressNote,
  setFilters,
  clearError,
} from "../features/progressNotes/progressNoteSlice";

const ProgressNotesPage = () => {
  const dispatch = useDispatch();
  const { notes, pagination, filters, loading, error } = useSelector(
    (state) => state.progressNotes
  );
  const { user } = useSelector((state) => state.auth);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [formData, setFormData] = useState({
    patientId: "",
    noteType: "DAILY_PROGRESS_NOTE",
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });
  const [reviewData, setReviewData] = useState({
    reviewComments: "",
  });

  useEffect(() => {
    dispatch(fetchProgressNoteTemplates());
  }, [dispatch]);

  const loadNotes = React.useCallback(() => {
    if (selectedPatientId) {
      dispatch(
        fetchProgressNotesByPatient({
          patientId: selectedPatientId,
          params: { page: page + 1, limit: rowsPerPage, ...filters },
        })
      );
    }
  }, [dispatch, selectedPatientId, page, rowsPerPage, filters]);

  useEffect(() => {
    if (selectedPatientId) {
      loadNotes();
    }
  }, [selectedPatientId, loadNotes]);

  const handleRefresh = () => {
    loadNotes();
  };

  const handleOpenCreateDialog = () => {
    setFormData({
      patientId: selectedPatientId || "",
      noteType: "DAILY_PROGRESS_NOTE",
      subjective: "",
      objective: "",
      assessment: "",
      plan: "",
    });
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleCreateNote = async () => {
    try {
      await dispatch(createProgressNote(formData)).unwrap();
      handleCloseCreateDialog();
      loadNotes();
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  };

  const handleOpenViewDialog = (note) => {
    setSelectedNote(note);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedNote(null);
  };

  const handleOpenReviewDialog = (note) => {
    setSelectedNote(note);
    setReviewData({ reviewComments: "" });
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setSelectedNote(null);
  };

  const handleReviewNote = async () => {
    try {
      await dispatch(
        reviewProgressNote({
          noteId: selectedNote.id,
          reviewData,
        })
      ).unwrap();
      handleCloseReviewDialog();
      loadNotes();
    } catch (err) {
      console.error("Failed to review note:", err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await dispatch(deleteProgressNote(noteId)).unwrap();
        loadNotes();
      } catch (err) {
        console.error("Failed to delete note:", err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "AMENDED":
        return "warning";
      case "REVIEWED":
        return "info";
      case "DELETED":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Progress Notes</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            disabled={!selectedPatientId}
          >
            New Note
          </Button>
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => dispatch(clearError())}
        >
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Patient ID"
                type="number"
                value={selectedPatientId}
                onChange={(e) => {
                  setSelectedPatientId(e.target.value);
                  setPage(0);
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Note Type</InputLabel>
                <Select
                  value={filters.noteType || ""}
                  label="Note Type"
                  onChange={(e) =>
                    dispatch(setFilters({ noteType: e.target.value }))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="DAILY_PROGRESS_NOTE">
                    Daily Progress
                  </MenuItem>
                  <MenuItem value="ADMISSION_NOTE">Admission</MenuItem>
                  <MenuItem value="DISCHARGE_SUMMARY">
                    Discharge Summary
                  </MenuItem>
                  <MenuItem value="CONSULTATION_NOTE">Consultation</MenuItem>
                  <MenuItem value="OPERATIVE_NOTE">Operative</MenuItem>
                  <MenuItem value="PROCEDURE_NOTE">Procedure</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ""}
                  label="Status"
                  onChange={(e) =>
                    dispatch(setFilters({ status: e.target.value }))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="AMENDED">Amended</MenuItem>
                  <MenuItem value="REVIEWED">Reviewed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Notes Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : !selectedPatientId ? (
            <Box textAlign="center" p={3}>
              <Typography variant="body1" color="textSecondary">
                Please enter a Patient ID to view progress notes
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>Summary</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {notes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No notes found for this patient
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      notes.map((note) => (
                        <TableRow key={note.id} hover>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatDistanceToNow(new Date(note.createdAt), {
                                addSuffix: true,
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={note.noteType} size="small" />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={note.status}
                              color={getStatusColor(note.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {note.author?.username || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 300,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {note.assessment}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={0.5}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenViewDialog(note)}
                                  color="primary"
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {user?.role === "Consultant" &&
                                note.status === "ACTIVE" && (
                                  <Tooltip title="Review Note">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleOpenReviewDialog(note)
                                      }
                                      color="success"
                                    >
                                      <CheckCircleIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              {(user?.id === note.authorId ||
                                user?.role === "Consultant") && (
                                <Tooltip title="Delete Note">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteNote(note.id)}
                                    color="error"
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={pagination.total}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Note Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Progress Note</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Patient ID"
                type="number"
                value={formData.patientId}
                onChange={(e) =>
                  setFormData({ ...formData, patientId: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Note Type</InputLabel>
                <Select
                  value={formData.noteType}
                  label="Note Type"
                  onChange={(e) =>
                    setFormData({ ...formData, noteType: e.target.value })
                  }
                >
                  <MenuItem value="DAILY_PROGRESS_NOTE">
                    Daily Progress
                  </MenuItem>
                  <MenuItem value="ADMISSION_NOTE">Admission</MenuItem>
                  <MenuItem value="DISCHARGE_SUMMARY">
                    Discharge Summary
                  </MenuItem>
                  <MenuItem value="CONSULTATION_NOTE">Consultation</MenuItem>
                  <MenuItem value="OPERATIVE_NOTE">Operative</MenuItem>
                  <MenuItem value="PROCEDURE_NOTE">Procedure</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                SOAP Format
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subjective (S)"
                multiline
                rows={3}
                value={formData.subjective}
                onChange={(e) =>
                  setFormData({ ...formData, subjective: e.target.value })
                }
                placeholder="Patient's complaints, symptoms, and concerns..."
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Objective (O)"
                multiline
                rows={3}
                value={formData.objective}
                onChange={(e) =>
                  setFormData({ ...formData, objective: e.target.value })
                }
                placeholder="Vital signs, examination findings, lab results..."
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assessment (A)"
                multiline
                rows={3}
                value={formData.assessment}
                onChange={(e) =>
                  setFormData({ ...formData, assessment: e.target.value })
                }
                placeholder="Clinical impression, diagnosis, progress..."
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Plan (P)"
                multiline
                rows={3}
                value={formData.plan}
                onChange={(e) =>
                  setFormData({ ...formData, plan: e.target.value })
                }
                placeholder="Treatment plan, medications, follow-up..."
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button
            onClick={handleCreateNote}
            variant="contained"
            disabled={
              !formData.patientId ||
              !formData.subjective ||
              !formData.objective ||
              !formData.assessment ||
              !formData.plan
            }
          >
            Create Note
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Note Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Progress Note Details</DialogTitle>
        <DialogContent>
          {selectedNote && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Note Type
                  </Typography>
                  <Typography variant="body1">
                    {selectedNote.noteType}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Status
                  </Typography>
                  <Box mt={0.5}>
                    <Chip
                      label={selectedNote.status}
                      color={getStatusColor(selectedNote.status)}
                      size="small"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Author
                  </Typography>
                  <Typography variant="body1">
                    {selectedNote.author?.username || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Created
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedNote.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    SOAP Note
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary">
                    Subjective (S)
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedNote.subjective}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary">
                    Objective (O)
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedNote.objective}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary">
                    Assessment (A)
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedNote.assessment}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary">
                    Plan (P)
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedNote.plan}
                  </Typography>
                </Grid>
                {selectedNote.reviewComments && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" color="secondary">
                      Review Comments
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {selectedNote.reviewComments}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Reviewed by: {selectedNote.reviewer?.username || "N/A"} on{" "}
                      {selectedNote.reviewedAt
                        ? new Date(selectedNote.reviewedAt).toLocaleString()
                        : "N/A"}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Review Note Dialog */}
      <Dialog
        open={openReviewDialog}
        onClose={handleCloseReviewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Review Progress Note</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Review Comments"
            multiline
            rows={4}
            value={reviewData.reviewComments}
            onChange={(e) =>
              setReviewData({ ...reviewData, reviewComments: e.target.value })
            }
            sx={{ mt: 2 }}
            placeholder="Add your review comments..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button
            onClick={handleReviewNote}
            variant="contained"
            color="success"
          >
            Approve & Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProgressNotesPage;
