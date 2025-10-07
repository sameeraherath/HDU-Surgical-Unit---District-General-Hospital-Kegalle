import {
  ProgressNote,
  Patient,
  UserMySQLModel,
} from "../config/mysqlDB.js";
import { Op } from "sequelize";
import { logPatientCare } from "../services/auditService.js";

// @desc    Create a new progress note
// @route   POST /api/medical-officer/progress-notes
// @access  Private (Medical Staff)
export const createProgressNote = async (req, res) => {
  try {
    const {
      patientId,
      noteType,
      subjective,
      objective,
      assessment,
      plan,
      chiefComplaint,
      clinicalFindings,
      diagnosis,
      treatmentPlan,
      followUpInstructions,
      priority,
      tags,
      isConfidential,
    } = req.body;

    // Verify patient exists
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const progressNote = await ProgressNote.create({
      patientId,
      userId: req.user.id,
      noteType: noteType || "PROGRESS",
      subjective,
      objective,
      assessment,
      plan,
      chiefComplaint,
      clinicalFindings,
      diagnosis,
      treatmentPlan,
      followUpInstructions,
      priority: priority || "MEDIUM",
      status: "COMPLETED",
      tags: tags || [],
      isConfidential: isConfidential || false,
    });

    // Audit log
    await logPatientCare({
      userId: req.user.id,
      action: "PROGRESS_NOTE_CREATE",
      patientId,
      description: `Created ${noteType || "PROGRESS"} note for patient`,
      newValues: progressNote.toJSON(),
      req,
    });

    // Send notification to assigned medical team
    const io = req.app.get("io");
    if (io) {
      io.to(`patient_${patientId}`).emit("progress-note-added", {
        progressNote,
        author: {
          id: req.user.id,
          username: req.user.username,
          role: req.user.role,
        },
      });
    }

    res.status(201).json({
      message: "Progress note created successfully",
      progressNote,
    });
  } catch (error) {
    console.error("Error creating progress note:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get progress notes for a patient
// @route   GET /api/medical-officer/progress-notes/:patientId
// @access  Private (Medical Staff)
export const getProgressNotesByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { noteType, status, limit = 50, page = 1 } = req.query;

    const where = { patientId: parseInt(patientId) };
    if (noteType) where.noteType = noteType;
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    const { count, rows: progressNotes } = await ProgressNote.findAndCountAll({
      where,
      include: [
        {
          model: UserMySQLModel,
          as: "author",
          attributes: ["id", "username", "role"],
        },
        {
          model: UserMySQLModel,
          as: "reviewer",
          attributes: ["id", "username", "role"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.json({
      progressNotes,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching progress notes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get a single progress note by ID
// @route   GET /api/medical-officer/progress-notes/detail/:id
// @access  Private (Medical Staff)
export const getProgressNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const progressNote = await ProgressNote.findByPk(id, {
      include: [
        {
          model: UserMySQLModel,
          as: "author",
          attributes: ["id", "username", "role"],
        },
        {
          model: UserMySQLModel,
          as: "reviewer",
          attributes: ["id", "username", "role"],
        },
        {
          model: Patient,
          as: "patient",
          attributes: ["id", "firstName", "lastName", "patientId"],
        },
      ],
    });

    if (!progressNote) {
      return res.status(404).json({ message: "Progress note not found" });
    }

    res.json({ progressNote });
  } catch (error) {
    console.error("Error fetching progress note:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a progress note
// @route   PUT /api/medical-officer/progress-notes/:id
// @access  Private (Medical Staff - Author only)
export const updateProgressNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const progressNote = await ProgressNote.findByPk(id);

    if (!progressNote) {
      return res.status(404).json({ message: "Progress note not found" });
    }

    // Check if user is the author
    if (progressNote.userId !== req.user.id) {
      return res.status(403).json({
        message: "Access denied. Only the author can update this note.",
      });
    }

    // Check if note is already reviewed
    if (progressNote.status === "REVIEWED") {
      // Change status to AMENDED
      updateData.status = "AMENDED";
    }

    const oldValues = progressNote.toJSON();
    await progressNote.update(updateData);

    // Audit log
    await logPatientCare({
      userId: req.user.id,
      action: "PROGRESS_NOTE_UPDATE",
      patientId: progressNote.patientId,
      description: `Updated ${progressNote.noteType} note`,
      oldValues,
      newValues: progressNote.toJSON(),
      req,
    });

    res.json({
      message: "Progress note updated successfully",
      progressNote,
    });
  } catch (error) {
    console.error("Error updating progress note:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Review a progress note (Consultant only)
// @route   PUT /api/medical-officer/progress-notes/:id/review
// @access  Private (Consultant only)
export const reviewProgressNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewComments } = req.body;

    if (req.user.role !== "Consultant") {
      return res.status(403).json({
        message: "Access denied. Only consultants can review notes.",
      });
    }

    const progressNote = await ProgressNote.findByPk(id);

    if (!progressNote) {
      return res.status(404).json({ message: "Progress note not found" });
    }

    await progressNote.update({
      status: "REVIEWED",
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
      reviewComments,
    });

    // Audit log
    await logPatientCare({
      userId: req.user.id,
      action: "PROGRESS_NOTE_REVIEW",
      patientId: progressNote.patientId,
      description: `Reviewed ${progressNote.noteType} note`,
      req,
    });

    res.json({
      message: "Progress note reviewed successfully",
      progressNote,
    });
  } catch (error) {
    console.error("Error reviewing progress note:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a progress note
// @route   DELETE /api/medical-officer/progress-notes/:id
// @access  Private (Medical Staff - Author or Consultant)
export const deleteProgressNote = async (req, res) => {
  try {
    const { id } = req.params;

    const progressNote = await ProgressNote.findByPk(id);

    if (!progressNote) {
      return res.status(404).json({ message: "Progress note not found" });
    }

    // Check if user is the author or a consultant
    if (
      progressNote.userId !== req.user.id &&
      req.user.role !== "Consultant"
    ) {
      return res.status(403).json({
        message: "Access denied. Only the author or consultant can delete.",
      });
    }

    // Audit log before deletion
    await logPatientCare({
      userId: req.user.id,
      action: "PROGRESS_NOTE_DELETE",
      patientId: progressNote.patientId,
      description: `Deleted ${progressNote.noteType} note`,
      oldValues: progressNote.toJSON(),
      req,
    });

    await progressNote.destroy();

    res.json({ message: "Progress note deleted successfully" });
  } catch (error) {
    console.error("Error deleting progress note:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get progress note templates
// @route   GET /api/medical-officer/progress-notes/templates
// @access  Private (Medical Staff)
export const getProgressNoteTemplates = async (req, res) => {
  try {
    const templates = await ProgressNote.findAll({
      where: {
        isTemplate: true,
      },
      attributes: [
        "id",
        "templateName",
        "noteType",
        "subjective",
        "objective",
        "assessment",
        "plan",
      ],
      order: [["templateName", "ASC"]],
    });

    res.json({ templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a progress note template
// @route   POST /api/medical-officer/progress-notes/templates
// @access  Private (Medical Staff)
export const createProgressNoteTemplate = async (req, res) => {
  try {
    const { templateName, noteType, subjective, objective, assessment, plan } =
      req.body;

    const template = await ProgressNote.create({
      patientId: null, // Templates don't have a patient
      userId: req.user.id,
      templateName,
      noteType,
      subjective,
      objective,
      assessment,
      plan,
      isTemplate: true,
      status: "COMPLETED",
    });

    res.status(201).json({
      message: "Template created successfully",
      template,
    });
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
