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
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  LocalPharmacy as PharmacyIcon,
} from "@mui/icons-material";
import {
  createPrescription,
  fetchPrescriptionsByPatient,
  fetchActivePrescriptions,
  fetchControlledPrescriptions,
  discontinuePrescription,
  verifyPrescription,
  dispensePrescription,
  setFilters,
  clearError,
} from "../features/prescriptions/prescriptionSlice";

const PrescriptionsPage = () => {
  const dispatch = useDispatch();
  const {
    prescriptions,
    activePrescriptions,
    controlledPrescriptions,
    pagination,
    filters,
    loading,
    error,
  } = useSelector((state) => state.prescriptions);
  const { user } = useSelector((state) => state.auth);

  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDiscontinueDialog, setOpenDiscontinueDialog] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [formData, setFormData] = useState({
    patientId: "",
    medicationName: "",
    medicationType: "TABLET",
    dosage: "",
    route: "ORAL",
    frequency: "",
    duration: "",
    durationUnit: "DAYS",
    indication: "",
    specialInstructions: "",
  });
  const [discontinueReason, setDiscontinueReason] = useState("");

  const loadPrescriptions = React.useCallback(() => {
    const params = { page: page + 1, limit: rowsPerPage, ...filters };
    if (currentTab === 0 && selectedPatientId) {
      dispatch(
        fetchPrescriptionsByPatient({ patientId: selectedPatientId, params })
      );
    } else if (currentTab === 1) {
      dispatch(fetchActivePrescriptions(params));
    } else if (currentTab === 2) {
      dispatch(fetchControlledPrescriptions(params));
    }
  }, [dispatch, currentTab, selectedPatientId, page, rowsPerPage, filters]);

  useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setPage(0);
  };

  const handleRefresh = () => {
    loadPrescriptions();
  };

  const handleOpenCreateDialog = () => {
    setFormData({
      patientId: selectedPatientId || "",
      medicationName: "",
      medicationType: "TABLET",
      dosage: "",
      route: "ORAL",
      frequency: "",
      duration: "",
      durationUnit: "DAYS",
      indication: "",
      specialInstructions: "",
    });
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleCreatePrescription = async () => {
    try {
      await dispatch(createPrescription(formData)).unwrap();
      handleCloseCreateDialog();
      loadPrescriptions();
    } catch (err) {
      console.error("Failed to create prescription:", err);
    }
  };

  const handleOpenViewDialog = (prescription) => {
    setSelectedPrescription(prescription);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedPrescription(null);
  };

  const handleOpenDiscontinueDialog = (prescription) => {
    setSelectedPrescription(prescription);
    setDiscontinueReason("");
    setOpenDiscontinueDialog(true);
  };

  const handleCloseDiscontinueDialog = () => {
    setOpenDiscontinueDialog(false);
    setSelectedPrescription(null);
  };

  const handleDiscontinuePrescription = async () => {
    try {
      await dispatch(
        discontinuePrescription({
          prescriptionId: selectedPrescription.id,
          discontinueData: { discontinuationReason: discontinueReason },
        })
      ).unwrap();
      handleCloseDiscontinueDialog();
      loadPrescriptions();
    } catch (err) {
      console.error("Failed to discontinue prescription:", err);
    }
  };

  const handleVerifyPrescription = async (prescriptionId) => {
    try {
      await dispatch(
        verifyPrescription({
          prescriptionId,
          verificationData: { verifiedBy: user.id },
        })
      ).unwrap();
      loadPrescriptions();
    } catch (err) {
      console.error("Failed to verify prescription:", err);
    }
  };

  const handleDispensePrescription = async (prescriptionId) => {
    try {
      await dispatch(
        dispensePrescription({
          prescriptionId,
          dispensingData: { dispensedBy: user.id },
        })
      ).unwrap();
      loadPrescriptions();
    } catch (err) {
      console.error("Failed to dispense prescription:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "VERIFIED":
        return "info";
      case "DISPENSED":
        return "primary";
      case "COMPLETED":
        return "default";
      case "DISCONTINUED":
        return "error";
      default:
        return "default";
    }
  };

  const getCurrentPrescriptions = () => {
    switch (currentTab) {
      case 0:
        return prescriptions;
      case 1:
        return activePrescriptions;
      case 2:
        return controlledPrescriptions;
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
        <Typography variant="h4">Prescriptions</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
          >
            New Prescription
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
          <Tab label="Patient Prescriptions" />
          <Tab label="Active Prescriptions" />
          <Tab label="Controlled Substances" />
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
                  <MenuItem value="VERIFIED">Verified</MenuItem>
                  <MenuItem value="DISPENSED">Dispensed</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="DISCONTINUED">Discontinued</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Prescriptions Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : currentTab === 0 && !selectedPatientId ? (
            <Box textAlign="center" p={3}>
              <Typography variant="body1" color="textSecondary">
                Please enter a Patient ID to view prescriptions
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Medication</TableCell>
                      <TableCell>Dosage</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Route</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Prescribed By</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getCurrentPrescriptions().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No prescriptions found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      getCurrentPrescriptions().map((rx) => (
                        <TableRow key={rx.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {rx.medicationName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {rx.medicationType}
                            </Typography>
                          </TableCell>
                          <TableCell>{rx.dosage}</TableCell>
                          <TableCell>{rx.frequency}</TableCell>
                          <TableCell>{rx.route}</TableCell>
                          <TableCell>
                            {rx.duration} {rx.durationUnit}
                            <Typography variant="caption" display="block">
                              Until {new Date(rx.endDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={rx.status}
                              color={getStatusColor(rx.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {rx.prescribedBy?.username || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={0.5}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenViewDialog(rx)}
                                  color="primary"
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {user?.role === "Pharmacist" &&
                                rx.status === "ACTIVE" && (
                                  <Tooltip title="Verify">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleVerifyPrescription(rx.id)
                                      }
                                      color="success"
                                    >
                                      <CheckCircleIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              {user?.role === "Pharmacist" &&
                                rx.status === "VERIFIED" && (
                                  <Tooltip title="Dispense">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleDispensePrescription(rx.id)
                                      }
                                      color="info"
                                    >
                                      <PharmacyIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              {(user?.id === rx.prescribedBy ||
                                user?.role === "Consultant") &&
                                rx.status === "ACTIVE" && (
                                  <Tooltip title="Discontinue">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleOpenDiscontinueDialog(rx)
                                      }
                                      color="error"
                                    >
                                      <BlockIcon fontSize="small" />
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

      {/* Create Prescription Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Prescription</DialogTitle>
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
              <TextField
                fullWidth
                label="Medication Name"
                value={formData.medicationName}
                onChange={(e) =>
                  setFormData({ ...formData, medicationName: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Medication Type</InputLabel>
                <Select
                  value={formData.medicationType}
                  label="Medication Type"
                  onChange={(e) =>
                    setFormData({ ...formData, medicationType: e.target.value })
                  }
                >
                  <MenuItem value="TABLET">Tablet</MenuItem>
                  <MenuItem value="CAPSULE">Capsule</MenuItem>
                  <MenuItem value="SYRUP">Syrup</MenuItem>
                  <MenuItem value="INJECTION">Injection</MenuItem>
                  <MenuItem value="CREAM">Cream</MenuItem>
                  <MenuItem value="OINTMENT">Ointment</MenuItem>
                  <MenuItem value="DROPS">Drops</MenuItem>
                  <MenuItem value="INHALER">Inhaler</MenuItem>
                  <MenuItem value="SUPPOSITORY">Suppository</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dosage"
                value={formData.dosage}
                onChange={(e) =>
                  setFormData({ ...formData, dosage: e.target.value })
                }
                placeholder="e.g., 500mg, 10ml"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Route</InputLabel>
                <Select
                  value={formData.route}
                  label="Route"
                  onChange={(e) =>
                    setFormData({ ...formData, route: e.target.value })
                  }
                >
                  <MenuItem value="ORAL">Oral</MenuItem>
                  <MenuItem value="IV">IV (Intravenous)</MenuItem>
                  <MenuItem value="IM">IM (Intramuscular)</MenuItem>
                  <MenuItem value="SC">SC (Subcutaneous)</MenuItem>
                  <MenuItem value="TOPICAL">Topical</MenuItem>
                  <MenuItem value="RECTAL">Rectal</MenuItem>
                  <MenuItem value="INHALATION">Inhalation</MenuItem>
                  <MenuItem value="SUBLINGUAL">Sublingual</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Frequency"
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
                placeholder="e.g., TDS, BD, QID"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Duration Unit</InputLabel>
                <Select
                  value={formData.durationUnit}
                  label="Duration Unit"
                  onChange={(e) =>
                    setFormData({ ...formData, durationUnit: e.target.value })
                  }
                >
                  <MenuItem value="DAYS">Days</MenuItem>
                  <MenuItem value="WEEKS">Weeks</MenuItem>
                  <MenuItem value="MONTHS">Months</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Indication"
                multiline
                rows={2}
                value={formData.indication}
                onChange={(e) =>
                  setFormData({ ...formData, indication: e.target.value })
                }
                placeholder="Reason for prescription..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Instructions"
                multiline
                rows={2}
                value={formData.specialInstructions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specialInstructions: e.target.value,
                  })
                }
                placeholder="e.g., Take with food, Avoid alcohol..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button
            onClick={handleCreatePrescription}
            variant="contained"
            disabled={
              !formData.patientId ||
              !formData.medicationName ||
              !formData.dosage ||
              !formData.frequency ||
              !formData.duration
            }
          >
            Create Prescription
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Prescription Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Prescription Details</DialogTitle>
        <DialogContent>
          {selectedPrescription && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Medication Name
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedPrescription.medicationName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Type
                  </Typography>
                  <Typography variant="body1">
                    {selectedPrescription.medicationType}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Dosage
                  </Typography>
                  <Typography variant="body1">
                    {selectedPrescription.dosage}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Route
                  </Typography>
                  <Typography variant="body1">
                    {selectedPrescription.route}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Frequency
                  </Typography>
                  <Typography variant="body1">
                    {selectedPrescription.frequency}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Duration
                  </Typography>
                  <Typography variant="body1">
                    {selectedPrescription.duration}{" "}
                    {selectedPrescription.durationUnit}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(
                      selectedPrescription.startDate
                    ).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    End Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(
                      selectedPrescription.endDate
                    ).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Status
                  </Typography>
                  <Box mt={0.5}>
                    <Chip
                      label={selectedPrescription.status}
                      color={getStatusColor(selectedPrescription.status)}
                      size="small"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">
                    Prescribed By
                  </Typography>
                  <Typography variant="body1">
                    {selectedPrescription.prescribedBy?.username || "N/A"}
                  </Typography>
                </Grid>
                {selectedPrescription.indication && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                      Indication
                    </Typography>
                    <Typography variant="body1">
                      {selectedPrescription.indication}
                    </Typography>
                  </Grid>
                )}
                {selectedPrescription.specialInstructions && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                      Special Instructions
                    </Typography>
                    <Typography variant="body1">
                      {selectedPrescription.specialInstructions}
                    </Typography>
                  </Grid>
                )}
                {selectedPrescription.verifiedBy && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="textSecondary">
                      Verified By
                    </Typography>
                    <Typography variant="body1">
                      {selectedPrescription.verifiedBy?.username || "N/A"}
                    </Typography>
                  </Grid>
                )}
                {selectedPrescription.dispensedBy && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="textSecondary">
                      Dispensed By
                    </Typography>
                    <Typography variant="body1">
                      {selectedPrescription.dispensedBy?.username || "N/A"}
                    </Typography>
                  </Grid>
                )}
                {selectedPrescription.discontinuationReason && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="error">
                      Discontinuation Reason
                    </Typography>
                    <Typography variant="body1">
                      {selectedPrescription.discontinuationReason}
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

      {/* Discontinue Prescription Dialog */}
      <Dialog
        open={openDiscontinueDialog}
        onClose={handleCloseDiscontinueDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Discontinue Prescription</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Reason for Discontinuation"
            multiline
            rows={4}
            value={discontinueReason}
            onChange={(e) => setDiscontinueReason(e.target.value)}
            sx={{ mt: 2 }}
            placeholder="Please provide a reason for discontinuing this prescription..."
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDiscontinueDialog}>Cancel</Button>
          <Button
            onClick={handleDiscontinuePrescription}
            variant="contained"
            color="error"
            disabled={!discontinueReason}
          >
            Discontinue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrescriptionsPage;
