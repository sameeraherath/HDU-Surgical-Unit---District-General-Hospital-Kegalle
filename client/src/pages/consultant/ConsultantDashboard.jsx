import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
} from "@mui/material";
import {
  AssignmentOutlined,
  LocalHospitalOutlined,
  SchoolOutlined,
  AssessmentOutlined,
  ExitToAppOutlined,
  WarningOutlined,
  TrendingUpOutlined,
  PeopleOutline,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  fetchDashboardStats,
  fetchPatientsNeedingAttention,
  fetchRecentActivity,
  fetchWorkloadMetrics,
} from "../../store/slices/consultantSlice";

const ConsultantDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    dashboardStats,
    patientsNeedingAttention,
    recentActivity,
    workloadMetrics,
    loading,
    error,
    lastRefreshed,
  } = useSelector((state) => state.consultant);

  useEffect(() => {
    // Load all dashboard data on mount
    dispatch(fetchDashboardStats());
    dispatch(fetchPatientsNeedingAttention());
    dispatch(fetchRecentActivity());
    dispatch(fetchWorkloadMetrics());
  }, [dispatch]);

  const getWorkloadColor = (level) => {
    switch (level) {
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

  const getPatientStatusColor = (status) => {
    switch (status) {
      case "CRITICAL":
        return "error";
      case "DETERIORATING":
        return "warning";
      case "FOR_DISCHARGE":
        return "info";
      default:
        return "default";
    }
  };

  const statCards = [
    {
      title: "Today's Ward Rounds",
      value: dashboardStats.todaysWardRounds,
      icon: <AssignmentOutlined fontSize="large" />,
      color: "#1976d2",
      action: () => navigate("/consultant-dashboard/ward-rounds"),
    },
    {
      title: "Patients for Discharge",
      value: dashboardStats.patientsForDischarge,
      icon: <ExitToAppOutlined fontSize="large" />,
      color: "#2e7d32",
      action: () => navigate("/consultant-dashboard/discharge-plans"),
    },
    {
      title: "Pending Consultations",
      value: dashboardStats.pendingConsultations,
      icon: <LocalHospitalOutlined fontSize="large" />,
      color: "#ed6c02",
      action: () => navigate("/consultant-dashboard/consultations"),
    },
    {
      title: "Active Discharge Plans",
      value: dashboardStats.activeDischargePlans,
      icon: <AssignmentOutlined fontSize="large" />,
      color: "#0288d1",
      action: () => navigate("/consultant-dashboard/discharge-plans"),
    },
    {
      title: "Teaching Sessions (Month)",
      value: dashboardStats.teachingSessionsThisMonth,
      icon: <SchoolOutlined fontSize="large" />,
      color: "#7b1fa2",
      action: () => navigate("/consultant-dashboard/teaching-notes"),
    },
    {
      title: "Ongoing Audits",
      value: dashboardStats.ongoingAudits,
      icon: <AssessmentOutlined fontSize="large" />,
      color: "#c62828",
      action: () => navigate("/consultant-dashboard/clinical-audits"),
    },
    {
      title: "Critical Patients",
      value: dashboardStats.criticalPatients,
      icon: <WarningOutlined fontSize="large" />,
      color: "#d32f2f",
      action: () => navigate("/consultant-dashboard/ward-rounds"),
    },
    {
      title: "Pending Tasks",
      value: dashboardStats.pendingTasks,
      icon: <AssignmentOutlined fontSize="large" />,
      color: "#616161",
      action: () => navigate("/consultant-dashboard/ward-rounds"),
    },
  ];

  if (loading && !lastRefreshed) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Consultant Dashboard
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {lastRefreshed &&
              `Last updated: ${new Date(lastRefreshed).toLocaleString()}`}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || "Failed to load dashboard data"}
        </Alert>
      )}

      {/* Workload Metrics */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: "background.default", border: "1px solid #e0e0e0" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TrendingUpOutlined color="primary" />
            <Typography variant="h6">Workload Status</Typography>
            <Chip
              label={workloadMetrics.workloadLevel || "NORMAL"}
              color={getWorkloadColor(workloadMetrics.workloadLevel || "NORMAL")}
              size="small"
            />
          </Box>
          <Typography variant="body2" color="textSecondary">
            Score: {workloadMetrics.workloadScore || 0}
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={3}>
            <Typography variant="body2" color="textSecondary">
              Active Patients
            </Typography>
            <Typography variant="h6">
              {workloadMetrics.activePatientsCount}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" color="textSecondary">
              Pending Tasks
            </Typography>
            <Typography variant="h6">{workloadMetrics.pendingTasksCount}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" color="textSecondary">
              Pending Consultations
            </Typography>
            <Typography variant="h6">
              {workloadMetrics.pendingConsultationsCount}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" color="textSecondary">
              Pending Discharges
            </Typography>
            <Typography variant="h6">
              {workloadMetrics.pendingDischarges}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                border: "1px solid #e0e0e0",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
              onClick={card.action}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: card.color }}
                    >
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Patients Needing Attention */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "400px", overflow: "auto", border: "1px solid #e0e0e0" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <WarningOutlined color="error" />
              <Typography variant="h6">Patients Needing Attention</Typography>
            </Box>
            {patientsNeedingAttention.length === 0 ? (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ textAlign: "center", mt: 4 }}
              >
                No patients requiring immediate attention
              </Typography>
            ) : (
              <List>
                {patientsNeedingAttention.map((patient, index) => (
                  <React.Fragment key={patient.id}>
                    <ListItem
                      button
                      onClick={() =>
                        navigate(`/patient-overview/${patient.patientId}`)
                      }
                    >
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography variant="body1">
                              {patient.patientName ||
                                `Patient ${patient.patientId}`}
                            </Typography>
                            <Chip
                              label={patient.patientStatus}
                              color={getPatientStatusColor(
                                patient.patientStatus
                              )}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              Ward Round:{" "}
                              {new Date(patient.roundDate).toLocaleDateString()}
                            </Typography>
                            {patient.chiefComplaint && (
                              <Typography variant="body2" color="textSecondary">
                                {patient.chiefComplaint}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    {index < patientsNeedingAttention.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "400px", border: "1px solid #e0e0e0" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <PeopleOutline color="primary" />
              <Typography variant="h6">Recent Activity (7 Days)</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card variant="outlined" sx={{ border: "1px solid #e0e0e0" }}>
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      Ward Rounds
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {recentActivity.wardRounds}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined" sx={{ border: "1px solid #e0e0e0" }}>
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      Teaching Sessions
                    </Typography>
                    <Typography variant="h4" color="secondary">
                      {recentActivity.teachingSessions}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined" sx={{ border: "1px solid #e0e0e0" }}>
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      Consultations Completed
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {recentActivity.consultationsCompleted}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined" sx={{ border: "1px solid #e0e0e0" }}>
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      Patients Discharged
                    </Typography>
                    <Typography variant="h4" color="info.main">
                      {recentActivity.patientsDischargedCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConsultantDashboard;
