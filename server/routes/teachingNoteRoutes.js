// server/routes/teachingNoteRoutes.js
const express = require("express");
const router = express.Router();
const teachingNoteController = require("../controllers/teachingNoteController");
const { authenticateJWT } = require("../middleware/auth");

// All routes require authentication
router.use(authenticateJWT);

// Create teaching note
router.post("/", teachingNoteController.createTeachingNote);

// Get all teaching notes (with filters)
router.get("/", teachingNoteController.getAllTeachingNotes);

// Search teaching notes
router.get("/search", teachingNoteController.searchTeachingNotes);

// Get teaching statistics
router.get("/stats", teachingNoteController.getTeachingStats);

// Get teaching notes by consultant
router.get(
  "/consultant/:consultantId",
  teachingNoteController.getTeachingNotesByConsultant
);

// Get teaching notes by patient
router.get(
  "/patient/:patientId",
  teachingNoteController.getTeachingNotesByPatient
);

// Get single teaching note
router.get("/:id", teachingNoteController.getTeachingNoteById);

// Update teaching note
router.put("/:id", teachingNoteController.updateTeachingNote);

// Delete teaching note
router.delete("/:id", teachingNoteController.deleteTeachingNote);

module.exports = router;
