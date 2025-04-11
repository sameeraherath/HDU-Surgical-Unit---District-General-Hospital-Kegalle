import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Grid2,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import BedCard from "../components/BedCard";
import LogoutIcon from "@mui/icons-material/Logout";
import { toast } from "material-react-toastify";
import PatientDialog from "../components/PatientDialog";

const NurseDashboard = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, type) => {
    if (type === "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    if (type === "error") {
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  const fetchBeds = async () => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
    try {
      const response = await axios.get(`${BASE_URL}/beds`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBeds(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAssignBed = (bedData) => {
    setSelectedBed(bedData);
    setOpen(true);
  };

  const deAssignBed = async (bed) => {
    try {
      const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
      await axios.delete(`${BASE_URL}/beds/${bed.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      showToast("Patient successfully removed from the bed.", "success");
      fetchBeds();
    } catch (err) {
      showToast(
        "Failed to remove the patient from the bed. Please try again.",
        "error"
      );
      console.error(err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBed(null);
  };

  const handleSubmit = async (values) => {
    const dataToSubmit = {
      ...values,
      bedId: selectedBed.id,
    };

    try {
      const BASE_URL = `${import.meta.env.VITE_API_URL}/api/beds`;
      const response = await fetch(`${BASE_URL}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientData: dataToSubmit }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign bed.");
      }

      showToast("Bed assigned successfully.", "success");
      setOpen(false);
      await fetchBeds();
    } catch (error) {
      showToast("Error assigning bed.", "error");
      console.log("🚀 ~ handleSubmit ~ error:", error);
    }
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/landing");
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <div>
      <AppBar position="sticky" sx={{ boxShadow: "none" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Nurse Dashboard - Bed Overview
          </Typography>
          <IconButton color="inherit" onClick={handleLogoutClick}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Grid2
        container
        spacing={2}
        style={{
          marginTop: "20px",
          height: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {beds.slice(0, 10).map((bed) => (
          <Grid2 key={bed.id}>
            <BedCard
              bed={bed}
              assignBed={handleAssignBed}
              deassignBed={deAssignBed}
            />
          </Grid2>
        ))}
      </Grid2>

      <PatientDialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        selectedBed={selectedBed}
      />
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
