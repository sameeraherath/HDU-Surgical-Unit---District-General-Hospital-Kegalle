import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import HouseOfficerDashboard from "../pages/HouseOfficerDashboard";
import MedicalOfficerDashboard from "../pages/MedicalOfficerDashboard";
import NurseDashboard from "../pages/NurseDashboard";
import LandingPage from "../pages/LandingPage";
import ConsultantDashboard from "../pages/ConsultantDashboard";
import UserProfilePage from "../pages/UserProfilePage";
import AuditLogPage from "../pages/AuditLogPage";
import TaskManagementPage from "../pages/TaskManagementPage";
import ProgressNotesPage from "../pages/ProgressNotesPage";
import PatientDetailPage from "../pages/PatientDetailPage";
import InvestigationsPage from "../pages/InvestigationsPage";
import PrescriptionsPage from "../pages/PrescriptionsPage";
import FluidBalancePage from "../pages/FluidBalancePage";
import MainLayout from "../layouts/MainLayout";
import PatientAssignmentContainer from "../pages/NurseDashboardPages/PatientAssignmentContainer";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ role, children }) => {
  const user = useSelector((state) => state.auth.user);
  if (!user || user.role !== role) {
    return <Navigate to="/login" />;
  }
  return children;
};

const AdminOrConsultantRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  if (!user || !["Admin", "Consultant"].includes(user.role)) {
    return <Navigate to="/login" />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<MainLayout />}>
        <Route
          path="/house-officer-dashboard"
          element={
            <ProtectedRoute role="House Officer">
              <HouseOfficerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medical-officer-dashboard"
          element={
            <ProtectedRoute role="Medical Officer">
              <MedicalOfficerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse-dashboard"
          element={
            <ProtectedRoute role="Nurse">
              <NurseDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nurse-dashboard/patient-assignment"
          element={
            <ProtectedRoute role="Nurse">
              <PatientAssignmentContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultant-dashboard"
          element={
            <ProtectedRoute role="Consultant">
              <ConsultantDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route
          path="/audit-logs"
          element={
            <AdminOrConsultantRoute>
              <AuditLogPage />
            </AdminOrConsultantRoute>
          }
        />
        <Route
          path="/medical-officer/tasks"
          element={
            <ProtectedRoute role="Medical Officer">
              <TaskManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medical-officer/progress-notes"
          element={
            <ProtectedRoute role="Medical Officer">
              <ProgressNotesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medical-officer/patients/:patientId"
          element={
            <ProtectedRoute role="Medical Officer">
              <PatientDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medical-officer/investigations"
          element={
            <ProtectedRoute role="Medical Officer">
              <InvestigationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medical-officer/prescriptions"
          element={
            <ProtectedRoute role="Medical Officer">
              <PrescriptionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medical-officer/fluid-balance"
          element={
            <ProtectedRoute role="Medical Officer">
              <FluidBalancePage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
