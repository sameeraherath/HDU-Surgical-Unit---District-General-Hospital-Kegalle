import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Badge,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  LocalHospital as LocalHospitalIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  fetchDashboardOverview,
  fetchAssignedTasks,
  updateTaskStatus,
  fetchPatientsList,
  fetchTaskStatistics,
  clearError,
} from "../features/houseOfficer/houseOfficerSlice";

const HouseOfficerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskStatus, setTaskStatus] = useState("");
  const [taskNotes, setTaskNotes] = useState("");

  const {
    dashboardOverview,
    assignedTasks,
    patientsList,
    taskStatistics,
    loading,
    error,
  } = useSelector((state) => state.houseOfficer);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    loadDashboardData();
  }, [dispatch]);

  const loadDashboardData = () => {
    dispatch(fetchDashboardOverview());
    dispatch(fetchAssignedTasks());
    dispatch(fetchPatientsList());
    dispatch(fetchTaskStatistics());
  };


  const handleTaskUpdate = async () => {
    if (!selectedTask || !taskStatus) return;

    try {
      await dispatch(
        updateTaskStatus({
          taskId: selectedTask.id,
          status: taskStatus,
          notes: taskNotes,
        })
      ).unwrap();
      
      setTaskDialogOpen(false);
      setSelectedTask(null);
      setTaskStatus("");
      setTaskNotes("");
      
      // Refresh tasks list
      dispatch(fetchAssignedTasks());
    } catch (err) {
      console.error("Failed to update task:", err);
      // Keep dialog open to allow retry
    }
  };

  const openTaskDialog = (task) => {
    setSelectedTask(task);
    setTaskStatus(task.status);
    setTaskNotes(task.completionNotes || "");
    setTaskDialogOpen(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "error";
      case "MEDIUM":
        return "warning";
      case "LOW":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "IN_PROGRESS":
        return "warning";
      case "PENDING":
        return "info";
      default:
        return "default";
    }
  };

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <Card
      sx={{
        height: "100%",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s",
        "&:hover": onClick ? { transform: "translateY(-2px)" } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2" color={color}>
              {value}
            </Typography>
          </Box>
          <Box color={color}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  const TaskRow = ({ task }) => (
    <TableRow hover>
      <TableCell>
        <Typography variant="body2" fontWeight="medium">
          {task.patient?.fullName}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Bed: {task.patient?.bedNumber || "N/A"}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{task.title}</Typography>
        <Typography variant="caption" color="textSecondary">
          {task.description}
        </Typography>
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
        <Typography variant="body2">
          {new Date(task.dueDate).toLocaleDateString()}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {new Date(task.dueDate).toLocaleTimeString()}
        </Typography>
      </TableCell>
      <TableCell>
        <IconButton
          size="small"
          onClick={() => openTaskDialog(task)}
          color="primary"
        >
          <EditIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  if (loading && !dashboardOverview) {
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          House Officer Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Welcome, {user?.nameWithInitials || user?.username}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Tasks"
            value={dashboardOverview?.overview?.todayTasks || 0}
            icon={<AssignmentIcon />}
            color="primary"
            onClick={() => setSelectedTab(1)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue Tasks"
            value={dashboardOverview?.overview?.overdueTasks || 0}
            icon={<WarningIcon />}
            color="error"
            onClick={() => setSelectedTab(1)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed This Week"
            value={dashboardOverview?.overview?.completedTasksThisWeek || 0}
            icon={<CheckCircleIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Patients"
            value={dashboardOverview?.overview?.activePatientsCount || 0}
            icon={<LocalHospitalIcon />}
            color="info"
            onClick={() => setSelectedTab(2)}
          />
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Overview" />
          <Tab 
            label={
              <Badge badgeContent={assignedTasks.length} color="primary">
                My Tasks
              </Badge>
            } 
          />
          <Tab label="Patients" />
        </Tabs>
        </Paper>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          {/* Recent Progress Notes */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Progress Notes
                </Typography>
                <List>
                  {dashboardOverview?.recentProgressNotes?.map((note, index) => (
                    <React.Fragment key={note.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight="medium">
                              {note.patient?.fullName}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" color="textSecondary">
                                {note.noteType} - {note.author?.nameWithInitials}
                              </Typography>
                              <Typography variant="body2" noWrap>
                                {note.subjective}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < dashboardOverview.recentProgressNotes.length - 1 && (
                        <Divider />
                      )}
                    </React.Fragment>
                  ))}
                  {(!dashboardOverview?.recentProgressNotes || dashboardOverview.recentProgressNotes.length === 0) && (
                    <ListItem>
                      <ListItemText primary="No recent progress notes" />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Critical Investigations */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Critical Investigations
                </Typography>
                <List>
                  {dashboardOverview?.criticalInvestigations?.map((investigation, index) => (
                    <React.Fragment key={investigation.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight="medium">
                              {investigation.patient?.fullName}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" color="textSecondary">
                                {investigation.testName} - {investigation.orderedByUser?.nameWithInitials}
                              </Typography>
                              <Typography variant="body2" noWrap>
                                {investigation.result}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < dashboardOverview.criticalInvestigations.length - 1 && (
                        <Divider />
                      )}
                    </React.Fragment>
                  ))}
                  {(!dashboardOverview?.criticalInvestigations || dashboardOverview.criticalInvestigations.length === 0) && (
                    <ListItem>
                      <ListItemText primary="No critical investigations" />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              My Assigned Tasks
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Task</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignedTasks.map((task) => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                  {assignedTasks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="textSecondary">
                          No tasks assigned
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {selectedTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Patients Overview
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Bed</TableCell>
                    <TableCell>Admission Date</TableCell>
                    <TableCell>Pending Tasks</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patientsList.map((patient) => (
                    <TableRow key={patient.id} hover>
                      <TableCell>{patient.patientNumber}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {patient.fullName}
                        </Typography>
                      </TableCell>
                      <TableCell>{patient.bedNumber || "N/A"}</TableCell>
                      <TableCell>
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={patient.tasks?.length || 0}
                          color={patient.tasks?.length > 0 ? "warning" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/house-officer/patients/${patient.id}`)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {patientsList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="textSecondary">
                          No patients found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Task Update Dialog */}
      <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Update Task Status
          <IconButton
            onClick={() => setTaskDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedTask && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedTask.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Patient: {selectedTask.patient?.fullName}
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedTask.description}
              </Typography>
              
              <TextField
                select
                fullWidth
                label="Status"
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
                margin="normal"
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </TextField>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
                margin="normal"
                placeholder="Add any notes about task completion..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleTaskUpdate} variant="contained" disabled={!taskStatus}>
            Update Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HouseOfficerDashboard;
