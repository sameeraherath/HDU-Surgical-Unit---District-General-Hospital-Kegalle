import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Tabs,
  Tab,
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
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Science as ScienceIcon,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import {
  orderInvestigation,
  fetchInvestigationsByPatient,
  fetchPendingInvestigations,
  fetchCriticalInvestigations,
  cancelInvestigation,
  addInvestigationResult,
  reviewInvestigation,
  setFilters,
  clearError,
} from "../features/investigations/investigationSlice";

const InvestigationsPage = () => {
  const dispatch = useDispatch();
  const {
    investigations,
    pendingInvestigations,
    criticalInvestigations,
    pagination,
    filters,
    loading,
    error,
  } = useSelector((state) => state.investigations);
  const { user } = useSelector((state) => state.auth);

  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [orderData, setOrderData] = useState({
    patientId: "",
    investigationType: "LABORATORY",
    testName: "",
    specimen: "",
    urgency: "ROUTINE",
    clinicalNotes: "",
    specialInstructions: "",
  });
  const [resultData, setResultData] = useState({
    testName: "",
    result: "",
    unit: "",
    referenceRange: "",
    isAbnormal: false,
    severity: "NORMAL",
    interpretation: "",
    comments: "",
  });
  const [reviewData, setReviewData] = useState({
    reviewComments: "",
  });

  const loadInvestigations = React.useCallback(() => {
    const params = { page: page + 1, limit: rowsPerPage, ...filters };
    if (currentTab === 0 && selectedPatientId) {
      dispatch(
        fetchInvestigationsByPatient({ patientId: selectedPatientId, params })
      );
    } else if (currentTab === 1) {
      dispatch(fetchPendingInvestigations(params));
    } else if (currentTab === 2) {
      dispatch(fetchCriticalInvestigations(params));
    }
  }, [dispatch, currentTab, selectedPatientId, page, rowsPerPage, filters]);

  useEffect(() => {
    loadInvestigations();
  }, [loadInvestigations]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setPage(0);
  };

  const handleRefresh = () => {
    loadInvestigations();
  };

  const handleOpenOrderDialog = () => {
    setOrderData({
      patientId: selectedPatientId || "",
      investigationType: "LABORATORY",
      testName: "",
      specimen: "",
      urgency: "ROUTINE",
      clinicalNotes: "",
      specialInstructions: "",
    });
    setOpenOrderDialog(true);
  };

  const handleCloseOrderDialog = () => {
    setOpenOrderDialog(false);
  };

  const handleOrderInvestigation = async () => {
    try {
      await dispatch(orderInvestigation(orderData)).unwrap();
      handleCloseOrderDialog();
      loadInvestigations();
    } catch (err) {
      console.error("Failed to order investigation:", err);
    }
  };

  const handleOpenViewDialog = (investigation) => {
    setSelectedInvestigation(investigation);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedInvestigation(null);
  };

  const handleOpenResultDialog = (investigation) => {
    setSelectedInvestigation(investigation);
    setResultData({
      testName: investigation.testName || "",
      result: "",
      unit: "",
      referenceRange: "",
      isAbnormal: false,
      severity: "NORMAL",
      interpretation: "",
      comments: "",
    });
    setOpenResultDialog(true);
  };

  const handleCloseResultDialog = () => {
    setOpenResultDialog(false);
    setSelectedInvestigation(null);
  };

  const handleAddResult = async () => {
    try {
      await dispatch(
        addInvestigationResult({
          investigationId: selectedInvestigation.id,
          resultData,
        })
      ).unwrap();
      handleCloseResultDialog();
      loadInvestigations();
    } catch (err) {
      console.error("Failed to add result:", err);
    }
  };

  const handleOpenReviewDialog = (investigation) => {
    setSelectedInvestigation(investigation);
    setReviewData({ reviewComments: "" });
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setSelectedInvestigation(null);
  };

  const handleReviewInvestigation = async () => {
    try {
      await dispatch(
        reviewInvestigation({
          investigationId: selectedInvestigation.id,
          reviewData,
        })
      ).unwrap();
      handleCloseReviewDialog();
      loadInvestigations();
    } catch (err) {
      console.error("Failed to review investigation:", err);
    }
  };

  const handleCancelInvestigation = async (investigationId) => {
    if (window.confirm("Are you sure you want to cancel this investigation?")) {
      try {
        await dispatch(
          cancelInvestigation({
            investigationId,
            cancellationData: { cancellationReason: "Cancelled by user" },
          })
        ).unwrap();
        loadInvestigations();
      } catch (err) {
        console.error("Failed to cancel investigation:", err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
      case "REVIEWED":
        return "success";
      case "IN_PROGRESS":
      case "SPECIMEN_COLLECTED":
        return "warning";
      case "ORDERED":
        return "info";
      case "CANCELLED":
        return "default";
      default:
        return "default";
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "STAT":
        return "error";
      case "URGENT":
        return "warning";
      case "ROUTINE":
        return "info";
      default:
        return "default";
    }
  };

  const getCurrentInvestigations = () => {
    switch (currentTab) {
      case 0:
        return investigations;
      case 1:
        return pendingInvestigations;
      case 2:
        return criticalInvestigations;
      default:
        return [];
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
        <Typography variant="h4">Investigations</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenOrderDialog}
          >
            Order Investigation
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

      {/* Tabs */}
      <Card sx={{ mb: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Patient Investigations" />
          <Tab label="Pending" />
          <Tab label="Critical Results" />
        </Tabs>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            {currentTab === 0 && (
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
            )}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Investigation Type</InputLabel>
                <Select
                  value={filters.investigationType || ""}
                  label="Investigation Type"
                  onChange={(e) =>
                    dispatch(setFilters({ investigationType: e.target.value }))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="LABORATORY">Laboratory</MenuItem>
                  <MenuItem value="RADIOLOGY">Radiology</MenuItem>
                  <MenuItem value="PATHOLOGY">Pathology</MenuItem>
                  <MenuItem value="CARDIOLOGY">Cardiology</MenuItem>
                  <MenuItem value="ENDOSCOPY">Endoscopy</MenuItem>
                  <MenuItem value="ULTRASOUND">Ultrasound</MenuItem>
                  <MenuItem value="CT_SCAN">CT Scan</MenuItem>
                  <MenuItem value="MRI">MRI</MenuItem>
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
                  <MenuItem value="ORDERED">Ordered</MenuItem>
                  <MenuItem value="SPECIMEN_COLLECTED">
                    Specimen Collected
                  </MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="REVIEWED">Reviewed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Urgency</InputLabel>
                <Select
                  value={filters.urgency || ""}
                  label="Urgency"
                  onChange={(e) =>
                    dispatch(setFilters({ urgency: e.target.value }))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="ROUTINE">Routine</MenuItem>
                  <MenuItem value="URGENT">Urgent</MenuItem>
                  <MenuItem value="STAT">STAT</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Investigations Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : currentTab === 0 && !selectedPatientId ? (
            <Box textAlign="center" p={3}>
              <Typography variant="body1" color="textSecondary">
                Please enter a Patient ID to view investigations
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Test Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Urgency</TableCell>
                      <TableCell>Ordered Date</TableCell>
                      <TableCell>Ordered By</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getCurrentInvestigations().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No investigations found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      getCurrentInvestigations().map((inv) => (
                        <TableRow key={inv.id} hover>
                          <TableCell>
                            <Chip label={inv.investigationType} size="small" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {inv.testName}
                            </Typography>
                            {inv.specimen && (
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                Specimen: {inv.specimen}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={inv.status}
                              color={getStatusColor(inv.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={inv.urgency}
                              color={getUrgencyColor(inv.urgency)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(inv.orderedAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatDistanceToNow(new Date(inv.orderedAt), {
                                addSuffix: true,
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {inv.orderedBy?.username || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={0.5}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenViewDialog(inv)}
                                  color="primary"
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {(user?.role === "Lab Technician" ||
                                user?.role === "Consultant") &&
                                inv.status === "COMPLETED" && (
                                  <Tooltip title="Add Result">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleOpenResultDialog(inv)
                                      }
                                      color="info"
                                    >
                                      <ScienceIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              {user?.role === "Consultant" &&
                                inv.status === "COMPLETED" && (
                                  <Tooltip title="Review">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleOpenReviewDialog(inv)
                                      }
                                      color="success"
                                    >
                                      <CheckCircleIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              {(user?.id === inv.orderedBy ||
                                user?.role === "Consultant") &&
                                inv.status !== "CANCELLED" && (
                                  <Tooltip title="Cancel">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleCancelInvestigation(inv.id)
                                      }
                                      color="error"
                                    >
                                      <CancelIcon fontSize="small" />
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

      {/* Order Investigation Dialog */}
      <Dialog
        open={openOrderDialog}
        onClose={handleCloseOrderDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Order Investigation</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Patient ID"
                type="number"
                value={orderData.patientId}
                onChange={(e) =>
                  setOrderData({ ...orderData, patientId: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Investigation Type</InputLabel>
                <Select
                  value={orderData.investigationType}
                  label="Investigation Type"
                  onChange={(e) =>
                    setOrderData({
                      ...orderData,
                      investigationType: e.target.value,
                    })
                  }
                >
                  <MenuItem value="LABORATORY">Laboratory</MenuItem>
                  <MenuItem value="RADIOLOGY">Radiology</MenuItem>
                  <MenuItem value="PATHOLOGY">Pathology</MenuItem>
                  <MenuItem value="CARDIOLOGY">Cardiology</MenuItem>
                  <MenuItem value="ENDOSCOPY">Endoscopy</MenuItem>
                  <MenuItem value="ULTRASOUND">Ultrasound</MenuItem>
                  <MenuItem value="CT_SCAN">CT Scan</MenuItem>
                  <MenuItem value="MRI">MRI</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Test Name"
                value={orderData.testName}
                onChange={(e) =>
                  setOrderData({ ...orderData, testName: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Specimen"
                value={orderData.specimen}
                onChange={(e) =>
                  setOrderData({ ...orderData, specimen: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Urgency</InputLabel>
                <Select
                  value={orderData.urgency}
                  label="Urgency"
                  onChange={(e) =>
                    setOrderData({ ...orderData, urgency: e.target.value })
                  }
                >
                  <MenuItem value="ROUTINE">Routine</MenuItem>
                  <MenuItem value="URGENT">Urgent</MenuItem>
                  <MenuItem value="STAT">STAT</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Clinical Notes"
                multiline
                rows={3}
                value={orderData.clinicalNotes}
                onChange={(e) =>
                  setOrderData({ ...orderData, clinicalNotes: e.target.value })
                }
                placeholder="Clinical indication and relevant history..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Instructions"
                multiline
                rows={2}
                value={orderData.specialInstructions}
                onChange={(e) =>
                  setOrderData({
                    ...orderData,
                    specialInstructions: e.target.value,
                  })
                }
                placeholder="Any special preparation or handling requirements..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOrderDialog}>Cancel</Button>
          <Button
            onClick={handleOrderInvestigation}
            variant="contained"
            disabled={!orderData.patientId || !orderData.testName}
          >
            Order Investigation
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Investigation Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Investigation Details</DialogTitle>
        <DialogContent>
          {selectedInvestigation && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Investigation Type
                  </Typography>
                  <Typography variant="body1">
                    {selectedInvestigation.investigationType}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Test Name
                  </Typography>
                  <Typography variant="body1">
                    {selectedInvestigation.testName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Status
                  </Typography>
                  <Box mt={0.5}>
                    <Chip
                      label={selectedInvestigation.status}
                      color={getStatusColor(selectedInvestigation.status)}
                      size="small"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Urgency
                  </Typography>
                  <Box mt={0.5}>
                    <Chip
                      label={selectedInvestigation.urgency}
                      color={getUrgencyColor(selectedInvestigation.urgency)}
                      size="small"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Ordered By
                  </Typography>
                  <Typography variant="body1">
                    {selectedInvestigation.orderedBy?.username || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Ordered Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedInvestigation.orderedAt).toLocaleString()}
                  </Typography>
                </Grid>
                {selectedInvestigation.specimen && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                      Specimen
                    </Typography>
                    <Typography variant="body1">
                      {selectedInvestigation.specimen}
                    </Typography>
                  </Grid>
                )}
                {selectedInvestigation.clinicalNotes && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                      Clinical Notes
                    </Typography>
                    <Typography variant="body1">
                      {selectedInvestigation.clinicalNotes}
                    </Typography>
                  </Grid>
                )}
                {selectedInvestigation.specialInstructions && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                      Special Instructions
                    </Typography>
                    <Typography variant="body1">
                      {selectedInvestigation.specialInstructions}
                    </Typography>
                  </Grid>
                )}
                {selectedInvestigation.reviewComments && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" color="secondary">
                      Review Comments
                    </Typography>
                    <Typography variant="body2">
                      {selectedInvestigation.reviewComments}
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

      {/* Add Result Dialog */}
      <Dialog
        open={openResultDialog}
        onClose={handleCloseResultDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Investigation Result</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Test Name"
                value={resultData.testName}
                onChange={(e) =>
                  setResultData({ ...resultData, testName: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Result"
                value={resultData.result}
                onChange={(e) =>
                  setResultData({ ...resultData, result: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Unit"
                value={resultData.unit}
                onChange={(e) =>
                  setResultData({ ...resultData, unit: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reference Range"
                value={resultData.referenceRange}
                onChange={(e) =>
                  setResultData({
                    ...resultData,
                    referenceRange: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Is Abnormal</InputLabel>
                <Select
                  value={resultData.isAbnormal}
                  label="Is Abnormal"
                  onChange={(e) =>
                    setResultData({ ...resultData, isAbnormal: e.target.value })
                  }
                >
                  <MenuItem value={false}>No</MenuItem>
                  <MenuItem value={true}>Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={resultData.severity}
                  label="Severity"
                  onChange={(e) =>
                    setResultData({ ...resultData, severity: e.target.value })
                  }
                >
                  <MenuItem value="NORMAL">Normal</MenuItem>
                  <MenuItem value="MILD">Mild</MenuItem>
                  <MenuItem value="MODERATE">Moderate</MenuItem>
                  <MenuItem value="SEVERE">Severe</MenuItem>
                  <MenuItem value="CRITICAL">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Interpretation"
                multiline
                rows={3}
                value={resultData.interpretation}
                onChange={(e) =>
                  setResultData({
                    ...resultData,
                    interpretation: e.target.value,
                  })
                }
                placeholder="Clinical interpretation of the results..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comments"
                multiline
                rows={2}
                value={resultData.comments}
                onChange={(e) =>
                  setResultData({ ...resultData, comments: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResultDialog}>Cancel</Button>
          <Button
            onClick={handleAddResult}
            variant="contained"
            disabled={!resultData.testName || !resultData.result}
          >
            Add Result
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Investigation Dialog */}
      <Dialog
        open={openReviewDialog}
        onClose={handleCloseReviewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Review Investigation</DialogTitle>
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
            onClick={handleReviewInvestigation}
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

export default InvestigationsPage;
