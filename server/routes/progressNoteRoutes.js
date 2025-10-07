import express from "express";
import {
  createProgressNote,
  getProgressNotesByPatient,
  getProgressNoteById,
  updateProgressNote,
  reviewProgressNote,
  deleteProgressNote,
  getProgressNoteTemplates,
  createProgressNoteTemplate,
} from "../controllers/progressNoteController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Progress Note routes
router.post("/", createProgressNote);
router.get("/templates", getProgressNoteTemplates);
router.post("/templates", createProgressNoteTemplate);
router.get("/:patientId", getProgressNotesByPatient);
router.get("/detail/:id", getProgressNoteById);
router.put("/:id", updateProgressNote);
router.put("/:id/review", reviewProgressNote);
router.delete("/:id", deleteProgressNote);

export default router;
