import React from "react";
import { Container, Typography, Box, Paper, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import GlobalAppBar from "../components/GlobalAppBar";

const ConsultantDashboard = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <GlobalAppBar
        title="Consultant Dashboard"
        onLogoutClick={() => {}}
        role={user?.role}
      />
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)", // Subtract AppBar height
          backgroundColor: "#f4f4f4",
        }}
      >
        <Paper
          elevation={2}
          sx={{ padding: 4, textAlign: "center", borderRadius: 2 }}
        >
          <Typography variant="h4" color="textPrimary" gutterBottom>
            Consultant Dashboard - Coming Soon
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            We are currently working on the development of the dashboard. It
            will be available soon. Thank you for your patience.
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <Button variant="contained" color="primary" component={Link} to="/">
              Go Back to Home
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default ConsultantDashboard;
