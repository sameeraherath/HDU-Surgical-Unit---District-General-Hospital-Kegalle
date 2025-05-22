import express from "express";
import {
  addCriticalFactors,
  getCriticalFactorsByPatientId,
  updateCriticalFactors,
  getCriticalFactorAuditHistory,
} from "../controllers/criticalFactorController.js";
import { authenticateJWT as protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/patients/:patientId/critical-factors",
  protect,
  authorize(["Nurse", "Medical Officer", "Consultant", "House Officer"]),
  addCriticalFactors
);

router.get(
  "/patients/:patientId/critical-factors",
  protect,
  authorize(["Nurse", "Medical Officer", "Consultant", "House Officer"]),
  getCriticalFactorsByPatientId
);

router.put(
  "/critical-factors/:criticalFactorId",
  protect,
  authorize(["Nurse", "Medical Officer", "Consultant", "House Officer"]),
  updateCriticalFactors
);

// Get audit history for a specific critical factor record
router.get(
  "/critical-factors/:criticalFactorId/audit",
  protect,
  authorize(["Nurse", "Medical Officer", "Consultant", "House Officer"]),
  getCriticalFactorAuditHistory
);

export default router;
