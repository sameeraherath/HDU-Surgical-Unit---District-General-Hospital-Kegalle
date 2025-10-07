import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  LocalHospital as HospitalIcon,
  Note as NoteIcon,
  Science as ScienceIcon,
  Medication as MedicationIcon,
  Assignment as AssignmentIcon,
  WaterDrop as WaterDropIcon,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { fetchPatientSummary } from "../features/medicalOfficer/medicalOfficerSlice";

const PatientDetailPage = () => {
  const { patientId } = useParams();
  const dispatch = useDispatch();
  const { currentPatientSummary, loading, error } = useSelector(
    (state) => state.medicalOfficer
  );

  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    if (patientId) {
      loadPatientSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const loadPatientSummary = () => {
    dispatch(fetchPatientSummary(patientId));
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleRefresh = () => {
    loadPatientSummary();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
      case "COMPLETED":
      case "VERIFIED":
        return "success";
      case "PENDING":
      case "IN_PROGRESS":
        return "warning";
      case "CRITICAL":
      case "OVERDUE":
        return "error";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "CRITICAL":
      case "URGENT":
        return "error";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "info";
      case "LOW":
        return "default";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!currentPatientSummary) {
    return (
      <Box p={3}>
        <Alert severity="info">No patient data available</Alert>
      </Box>
    );
  }

  const {
    patient,
    latestNote,
    investigations,
    prescriptions,
    tasks,
    fluidBalance,
  } = currentPatientSummary;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h4">Patient Details</Typography>
          <Typography variant="body2" color="textSecondary">
            Patient ID: {patientId}
          </Typography>
        </Box>
        <IconButton onClick={handleRefresh} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Patient Basic Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="textSecondary">
                Name
              </Typography>
              <Typography variant="h6">{patient?.name || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="caption" color="textSecondary">
                Age/Gender
              </Typography>
              <Typography variant="body1">
                {patient?.age || "N/A"} / {patient?.gender || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="caption" color="textSecondary">
                BHT Number
              </Typography>
              <Typography variant="body1">
                {patient?.bhtNumber || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="textSecondary">
                Admission Date
              </Typography>
              <Typography variant="body1">
                {patient?.admissionDate
                  ? new Date(patient.admissionDate).toLocaleDateString()
                  : "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="caption" color="textSecondary">
                Status
              </Typography>
              <Box mt={0.5}>
                <Chip
                  label={patient?.status || "N/A"}
                  color={getStatusColor(patient?.status)}
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <NoteIcon color="primary" />
                <Box>
                  <Typography variant="h6">
                    {currentPatientSummary?.noteCount || 0}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Progress Notes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <ScienceIcon color="secondary" />
                <Box>
                  <Typography variant="h6">
                    {investigations?.pending || 0} /{" "}
                    {investigations?.critical || 0}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Pending / Critical
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <MedicationIcon color="info" />
                <Box>
                  <Typography variant="h6">
                    {prescriptions?.active || 0}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Active Prescriptions
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <AssignmentIcon color="warning" />
                <Box>
                  <Typography variant="h6">{tasks?.pending || 0}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Pending Tasks
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Latest Note" icon={<NoteIcon />} iconPosition="start" />
          <Tab
            label="Investigations"
            icon={<ScienceIcon />}
            iconPosition="start"
          />
          <Tab
            label="Prescriptions"
            icon={<MedicationIcon />}
            iconPosition="start"
          />
          <Tab label="Tasks" icon={<AssignmentIcon />} iconPosition="start" />
          <Tab
            label="Fluid Balance"
            icon={<WaterDropIcon />}
            iconPosition="start"
          />
        </Tabs>

        <CardContent>
          {/* Latest Note Tab */}
          {currentTab === 0 && (
            <Box>
              {latestNote ? (
                <Box>
                  <Grid container spacing={2} mb={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Note Type
                      </Typography>
                      <Typography variant="body1">
                        {latestNote.noteType}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(latestNote.createdAt).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Author
                      </Typography>
                      <Typography variant="body1">
                        {latestNote.author?.username || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="textSecondary">
                        Status
                      </Typography>
                      <Box mt={0.5}>
                        <Chip
                          label={latestNote.status}
                          color={getStatusColor(latestNote.status)}
                          size="small"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    SOAP Note
                  </Typography>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="primary">
                      Subjective (S)
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {latestNote.subjective}
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="primary">
                      Objective (O)
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {latestNote.objective}
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="primary">
                      Assessment (A)
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {latestNote.assessment}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Plan (P)
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {latestNote.plan}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Alert severity="info">No progress notes available</Alert>
              )}
            </Box>
          )}

          {/* Investigations Tab */}
          {currentTab === 1 && (
            <Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Urgency</TableCell>
                      <TableCell>Ordered Date</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {investigations?.list?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No investigations found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      investigations?.list?.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell>{inv.investigationType}</TableCell>
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
                              color={getPriorityColor(inv.urgency)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(inv.orderedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{inv.clinicalNotes}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Prescriptions Tab */}
          {currentTab === 2 && (
            <Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Medication</TableCell>
                      <TableCell>Dosage</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Route</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Start Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prescriptions?.list?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No prescriptions found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      prescriptions?.list?.map((rx) => (
                        <TableRow key={rx.id}>
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
                            <Chip
                              label={rx.status}
                              color={getStatusColor(rx.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(rx.startDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Tasks Tab */}
          {currentTab === 3 && (
            <Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Assigned To</TableCell>
                      <TableCell>Due Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks?.list?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No tasks found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      tasks?.list?.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {task.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={task.taskType} size="small" />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={task.priority}
                              color={getPriorityColor(task.priority)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={task.status}
                              color={getStatusColor(task.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {task.assignee?.username || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatDistanceToNow(new Date(task.dueDate), {
                                addSuffix: true,
                              })}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Fluid Balance Tab */}
          {currentTab === 4 && (
            <Box>
              {fluidBalance ? (
                <>
                  <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" color="primary">
                            {fluidBalance.totalInput || 0} mL
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
                          <Typography variant="h6" color="error">
                            {fluidBalance.totalOutput || 0} mL
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
                            variant="h6"
                            color={
                              fluidBalance.balance >= 0
                                ? "success.main"
                                : "error.main"
                            }
                          >
                            {fluidBalance.balance > 0 ? "+" : ""}
                            {fluidBalance.balance || 0} mL
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Balance (24h)
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Volume (mL)</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Recorded By</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fluidBalance.records?.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              <Typography variant="body2" color="textSecondary">
                                No fluid balance records
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          fluidBalance.records?.map((record) => (
                            <TableRow key={record.id}>
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
                              <TableCell>{record.volume}</TableCell>
                              <TableCell>
                                {new Date(record.recordedAt).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {record.recordedBy?.username || "N/A"}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <Alert severity="info">No fluid balance data available</Alert>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PatientDetailPage;
