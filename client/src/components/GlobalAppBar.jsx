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
  Box,
  Divider,
  Tooltip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
      <AppBar 
        position="sticky" 
        sx={{ 
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(25, 118, 210, 0.95)"
        }}
      >
        <Toolbar sx={{ minHeight: "64px", px: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 600,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              letterSpacing: "0.02em"
            }}
          >
            {appBarTitle}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <NotificationBell />

            <Tooltip title={`${user?.username || "User"} - ${role}`} arrow>
              <IconButton 
                color="inherit" 
                onClick={handleAvatarClick}
                sx={{
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    backgroundColor: "rgba(255,255,255,0.1)"
                  }
                }}
              >
                <Avatar
                  alt={user?.username || "User"}
                  src={profile?.profile?.profilePictureUrl}
                  sx={{
                    width: 36,
                    height: 36,
                    border: "2px solid rgba(255,255,255,0.2)",
                    transition: "all 0.2s ease-in-out"
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Tooltip title="Logout" arrow>
              <IconButton 
                color="inherit" 
                onClick={handleLogoutClick}
                sx={{
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    backgroundColor: "rgba(255,255,255,0.1)"
                  }
                }}
              >
                <LogoutIcon sx={{ fontSize: "1.3rem" }} />
              </IconButton>
            </Tooltip>
          </Box>

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
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 180,
                borderRadius: 2,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                border: "1px solid rgba(0,0,0,0.08)"
              }
            }}
          >
            <MenuItem 
              onClick={handleProfile}
              sx={{
                py: 1.5,
                px: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)"
                }
              }}
            >
              <PersonIcon sx={{ mr: 1.5, fontSize: "1.2rem" }} />
              Profile
            </MenuItem>
            <MenuItem 
              onClick={handleDashboard}
              sx={{
                py: 1.5,
                px: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)"
                }
              }}
            >
              <DashboardIcon sx={{ mr: 1.5, fontSize: "1.2rem" }} />
              Dashboard
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem 
              onClick={handleLogoutClick}
              sx={{
                py: 1.5,
                px: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 0.08)"
                }
              }}
            >
              <LogoutIcon sx={{ mr: 1.5, fontSize: "1.2rem" }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
            border: "1px solid rgba(0,0,0,0.05)",
            overflow: "hidden"
          }
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
            color: "white",
            p: 3,
            textAlign: "center"
          }}
        >
          <WarningIcon 
            sx={{ 
              fontSize: 48, 
              mb: 2,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
            }} 
          />
          <DialogTitle 
            id="logout-dialog-title"
            sx={{ 
              color: "inherit",
              fontSize: "1.3rem",
              fontWeight: 600,
              mb: 0,
              p: 0
            }}
          >
            Confirm Logout
          </DialogTitle>
        </Box>
        
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: "center",
              color: "text.secondary",
              mb: 3,
              fontSize: "1rem",
              lineHeight: 1.6
            }}
          >
            Are you sure you want to sign out? Any unsaved changes will be lost.
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button 
              onClick={handleLogoutCancel}
              variant="outlined"
              startIcon={<CheckCircleIcon />}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                borderColor: "#e0e0e0",
                color: "#666",
                "&:hover": {
                  borderColor: "#1976d2",
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                  color: "#1976d2"
                }
              }}
            >
              Stay Signed In
            </Button>
            <Button 
              onClick={handleLogoutConfirm} 
              autoFocus
              variant="contained"
              startIcon={<LogoutIcon />}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
                boxShadow: "0 4px 12px rgba(255, 107, 107, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #ff5252 0%, #e53935 100%)",
                  boxShadow: "0 6px 16px rgba(255, 107, 107, 0.4)",
                  transform: "translateY(-1px)"
                },
                transition: "all 0.2s ease-in-out"
              }}
            >
              Sign Out
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default GlobalAppBar;
