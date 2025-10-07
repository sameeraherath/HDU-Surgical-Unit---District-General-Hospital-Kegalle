import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  Button,
  TextField,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  PhotoCamera,
  Delete,
  Save,
  Lock,
  Person,
  Settings,
} from "@mui/icons-material";
import {
  fetchUserProfile,
  updateProfile,
  uploadPicture,
  deletePicture,
  fetchPreferences,
  updatePreferences,
  updatePassword,
  clearProfileError,
} from "../features/userProfile/userProfileSlice";
import { showToast } from "../features/ui/uiSlice";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, preferences, loading, uploadingPicture, updatingProfile, updatingPreferences, changingPassword, error } =
    useSelector((state) => state.userProfile);
  const { user } = useSelector((state) => state.auth);

  const [tabValue, setTabValue] = useState(0);
  const [profileData, setProfileData] = useState({
    bio: "",
    phoneNumber: "",
    alternateEmail: "",
    address: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    dateOfBirth: "",
    professionalTitle: "",
    licenseNumber: "",
    department: "",
    specialty: "",
  });

  const [preferencesData, setPreferencesData] = useState({
    theme: "light",
    language: "en",
    timezone: "Asia/Colombo",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24",
    notificationsEnabled: true,
    emailNotifications: true,
    soundEnabled: true,
    autoRefresh: true,
    refreshInterval: 30,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (profile?.profile) {
      setProfileData({
        bio: profile.profile.bio || "",
        phoneNumber: profile.profile.phoneNumber || "",
        alternateEmail: profile.profile.alternateEmail || "",
        address: profile.profile.address || "",
        emergencyContactName: profile.profile.emergencyContactName || "",
        emergencyContactNumber: profile.profile.emergencyContactNumber || "",
        dateOfBirth: profile.profile.dateOfBirth || "",
        professionalTitle: profile.profile.professionalTitle || "",
        licenseNumber: profile.profile.licenseNumber || "",
        department: profile.profile.department || "",
        specialty: profile.profile.specialty || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (preferences) {
      setPreferencesData({
        theme: preferences.theme || "light",
        language: preferences.language || "en",
        timezone: preferences.timezone || "Asia/Colombo",
        dateFormat: preferences.dateFormat || "DD/MM/YYYY",
        timeFormat: preferences.timeFormat || "24",
        notificationsEnabled: preferences.notificationsEnabled ?? true,
        emailNotifications: preferences.emailNotifications ?? true,
        soundEnabled: preferences.soundEnabled ?? true,
        autoRefresh: preferences.autoRefresh ?? true,
        refreshInterval: preferences.refreshInterval || 30,
      });
    }
  }, [preferences]);

  useEffect(() => {
    if (error) {
      dispatch(showToast({ message: error, severity: "error" }));
      dispatch(clearProfileError());
    }
  }, [error, dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePreferencesChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPreferencesData({
      ...preferencesData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setPasswordError("");
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(profileData));
    if (result.type === "userProfile/updateProfile/fulfilled") {
      dispatch(showToast({ message: "Profile updated successfully", severity: "success" }));
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updatePreferences(preferencesData));
    if (result.type === "userProfile/updatePreferences/fulfilled") {
      dispatch(showToast({ message: "Preferences updated successfully", severity: "success" }));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    const result = await dispatch(
      updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
    );

    if (result.type === "userProfile/updatePassword/fulfilled") {
      dispatch(showToast({ message: "Password changed successfully", severity: "success" }));
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        dispatch(showToast({ message: "File size must be less than 5MB", severity: "error" }));
        return;
      }
      const result = await dispatch(uploadPicture(file));
      if (result.type === "userProfile/uploadPicture/fulfilled") {
        dispatch(showToast({ message: "Profile picture uploaded successfully", severity: "success" }));
      }
    }
  };

  const handlePictureDelete = async () => {
    const result = await dispatch(deletePicture());
    if (result.type === "userProfile/deletePicture/fulfilled") {
      dispatch(showToast({ message: "Profile picture deleted successfully", severity: "success" }));
    }
  };

  if (loading && !profile) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3}>
        <Box sx={{ p: 3 }}>
          {/* Header with Avatar */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Box sx={{ position: "relative", mr: 3 }}>
              <Avatar
                src={profile?.profile?.profilePictureUrl}
                sx={{ width: 120, height: 120 }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              {uploadingPicture && (
                <CircularProgress
                  size={120}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              )}
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="profile-picture-upload"
                type="file"
                onChange={handlePictureUpload}
              />
              <label htmlFor="profile-picture-upload">
                <IconButton
                  component="span"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                  disabled={uploadingPicture}
                >
                  <PhotoCamera />
                </IconButton>
              </label>
              {profile?.profile?.profilePictureUrl && (
                <IconButton
                  onClick={handlePictureDelete}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    bgcolor: "error.main",
                    color: "white",
                    "&:hover": { bgcolor: "error.dark" },
                  }}
                  disabled={uploadingPicture}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
            <Box>
              <Typography variant="h4" gutterBottom>
                {user?.username}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Role: <strong>{user?.role}</strong>
              </Typography>
              {profile?.profile?.professionalTitle && (
                <Typography variant="body2" color="text.secondary">
                  {profile.profile.professionalTitle}
                </Typography>
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab icon={<Person />} label="Profile" />
              <Tab icon={<Settings />} label="Preferences" />
              <Tab icon={<Lock />} label="Security" />
            </Tabs>
          </Box>

          {/* Profile Tab */}
          <TabPanel value={tabValue} index={0}>
            <form onSubmit={handleProfileSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    placeholder="Tell us about yourself..."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Alternate Email"
                    name="alternateEmail"
                    type="email"
                    value={profileData.alternateEmail}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Address"
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Emergency Contact Name"
                    name="emergencyContactName"
                    value={profileData.emergencyContactName}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Emergency Contact Number"
                    name="emergencyContactNumber"
                    value={profileData.emergencyContactNumber}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={handleProfileChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Professional Title"
                    name="professionalTitle"
                    value={profileData.professionalTitle}
                    onChange={handleProfileChange}
                    placeholder="e.g., MBBS, MD, RN"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="License Number"
                    name="licenseNumber"
                    value={profileData.licenseNumber}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={profileData.department}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Specialty"
                    name="specialty"
                    value={profileData.specialty}
                    onChange={handleProfileChange}
                    placeholder="e.g., General Surgery, Critical Care"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={updatingProfile}
                  >
                    {updatingProfile ? "Saving..." : "Save Profile"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>

          {/* Preferences Tab */}
          <TabPanel value={tabValue} index={1}>
            <form onSubmit={handlePreferencesSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Display Settings
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      name="theme"
                      value={preferencesData.theme}
                      onChange={handlePreferencesChange}
                      label="Theme"
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="auto">Auto</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      name="language"
                      value={preferencesData.language}
                      onChange={handlePreferencesChange}
                      label="Language"
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="si">Sinhala</MenuItem>
                      <MenuItem value="ta">Tamil</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      name="timezone"
                      value={preferencesData.timezone}
                      onChange={handlePreferencesChange}
                      label="Timezone"
                    >
                      <MenuItem value="Asia/Colombo">Asia/Colombo (IST)</MenuItem>
                      <MenuItem value="UTC">UTC</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Date Format</InputLabel>
                    <Select
                      name="dateFormat"
                      value={preferencesData.dateFormat}
                      onChange={handlePreferencesChange}
                      label="Date Format"
                    >
                      <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                      <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                      <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Time Format</InputLabel>
                    <Select
                      name="timeFormat"
                      value={preferencesData.timeFormat}
                      onChange={handlePreferencesChange}
                      label="Time Format"
                    >
                      <MenuItem value="12">12 Hour</MenuItem>
                      <MenuItem value="24">24 Hour</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Notification Settings
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferencesData.notificationsEnabled}
                        onChange={handlePreferencesChange}
                        name="notificationsEnabled"
                      />
                    }
                    label="Enable Notifications"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferencesData.emailNotifications}
                        onChange={handlePreferencesChange}
                        name="emailNotifications"
                      />
                    }
                    label="Email Notifications"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferencesData.soundEnabled}
                        onChange={handlePreferencesChange}
                        name="soundEnabled"
                      />
                    }
                    label="Sound Alerts"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Dashboard Settings
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferencesData.autoRefresh}
                        onChange={handlePreferencesChange}
                        name="autoRefresh"
                      />
                    }
                    label="Auto Refresh Dashboard"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Refresh Interval (seconds)"
                    name="refreshInterval"
                    value={preferencesData.refreshInterval}
                    onChange={handlePreferencesChange}
                    inputProps={{ min: 10, max: 300 }}
                    disabled={!preferencesData.autoRefresh}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={updatingPreferences}
                  >
                    {updatingPreferences ? "Saving..." : "Save Preferences"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={tabValue} index={2}>
            <form onSubmit={handlePasswordSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Change Password
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Ensure your account is using a long, random password to stay secure.
                  </Typography>
                </Grid>

                {passwordError && (
                  <Grid item xs={12}>
                    <Alert severity="error">{passwordError}</Alert>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Current Password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="New Password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    helperText="Minimum 6 characters"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Lock />}
                    disabled={changingPassword}
                  >
                    {changingPassword ? "Changing..." : "Change Password"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfilePage;
