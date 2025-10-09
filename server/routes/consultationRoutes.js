// server/routes/consultationRoutes.js
import express from "express";
import * as consultationController from "../controllers/consultationController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Create consultation request
router.post("/", consultationController.createConsultation);

// Get all consultations (with filters)
router.get("/", consultationController.getAllConsultations);

// Get pending consultations
router.get("/pending", consultationController.getPendingConsultations);

// Get my consultations (assigned to me)
router.get("/my-consultations", consultationController.getMyConsultations);

// Get consultation statistics
router.get("/stats", consultationController.getConsultationStats);

// Get consultations by patient
router.get(
  "/patient/:patientId",
  consultationController.getConsultationsByPatient
);

// Get single consultation
router.get("/:id", consultationController.getConsultationById);

// Assign consultation
router.post("/:id/assign", consultationController.assignConsultation);

// Update consultation status
router.patch("/:id/status", consultationController.updateConsultationStatus);

// Complete consultation (provide opinion)
router.post("/:id/complete", consultationController.completeConsultation);

// Cancel consultation
router.post("/:id/cancel", consultationController.cancelConsultation);

export default router;
