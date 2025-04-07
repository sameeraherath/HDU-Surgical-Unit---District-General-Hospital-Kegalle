import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Grid2,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import BedCard from "../components/BedCard";
import LogoutIcon from "@mui/icons-material/Logout";
import { toast } from "material-react-toastify";

const NurseDashboard = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    birthDate: "",
    sex: "",
    condition: "",
    admitDateTime: "",
    contactDetails: "",
    frequencyMeasure: "",
  });
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

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const handleSubmit = async () => {
    const missingFields = [];

    if (!formData.fullName) missingFields.push("Full Name");
    if (!formData.age) missingFields.push("Age");
    if (!formData.birthDate) missingFields.push("Birth Date");
    if (!formData.sex) missingFields.push("Sex");
    if (!formData.condition) missingFields.push("Condition");
    if (!formData.contactDetails) missingFields.push("Contact Details");
    if (!formData.frequencyMeasure) missingFields.push("Frequency Measure");

    if (missingFields.length > 0) {
      const missingFieldsMessage = missingFields.join("\n");
      showToast(
        `Please fill in the following required fields:\n\n${missingFieldsMessage}`,
        "error"
      );
      return false;
    }

    const dataToSubmit = {
      fullName: formData.fullName,
      age: formData.age,
      birthDate: formData.birthDate,
      sex: formData.sex,
      condition: formData.condition,
      contactDetails: formData.contactDetails,
      frequencyMeasure: formData.frequencyMeasure,
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/landing");
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
          <Grid2 key={bed.id} xs={6} sm={6} md={3}>
            <BedCard
              bed={bed}
              assignBed={handleAssignBed}
              deassignBed={deAssignBed}
            />
          </Grid2>
        ))}
      </Grid2>

      <Dialog
        open={open && !!selectedBed}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ bgcolor: "primary.main", color: "white", textAlign: "center" }}
        >
          Assign Patient to {selectedBed?.bedNumber}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12}>
              <TextField
                label="Full Name"
                name="fullName"
                fullWidth
                value={formData.fullName}
                onChange={handleChange}
                required
                sx={{ borderRadius: 3, marginTop: 2, marginBottom: 2 }}
              />
            </Grid2>
            <Grid2 item xs={6}>
              <TextField
                label="Age"
                name="age"
                type="number"
                fullWidth
                value={formData.age}
                onChange={handleChange}
                required
              />
            </Grid2>
            <Grid2 item xs={6}>
              <TextField
                label="Birth Date"
                name="birthDate"
                type="date"
                fullWidth
                value={formData.birthDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid2>
            <Grid2 item xs={6}>
              <TextField
                select
                label="Sex"
                name="sex"
                fullWidth
                value={formData.sex}
                onChange={handleChange}
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 item xs={6}>
              <TextField
                label="Contact Details"
                name="contactDetails"
                fullWidth
                value={formData.contactDetails}
                onChange={handleChange}
                required
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                label="Condition"
                name="condition"
                multiline
                rows={3}
                fullWidth
                value={formData.condition}
                onChange={handleChange}
                required
              />
            </Grid2>
            <Grid2 item xs={6}>
              <TextField
                label="Admit Date & Time"
                name="admitDateTime"
                type="datetime-local"
                fullWidth
                value={formData.admitDateTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid2>
            <Grid2 item xs={6}>
              <TextField
                select
                label="Frequency Measure"
                name="frequencyMeasure"
                fullWidth
                value={formData.frequencyMeasure}
                onChange={handleChange}
                required
              >
                <MenuItem value="Red">Red</MenuItem>
                <MenuItem value="Green">Green</MenuItem>
                <MenuItem value="Blue">Blue</MenuItem>
                <MenuItem value="Yellow">Yellow</MenuItem>
                <MenuItem value="Brown">Brown</MenuItem>
              </TextField>
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={logoutDialogOpen}
        onClose={closeLogoutDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.light",
            color: "text.primary",
            textAlign: "center",
            padding: "16px",
          }}
        >
          <Typography variant="h6" fontWeight="600">
            Confirm Logout
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", padding: "4px" }}>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontWeight: "400",
              marginTop: "20px",
            }}
          >
            Are you sure you want to log out?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", padding: "16px 24px" }}>
          <Button
            onClick={closeLogoutDialog}
            variant="outlined"
            color="primary"
            sx={{
              marginRight: 2,
              padding: "8px 20px",
              fontWeight: "600",
              borderColor: "primary.main",
            }}
          >
            No
          </Button>
          <Button
            onClick={confirmLogout}
            variant="contained"
            color="error"
            sx={{
              padding: "8px 20px",
              fontWeight: "600",
              backgroundColor: "#ff6f61",
              "&:hover": {
                backgroundColor: "#ff3d2d",
              },
            }}
          >
            Yes, Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NurseDashboard;
