import React from "react";
import { Outlet } from "react-router-dom";
import GlobalAppBar from "../components/GlobalAppBar";
import GlobalAlertBanner from "../components/GlobalAlertBanner";
import GlobalToastHandler from "../components/GlobalToastHandler";
import GlobalSpinner from "../components/GlobalSpinner";
import { Box, Container } from "@mui/material";

const MainLayout = () => {
  return (
    <Box>
      <GlobalAppBar />
      <GlobalAlertBanner />
      <Container component="main">
        <Outlet />
      </Container>
      <GlobalToastHandler />
      <GlobalSpinner />
    </Box>
  );
};

export default MainLayout;
