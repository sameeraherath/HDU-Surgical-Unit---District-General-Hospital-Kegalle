import express from "express";
import {
  getAuditLogsController,
  getAuditLogById,
  getAuditHistory,
  getAuditStatisticsController,
  getUserActivityTimeline,
  getPatientActivityTimeline,
  getCriticalEvents,
  getFailedActions,
  exportAuditLogs,
} from "../controllers/auditController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// Authorization middleware for Admin/Consultant only
const authorizeAdminOrConsultant = (req, res, next) => {
  if (!["Admin", "Consultant"].includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied. Admin or Consultant role required." });
  }
  next();
};

// Authorization middleware for medical staff
const authorizeMedicalStaff = (req, res, next) => {
  if (!["Admin", "Consultant", "MedicalOfficer", "HouseOfficer", "Nurse"].includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied. Medical staff only." });
  }
  next();
};

// Get audit logs (Admin/Consultant only)
router.get("/logs", authenticateJWT, authorizeAdminOrConsultant, getAuditLogsController);

// Get audit log by ID (Admin/Consultant only)
router.get("/logs/:id", authenticateJWT, authorizeAdminOrConsultant, getAuditLogById);

// Get audit history for specific record (Medical staff)
router.get("/history/:tableName/:recordId", authenticateJWT, authorizeMedicalStaff, getAuditHistory);

// Get audit statistics (Admin/Consultant only)
router.get("/statistics", authenticateJWT, authorizeAdminOrConsultant, getAuditStatisticsController);

// Get user activity timeline (Self or Admin/Consultant)
router.get("/user/:userId/timeline", authenticateJWT, getUserActivityTimeline);

// Get patient activity timeline (Medical staff)
router.get("/patient/:patientId/timeline", authenticateJWT, authorizeMedicalStaff, getPatientActivityTimeline);

// Get critical events (Admin/Consultant only)
router.get("/critical-events", authenticateJWT, authorizeAdminOrConsultant, getCriticalEvents);

// Get failed actions (Admin/Consultant only)
router.get("/failed-actions", authenticateJWT, authorizeAdminOrConsultant, getFailedActions);

// Export audit logs (Admin/Consultant only)
router.get("/export", authenticateJWT, authorizeAdminOrConsultant, exportAuditLogs);

export default router;
