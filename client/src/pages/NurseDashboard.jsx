import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Routes, Route } from "react-router-dom";
import {
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Paper,
  Container,
  Skeleton,
  Alert,
} from "@mui/material";
import {
  Hotel,
  People,
  Assignment,
  Refresh,
  Logout,
} from "@mui/icons-material";
import BedCard from "../components/BedCard";
import { showToast, setAppBarTitle } from "../features/ui/uiSlice";
import PatientDialog from "../components/NurseDashboardForms/PatientDialog";
import PatientAssignmentContainer from "./NurseDashboardPages/PatientAssignmentContainer";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../features/loaderSlice";
import {
  setDialogOpen,
  setSelectedBed,
} from "../features/patients/patientSlice";
import { clearCredentials } from "../features/auth/authSlice";

const NurseDashboard = () => {
  const [beds, setBeds] = useState([]);
  const [error, setError] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const selectedBed = useSelector((state) => state.patient.selectedBed);
  const dialogOpen = useSelector((state) => state.patient.dialogOpen);
  const isLoading = useSelector((state) => state.loader.isLoading);

  useEffect(() => {
    dispatch(setAppBarTitle("Nurse Dashboard - Bed Management"));
    fetchBeds();
  }, [dispatch]);

  const fetchBeds = async (isRefresh = false) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      dispatch(setLoading(true));
    }
    try {
      const response = await axios.get(`${BASE_URL}/beds`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBeds(response.data);
      setError(null);
      dispatch(setAppBarTitle(`Nurse Dashboard - Beds`));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch beds");
      console.error("Error fetching beds:", err);
    } finally {
      dispatch(setLoading(false));
      setIsRefreshing(false);
    }
  };

  const handleAssignBed = (bedData) => {
    dispatch(setSelectedBed(bedData));
    dispatch(setDialogOpen(true));
  };

  const deAssignBed = async (bed) => {
    try {
      const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
      await axios.delete(`${BASE_URL}/beds/${bed.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(
        showToast({
          message: "Patient successfully removed from the bed.",
          type: "success",
        })
      );
      fetchBeds(true);
    } catch (err) {
      dispatch(
        showToast({
          message:
            "Failed to remove the patient from the bed. Please try again.",
          type: "error",
        })
      );
      console.error("Error deassigning bed:", err);
    }
  };

  const handleSubmit = async (values) => {
    const dataToSubmit = {
      ...values,
      bedId: selectedBed.id,
    };

    try {
      const BASE_URL = `${import.meta.env.VITE_API_URL}/api/beds`;
      dispatch(setLoading(true));
      const response = await fetch(`${BASE_URL}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientData: dataToSubmit }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign bed.");
      }

      const data = await response.json();
      dispatch(
        showToast({ message: "Bed assigned successfully.", type: "success" })
      );
      dispatch(setDialogOpen(false));
      await fetchBeds(true);
      navigate("/nurse-dashboard");
      return data;
    } catch (error) {
      dispatch(showToast({ message: "Error assigning bed.", type: "error" }));
      console.error("[NurseDashboard] Error assigning bed:", error);
      // Don't throw error to prevent unhandled promise rejection
    } finally {
      dispatch(setLoading(false));
    }
  };

  const confirmLogout = () => {
    dispatch(clearCredentials());
    navigate("/landing");
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const handleRefresh = () => {
    setError(null);
    fetchBeds(true);
  };

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  // Calculate bed statistics
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(bed => bed.patientId !== null).length;
  const availableBeds = totalBeds - occupiedBeds;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  // Loading skeleton component
  const BedSkeleton = () => (
    <Card sx={{ height: 230, borderRadius: 2 }}>
      <CardContent>
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="rectangular" width="40%" height={24} sx={{ borderRadius: 2, mt: 1 }} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mt: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 3, mt: 2 }} />
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ pt: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={handleRefresh}
          startIcon={<Refresh />}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ pt: 2, pb: 4 }}>
      {/* Header Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <Box mb={2}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Bed Management Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Monitor and manage patient bed assignments
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Hotel sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {totalBeds}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Beds
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <People sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {occupiedBeds}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Occupied
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Assignment sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {availableBeds}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {occupancyRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Occupancy Rate
                </Typography>
                <Chip 
                  label={occupancyRate > 80 ? 'High' : occupancyRate > 60 ? 'Medium' : 'Low'} 
                  color={occupancyRate > 80 ? 'error' : occupancyRate > 60 ? 'warning' : 'success'}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Beds Grid Section */}
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Bed Status Overview
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Click on a bed to assign or manage patient information
        </Typography>
      </Box>

      {isLoading && !isRefreshing ? (
        <Grid container spacing={2}>
          {[...Array(10)].map((_, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={2.4}>
              <BedSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {beds.slice(0, 10).map((bed) => (
            <Grid key={bed.id} item xs={12} sm={6} md={4} lg={3} xl={2.4}>
              <BedCard
                bed={bed}
                assignBed={handleAssignBed}
                deassignBed={deAssignBed}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {!isLoading && beds.length === 0 && (
        <Paper 
          elevation={1} 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: 2,
            mt: 2
          }}
        >
          <Hotel sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No beds available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Contact your administrator to set up bed management
          </Typography>
        </Paper>
      )}

      {/* Dialogs */}
      {dialogOpen && <PatientDialog handleSubmit={handleSubmit} />}

      <Dialog
        open={logoutDialogOpen}
        onClose={closeLogoutDialog}
        aria-labelledby="logout-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle 
          id="logout-dialog-title"
          sx={{ 
            bgcolor: 'primary.light', 
            color: 'primary.contrastText',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Confirm Logout
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, textAlign: 'center' }}>
          <Logout sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Are you sure you want to logout? You will need to sign in again to access the dashboard.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 3, gap: 2 }}>
          <Button 
            onClick={closeLogoutDialog} 
            variant="outlined"
            sx={{ borderRadius: 2, minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmLogout} 
            variant="contained" 
            color="primary"
            sx={{ borderRadius: 2, minWidth: 100 }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NurseDashboard;
