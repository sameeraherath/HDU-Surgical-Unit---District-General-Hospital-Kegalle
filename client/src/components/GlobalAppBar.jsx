import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../features/ui/uiSlice";
import { useAuth } from "../hooks/useAuth";
import { fetchUserProfile } from "../features/userProfile/userProfileSlice";
import NotificationBell from "./NotificationBell";

const GlobalAppBar = ({ role }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useAuth();

  const appBarTitle = useSelector((state) => state.ui.appBarTitle);
  const { profile } = useSelector((state) => state.userProfile);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && !profile) {
      dispatch(fetchUserProfile());
    }
  }, [user, profile, dispatch]);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDashboard = () => {
    const dashboardRoutes = {
      Nurse: "/nurse-dashboard",
      "House Officer": "/house-officer-dashboard",
      "Medical Officer": "/medical-officer-dashboard",
      Consultant: "/consultant-dashboard",
    };
    navigate(dashboardRoutes[role] || "/");
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    logout();
    navigate("/landing");
    dispatch(
      showToast({ message: "Successfully logged out", type: "success" })
    );
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ boxShadow: "none" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            {appBarTitle}
          </Typography>

          <NotificationBell />

          <IconButton color="inherit" onClick={handleAvatarClick}>
            <Avatar
              alt={user?.username || "User"}
              src={profile?.profile?.profilePictureUrl}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
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
            <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
          </Menu>

          <IconButton color="inherit" onClick={handleLogoutClick}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
      >
        <DialogTitle id="logout-dialog-title">
          Are you sure you want to logout?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleLogoutCancel}>No</Button>
          <Button onClick={handleLogoutConfirm} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GlobalAppBar;
