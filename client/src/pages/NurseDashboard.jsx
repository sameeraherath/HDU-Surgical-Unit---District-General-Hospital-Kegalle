import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import BedCard from "../components/BedCard";
import { showToast } from "../features/ui/uiSlice";
import PatientDialog from "../components/NurseDashboardForms/PatientDialog";
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

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const selectedBed = useSelector((state) => state.patient.selectedBed);

  useEffect(() => {
    fetchBeds();
  }, [dispatch]);
  const fetchBeds = async () => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
    dispatch(setLoading(true));
    try {
      const response = await axios.get(`${BASE_URL}/beds`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBeds(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      dispatch(setLoading(false));
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
      fetchBeds();
    } catch (err) {
      dispatch(
        showToast({
          message:
            "Failed to remove the patient from the bed. Please try again.",
          type: "error",
        })
      );
      console.error(err);
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

      dispatch(
        showToast({ message: "Bed assigned successfully.", type: "success" })
      );
      await fetchBeds();
    } catch (error) {
      dispatch(showToast({ message: "Error assigning bed.", type: "error" }));
      console.log("Error during assignment:", error);
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

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <div style={{ padding: "0px 24px", paddingTop: "65px" }}>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{ width: "100%", margin: "0 auto" }}
      >
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

      <PatientDialog handleSubmit={handleSubmit} />

      <Dialog
        open={logoutDialogOpen}
        onClose={closeLogoutDialog}
        aria-labelledby="logout-dialog-title"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to logout?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmLogout} color="primary" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NurseDashboard;
