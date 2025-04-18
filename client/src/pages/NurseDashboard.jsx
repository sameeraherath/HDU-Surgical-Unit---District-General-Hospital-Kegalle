import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import BedCard from "../components/BedCard";
import LogoutIcon from "@mui/icons-material/Logout";
import { showToast } from "../features/ui/uiSlice";
import PatientDialog from "../components/NurseDashboardForms/PatientDialog";
import { useDispatch } from "react-redux";
import { setLoading } from "../features/loaderSlice";

const NurseDashboard = () => {
  const [beds, setBeds] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchBeds();
    // eslint-disable-next-line
  }, []);

  const fetchBeds = async () => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
    dispatch(setLoading(true)); // show spinner globally
    try {
      const response = await axios.get(`${BASE_URL}/beds`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBeds(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      dispatch(setLoading(false)); // hide spinner
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
      // Optionally show spinner here if you have a noticeable delay
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
      setOpen(false);
      await fetchBeds();
    } catch (error) {
      dispatch(showToast({ message: "Error assigning bed.", type: "error" }));
      console.log("Error during assignment:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Existing logout dialog handlers
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

  // Handlers for Avatar Dropdown Menu
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDashborad = () => {
    dispatch(showToast({ message: "Dashboard clicked", type: "info" }));
    handleMenuClose();
  };

  const handleProfile = () => {
    dispatch(showToast({ message: "Profile clicked", type: "info" }));
    handleMenuClose();
  };

  const handleLogout = () => {
    closeLogoutDialog();
    localStorage.removeItem("token");
    navigate("/landing");
  };

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
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Nurse Dashboard - Bed Overview
          </Typography>

          {/* Avatar with dropdown menu */}
          <IconButton color="inherit" onClick={handleAvatarClick}>
            <Avatar alt="User Avatar" src="/path/to/avatar.jpg" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleDashborad}>Dashboard</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>

          {/* Optional extra Logout button */}
          <IconButton color="inherit" onClick={handleLogoutClick}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Grid
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
          <Grid key={bed.id} item>
            <BedCard
              bed={bed}
              assignBed={handleAssignBed}
              deassignBed={deAssignBed}
            />
          </Grid>
        ))}
      </Grid>

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
