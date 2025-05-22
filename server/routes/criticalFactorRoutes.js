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
  "/:criticalFactorId",
  protect,
  authorize(["Nurse", "Medical Officer", "Consultant", "House Officer"]),
  updateCriticalFactors
);

router.get(
  "/:criticalFactorId/audit",
  protect,
  authorize(["Nurse", "Medical Officer", "Consultant", "House Officer"]),
  getCriticalFactorAuditHistory
);

export default router;
