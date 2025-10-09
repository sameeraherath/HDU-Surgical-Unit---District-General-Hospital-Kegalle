// server/routes/clinicalAuditRoutes.js
import express from "express";
import * as clinicalAuditController from "../controllers/clinicalAuditController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Create clinical audit
router.post("/", clinicalAuditController.createClinicalAudit);

// Get all clinical audits (with filters)
router.get("/", clinicalAuditController.getAllClinicalAudits);

// Get audit statistics
router.get("/stats", clinicalAuditController.getAuditStats);

// Get clinical audits by consultant
router.get(
  "/consultant/:consultantId",
  clinicalAuditController.getClinicalAuditsByConsultant
);

// Get single clinical audit
router.get("/:id", clinicalAuditController.getClinicalAuditById);

// Update clinical audit
router.put("/:id", clinicalAuditController.updateClinicalAudit);

// Update audit status
router.patch("/:id/status", clinicalAuditController.updateAuditStatus);

// Record presentation
router.post("/:id/presentation", clinicalAuditController.recordPresentation);

// Delete clinical audit
router.delete("/:id", clinicalAuditController.deleteClinicalAudit);

export default router;
