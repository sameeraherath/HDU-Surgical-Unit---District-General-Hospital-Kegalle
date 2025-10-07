import express from "express";
import {
  createPrescription,
  getPrescriptionsByPatient,
  getActivePrescriptions,
  updatePrescription,
  discontinuePrescription,
  verifyPrescription,
  dispensePrescription,
  getMedicationSchedule,
  getControlledPrescriptions,
} from "../controllers/prescriptionController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Prescription routes
router.post("/", createPrescription);
router.get("/active", getActivePrescriptions);
router.get("/controlled", getControlledPrescriptions);
router.get("/schedule/:patientId", getMedicationSchedule);
router.get("/:patientId", getPrescriptionsByPatient);
router.put("/:id", updatePrescription);
router.put("/:id/discontinue", discontinuePrescription);
router.put("/:id/verify", verifyPrescription);
router.put("/:id/dispense", dispensePrescription);

export default router;
