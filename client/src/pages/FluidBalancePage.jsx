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
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import {
  recordFluidBalance,
  fetchFluidBalanceByPatient,
  fetchFluidBalanceSummary,
  updateFluidBalance,
  verifyFluidBalance,
  deleteFluidBalance,
  setFilters,
  clearError,
} from "../features/fluidBalance/fluidBalanceSlice";

const FluidBalancePage = () => {
  const dispatch = useDispatch();
  const { records, summary, pagination, filters, loading, error } = useSelector(
    (state) => state.fluidBalance
  );
  const { user } = useSelector((state) => state.auth);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [openRecordDialog, setOpenRecordDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordData, setRecordData] = useState({
    patientId: "",
    recordType: "INPUT",
    description: "",
    volume: "",
    unit: "mL",
    shiftTime: "MORNING",
    notes: "",
  });

  const loadFluidBalance = React.useCallback(() => {
    if (selectedPatientId) {
      const params = { page: page + 1, limit: rowsPerPage, ...filters };
      dispatch(
        fetchFluidBalanceByPatient({ patientId: selectedPatientId, params })
      );
      dispatch(
        fetchFluidBalanceSummary({ patientId: selectedPatientId, params: {} })
      );
    }
  }, [dispatch, selectedPatientId, page, rowsPerPage, filters]);

  useEffect(() => {
    loadFluidBalance();
  }, [loadFluidBalance]);

  const handleRefresh = () => {
    loadFluidBalance();
  };

  const handleOpenRecordDialog = () => {
    setRecordData({
      patientId: selectedPatientId || "",
      recordType: "INPUT",
      description: "",
      volume: "",
      unit: "mL",
      shiftTime: "MORNING",
      notes: "",
    });
    setOpenRecordDialog(true);
  };

  const handleCloseRecordDialog = () => {
    setOpenRecordDialog(false);
  };

  const handleRecordFluidBalance = async () => {
    try {
      await dispatch(recordFluidBalance(recordData)).unwrap();
      handleCloseRecordDialog();
      loadFluidBalance();
    } catch (err) {
      console.error("Failed to record fluid balance:", err);
    }
  };

  const handleOpenEditDialog = (record) => {
    setSelectedRecord(record);
    setRecordData({
      patientId: record.patientId,
      recordType: record.recordType,
      description: record.description,
      volume: record.volume,
      unit: record.unit,
      shiftTime: record.shiftTime,
      notes: record.notes || "",
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedRecord(null);
  };

  const handleUpdateFluidBalance = async () => {
    try {
      await dispatch(
        updateFluidBalance({
          recordId: selectedRecord.id,
          updateData: recordData,
        })
      ).unwrap();
      handleCloseEditDialog();
      loadFluidBalance();
    } catch (err) {
      console.error("Failed to update fluid balance:", err);
    }
  };

  const handleVerifyRecord = async (recordId) => {
    try {
      await dispatch(
        verifyFluidBalance({
          recordId,
          verificationData: { verifiedBy: user.id },
        })
      ).unwrap();
      loadFluidBalance();
    } catch (err) {
      console.error("Failed to verify record:", err);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await dispatch(deleteFluidBalance(recordId)).unwrap();
        loadFluidBalance();
      } catch (err) {
        console.error("Failed to delete record:", err);
      }
    }
  };

  const getShiftColor = (shift) => {
    switch (shift) {
      case "MORNING":
        return "primary";
      case "EVENING":
        return "warning";
      case "NIGHT":
        return "info";
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
        <Typography variant="h4">Fluid Balance</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenRecordDialog}
            disabled={!selectedPatientId}
          >
            Record Fluid
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
                <InputLabel>Record Type</InputLabel>
                <Select
                  value={filters.recordType || ""}
                  label="Record Type"
                  onChange={(e) =>
                    dispatch(setFilters({ recordType: e.target.value }))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="INPUT">Input</MenuItem>
                  <MenuItem value="OUTPUT">Output</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Shift</InputLabel>
                <Select
                  value={filters.shiftTime || ""}
                  label="Shift"
                  onChange={(e) =>
                    dispatch(setFilters({ shiftTime: e.target.value }))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="MORNING">Morning (6-14)</MenuItem>
                  <MenuItem value="EVENING">Evening (14-22)</MenuItem>
                  <MenuItem value="NIGHT">Night (22-6)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 24h Summary Cards */}
      {selectedPatientId && summary && (
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h4" color="primary">
                  {summary.totalInput || 0} mL
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Total Input (24h)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h4" color="error">
                  {summary.totalOutput || 0} mL
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Total Output (24h)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="h4"
                  color={summary.balance >= 0 ? "success.main" : "error.main"}
                >
                  {summary.balance > 0 ? "+" : ""}
                  {summary.balance || 0} mL
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Balance (24h)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Records Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : !selectedPatientId ? (
            <Box textAlign="center" p={3}>
              <Typography variant="body1" color="textSecondary">
                Please enter a Patient ID to view fluid balance records
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Volume</TableCell>
                      <TableCell>Shift</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Recorded By</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {records.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No fluid balance records found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      records.map((record) => (
                        <TableRow key={record.id} hover>
                          <TableCell>
                            <Chip
                              label={record.recordType}
                              color={
                                record.recordType === "INPUT"
                                  ? "primary"
                                  : "error"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {record.volume} {record.unit}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={record.shiftTime}
                              color={getShiftColor(record.shiftTime)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(record.recordedAt).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatDistanceToNow(
                                new Date(record.recordedAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {record.recordedBy?.username || "N/A"}
                          </TableCell>
                          <TableCell>
                            {record.isVerified ? (
                              <Chip
                                label="Verified"
                                color="success"
                                size="small"
                              />
                            ) : (
                              <Chip
                                label="Unverified"
                                color="warning"
                                size="small"
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={0.5}>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenEditDialog(record)}
                                  color="primary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {!record.isVerified &&
                                (user?.role === "Consultant" ||
                                  user?.role === "Medical Officer") && (
                                  <Tooltip title="Verify">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleVerifyRecord(record.id)
                                      }
                                      color="success"
                                    >
                                      <CheckCircleIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              {(user?.id === record.recordedBy ||
                                user?.role === "Consultant") && (
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleDeleteRecord(record.id)
                                    }
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

      {/* Record Fluid Balance Dialog */}
      <Dialog
        open={openRecordDialog}
        onClose={handleCloseRecordDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Record Fluid Balance</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Patient ID"
                type="number"
                value={recordData.patientId}
                onChange={(e) =>
                  setRecordData({ ...recordData, patientId: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Record Type</InputLabel>
                <Select
                  value={recordData.recordType}
                  label="Record Type"
                  onChange={(e) =>
                    setRecordData({ ...recordData, recordType: e.target.value })
                  }
                >
                  <MenuItem value="INPUT">Input</MenuItem>
                  <MenuItem value="OUTPUT">Output</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={recordData.description}
                onChange={(e) =>
                  setRecordData({ ...recordData, description: e.target.value })
                }
                placeholder="e.g., IV Fluid, Oral intake, Urine output..."
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Volume"
                type="number"
                value={recordData.volume}
                onChange={(e) =>
                  setRecordData({ ...recordData, volume: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={recordData.unit}
                  label="Unit"
                  onChange={(e) =>
                    setRecordData({ ...recordData, unit: e.target.value })
                  }
                >
                  <MenuItem value="mL">mL</MenuItem>
                  <MenuItem value="L">L</MenuItem>
                  <MenuItem value="cc">cc</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Shift Time</InputLabel>
                <Select
                  value={recordData.shiftTime}
                  label="Shift Time"
                  onChange={(e) =>
                    setRecordData({ ...recordData, shiftTime: e.target.value })
                  }
                >
                  <MenuItem value="MORNING">Morning (6:00 - 14:00)</MenuItem>
                  <MenuItem value="EVENING">Evening (14:00 - 22:00)</MenuItem>
                  <MenuItem value="NIGHT">Night (22:00 - 6:00)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={recordData.notes}
                onChange={(e) =>
                  setRecordData({ ...recordData, notes: e.target.value })
                }
                placeholder="Additional notes or observations..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRecordDialog}>Cancel</Button>
          <Button
            onClick={handleRecordFluidBalance}
            variant="contained"
            disabled={
              !recordData.patientId ||
              !recordData.description ||
              !recordData.volume
            }
          >
            Record
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Record Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Fluid Balance Record</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Record Type</InputLabel>
                <Select
                  value={recordData.recordType}
                  label="Record Type"
                  onChange={(e) =>
                    setRecordData({ ...recordData, recordType: e.target.value })
                  }
                >
                  <MenuItem value="INPUT">Input</MenuItem>
                  <MenuItem value="OUTPUT">Output</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Volume"
                type="number"
                value={recordData.volume}
                onChange={(e) =>
                  setRecordData({ ...recordData, volume: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={recordData.description}
                onChange={(e) =>
                  setRecordData({ ...recordData, description: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={recordData.notes}
                onChange={(e) =>
                  setRecordData({ ...recordData, notes: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button
            onClick={handleUpdateFluidBalance}
            variant="contained"
            disabled={!recordData.description || !recordData.volume}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FluidBalancePage;
