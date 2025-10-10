import React, { useEffect } from "react";
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
} from "@mui/material";
import {
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Science as ScienceIcon,
  Medication as MedicationIcon,
  Task as TaskIcon,
  LocalHospital as LocalHospitalIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { fetchDashboardOverview, clearError } from "../features/medicalOfficer/medicalOfficerSlice";
import { fetchTaskStatistics } from "../features/tasks/taskSlice";

const MedicalOfficerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dashboardOverview, loading, error } = useSelector(
    (state) => state.medicalOfficer
  );
  const { statistics: taskStats = {} } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const loadDashboardData = () => {
    dispatch(fetchDashboardOverview());
    dispatch(fetchTaskStatistics());
  };

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const StatCard = ({ title, value, icon, color, onClick }) => (
    <Card
      sx={{
        height: "100%",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s",
        border: "1px solid #e0e0e0",
        "&:hover": onClick
          ? {
              transform: "translateY(-4px)",
              border: "1px solid #b0b0b0",
            }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ color, fontWeight: "bold" }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: 2,
              p: 1.5,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading && !dashboardOverview.overview) {
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

  const { overview = {}, patientsNeedingAttention = 0, recentPatients = [] } =
    dashboardOverview || {};

  // Provide fallback values for task statistics
  const taskStatsData = {
    totalTasks: taskStats.totalTasks || 0,
    pendingTasks: taskStats.pendingTasks || 0,
    inProgressTasks: taskStats.inProgressTasks || 0,
    completedTasks: taskStats.completedTasks || 0,
    overdueTasks: taskStats.overdueTasks || 0,
    urgentTasks: taskStats.urgentTasks || 0,
  };

  // Provide fallback values for overview data
  const overviewData = {
    activePatientsCount: overview.activePatientsCount || 0,
    todayTasks: overview.todayTasks || 0,
    overdueTasks: overview.overdueTasks || 0,
    pendingInvestigations: overview.pendingInvestigations || 0,
    criticalInvestigations: overview.criticalInvestigations || 0,
    activePrescriptions: overview.activePrescriptions || 0,
    todayNotes: overview.todayNotes || 0,
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Medical Officer Dashboard
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Welcome back, Dr. {user?.username}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Patients"
            value={overviewData.activePatientsCount}
            icon={<PersonIcon sx={{ fontSize: 40, color: "#1976d2" }} />}
            color="#1976d2"
            onClick={() => navigate("/medical-officer/patients")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Tasks"
            value={overviewData.todayTasks}
            icon={<TaskIcon sx={{ fontSize: 40, color: "#2e7d32" }} />}
            color="#2e7d32"
            onClick={() => navigate("/medical-officer/tasks")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue Tasks"
            value={overviewData.overdueTasks}
            icon={<WarningIcon sx={{ fontSize: 40, color: "#ed6c02" }} />}
            color="#ed6c02"
            onClick={() => navigate("/medical-officer/tasks?filter=overdue")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Investigations"
            value={overviewData.pendingInvestigations}
            icon={<ScienceIcon sx={{ fontSize: 40, color: "#9c27b0" }} />}
            color="#9c27b0"
            onClick={() =>
              navigate("/medical-officer/investigations?filter=pending")
            }
          />
        </Grid>
      </Grid>

      {/* Secondary Stats */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Critical Investigations"
            value={overviewData.criticalInvestigations}
            icon={<WarningIcon sx={{ fontSize: 40, color: "#d32f2f" }} />}
            color="#d32f2f"
            onClick={() =>
              navigate("/medical-officer/investigations?filter=critical")
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Prescriptions"
            value={overviewData.activePrescriptions}
            icon={<MedicationIcon sx={{ fontSize: 40, color: "#0288d1" }} />}
            color="#0288d1"
            onClick={() => navigate("/medical-officer/prescriptions")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Notes"
            value={overviewData.todayNotes}
            icon={<AssignmentIcon sx={{ fontSize: 40, color: "#7b1fa2" }} />}
            color="#7b1fa2"
            onClick={() => navigate("/medical-officer/progress-notes")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Patients Need Attention"
            value={patientsNeedingAttention}
            icon={<LocalHospitalIcon sx={{ fontSize: 40, color: "#c62828" }} />}
            color="#c62828"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Patients Needing Attention */}
        <Grid item xs={12} md={6}>
          <Card sx={{ border: "1px solid #e0e0e0" }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6">
                  Patients Requiring Attention
                </Typography>
                <Chip
                  label={patientsNeedingAttention}
                  color="error"
                  size="small"
                />
              </Box>
              <Divider />
              {recentPatients.length === 0 ? (
                <Box textAlign="center" py={3}>
                  <Typography variant="body2" color="textSecondary">
                    No patients requiring immediate attention
                  </Typography>
                </Box>
              ) : (
                <List>
                  {recentPatients.map((patient) => (
                    <ListItemButton
                      key={patient.id}
                      onClick={() =>
                        navigate(`/medical-officer/patients/${patient.id}`)
                      }
                    >
                      <ListItemText
                        primary={`${patient.firstName} ${patient.lastName}`}
                        secondary={`Patient ID: ${patient.patientId} | Status: ${patient.status}`}
                      />
                      {patient.tasks?.length > 0 && (
                        <Chip
                          label={`${patient.tasks.length} overdue tasks`}
                          size="small"
                          color="warning"
                        />
                      )}
                      {patient.investigations?.length > 0 && (
                        <Chip
                          label="Critical results"
                          size="small"
                          color="error"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </ListItemButton>
                  ))}
                </List>
              )}
              <Box mt={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/medical-officer/patients")}
                >
                  View All Patients
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Task Summary */}
        <Grid item xs={12} md={6}>
          <Card sx={{ border: "1px solid #e0e0e0" }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6">My Task Summary</Typography>
                <TrendingUpIcon color="primary" />
              </Box>
              <Divider />
              <List>
                <ListItem>
                  <ListItemText primary="Total Tasks" />
                  <Typography variant="h6" color="primary">
                    {taskStatsData.totalTasks}
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Pending" />
                  <Chip
                    label={taskStatsData.pendingTasks}
                    color="info"
                    size="small"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="In Progress" />
                  <Chip
                    label={taskStatsData.inProgressTasks}
                    color="warning"
                    size="small"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Completed" />
                  <Chip
                    label={taskStatsData.completedTasks}
                    color="success"
                    size="small"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Overdue" />
                  <Chip
                    label={taskStatsData.overdueTasks}
                    color="error"
                    size="small"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Urgent Tasks" />
                  <Chip
                    label={taskStatsData.urgentTasks}
                    color="error"
                    size="small"
                  />
                </ListItem>
              </List>
              <Box mt={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/medical-officer/tasks")}
                >
                  View All Tasks
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </Box>
  );
};

export default MedicalOfficerDashboard;
