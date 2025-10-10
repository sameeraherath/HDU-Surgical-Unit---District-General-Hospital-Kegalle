// server/routes/wardRoundRoutes.js
import express from "express";
import wardRoundController from "../controllers/wardRoundController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Create ward round
router.post("/", wardRoundController.createWardRound);

// Get all ward rounds (with filters)
router.get("/", wardRoundController.getAllWardRounds);

// Get today's ward rounds
router.get("/today", wardRoundController.getTodaysWardRounds);

// Get ward round statistics
router.get("/stats", wardRoundController.getWardRoundStats);

// Get ward rounds by patient
router.get("/patient/:patientId", wardRoundController.getWardRoundsByPatient);

// Get single ward round
router.get("/:id", wardRoundController.getWardRoundById);

// Update ward round
router.put("/:id", wardRoundController.updateWardRound);

// Review ward round
router.post("/:id/review", wardRoundController.reviewWardRound);

// Delete ward round
router.delete("/:id", wardRoundController.deleteWardRound);

export default router;
