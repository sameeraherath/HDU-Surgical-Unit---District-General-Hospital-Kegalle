// server/controllers/teachingNoteController.js
import TeachingNote from "../models/TeachingNote.js";
import { Op } from "sequelize";

// Create a new teaching note
export const createTeachingNote = async (req, res) => {
  try {
    const {
      patientId,
      sessionTime,
      sessionType,
      topic,
      learningObjectives,
      clinicalScenario,
      teachingContent,
      clinicalPearls,
      references,
      attendees,
      attendeeCount,
      assessmentMethod,
      feedbackReceived,
      followUpRequired,
      followUpNotes,
      attachments,
      tags,
    } = req.body;

    const teachingNote = await TeachingNote.create({
      consultantId: req.user.id,
      patientId,
      sessionDate: new Date(),
      sessionTime,
      sessionType,
      topic,
      learningObjectives,
      clinicalScenario,
      teachingContent,
      clinicalPearls,
      references,
      attendees: attendees || [],
      attendeeCount: attendeeCount || (attendees ? attendees.length : 0),
      assessmentMethod,
      feedbackReceived,
      followUpRequired: followUpRequired || false,
      followUpNotes,
      attachments: attachments || [],
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      message: "Teaching note created successfully",
      data: teachingNote,
    });
  } catch (error) {
    console.error("Error creating teaching note:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create teaching note",
      error: error.message,
    });
  }
};

// Get all teaching notes (with filters)
export const getAllTeachingNotes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      consultantId,
      sessionType,
      startDate,
      endDate,
      tags,
    } = req.query;

    const where = {};

    if (consultantId) where.consultantId = consultantId;
    if (sessionType) where.sessionType = sessionType;

    if (startDate || endDate) {
      where.sessionDate = {};
      if (startDate) where.sessionDate[Op.gte] = startDate;
      if (endDate) where.sessionDate[Op.lte] = endDate;
    }

    if (tags) {
      where.tags = {
        [Op.contains]: Array.isArray(tags) ? tags : [tags],
      };
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await TeachingNote.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [
        ["sessionDate", "DESC"],
        ["sessionTime", "DESC"],
      ],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching teaching notes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teaching notes",
      error: error.message,
    });
  }
};

// Get teaching notes by consultant
export const getTeachingNotesByConsultant = async (req, res) => {
  try {
    const { consultantId } = req.params;

    const teachingNotes = await TeachingNote.findAll({
      where: { consultantId },
      order: [
        ["sessionDate", "DESC"],
        ["sessionTime", "DESC"],
      ],
    });

    res.json({
      success: true,
      data: teachingNotes,
      count: teachingNotes.length,
    });
  } catch (error) {
    console.error("Error fetching consultant teaching notes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch consultant teaching notes",
      error: error.message,
    });
  }
};

// Get teaching notes by patient
export const getTeachingNotesByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const teachingNotes = await TeachingNote.findAll({
      where: { patientId },
      order: [["sessionDate", "DESC"]],
    });

    res.json({
      success: true,
      data: teachingNotes,
      count: teachingNotes.length,
    });
  } catch (error) {
    console.error("Error fetching patient teaching notes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient teaching notes",
      error: error.message,
    });
  }
};

// Get teaching note by ID
export const getTeachingNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const teachingNote = await TeachingNote.findByPk(id);

    if (!teachingNote) {
      return res.status(404).json({
        success: false,
        message: "Teaching note not found",
      });
    }

    res.json({
      success: true,
      data: teachingNote,
    });
  } catch (error) {
    console.error("Error fetching teaching note:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teaching note",
      error: error.message,
    });
  }
};

// Update teaching note
export const updateTeachingNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const teachingNote = await TeachingNote.findByPk(id);

    if (!teachingNote) {
      return res.status(404).json({
        success: false,
        message: "Teaching note not found",
      });
    }

    // Only the creator can update
    if (teachingNote.consultantId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this teaching note",
      });
    }

    await teachingNote.update(updates);

    res.json({
      success: true,
      message: "Teaching note updated successfully",
      data: teachingNote,
    });
  } catch (error) {
    console.error("Error updating teaching note:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update teaching note",
      error: error.message,
    });
  }
};

// Delete teaching note
export const deleteTeachingNote = async (req, res) => {
  try {
    const { id } = req.params;

    const teachingNote = await TeachingNote.findByPk(id);

    if (!teachingNote) {
      return res.status(404).json({
        success: false,
        message: "Teaching note not found",
      });
    }

    // Only creator can delete
    if (teachingNote.consultantId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this teaching note",
      });
    }

    await teachingNote.destroy();

    res.json({
      success: true,
      message: "Teaching note deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting teaching note:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete teaching note",
      error: error.message,
    });
  }
};

// Get teaching statistics
export const getTeachingStats = async (req, res) => {
  try {
    const { startDate, endDate, consultantId } = req.query;

    const where = {};

    if (consultantId) where.consultantId = consultantId;

    if (startDate || endDate) {
      where.sessionDate = {};
      if (startDate) where.sessionDate[Op.gte] = startDate;
      if (endDate) where.sessionDate[Op.lte] = endDate;
    }

    const totalSessions = await TeachingNote.count({ where });

    const sessionTypeCounts = await TeachingNote.findAll({
      where,
      attributes: [
        "sessionType",
        [
          TeachingNote.sequelize.fn("COUNT", TeachingNote.sequelize.col("id")),
          "count",
        ],
      ],
      group: ["sessionType"],
      raw: true,
    });

    const totalAttendees = await TeachingNote.sum("attendeeCount", { where });

    const avgAttendeesPerSession =
      totalSessions > 0 ? totalAttendees / totalSessions : 0;

    const followUpRequiredCount = await TeachingNote.count({
      where: { ...where, followUpRequired: true },
    });

    res.json({
      success: true,
      data: {
        totalSessions,
        sessionTypeBreakdown: sessionTypeCounts,
        totalAttendees: totalAttendees || 0,
        avgAttendeesPerSession: parseFloat(avgAttendeesPerSession.toFixed(2)),
        followUpRequiredCount,
      },
    });
  } catch (error) {
    console.error("Error fetching teaching stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teaching statistics",
      error: error.message,
    });
  }
};

// Search teaching notes by topic or content
export const searchTeachingNotes = async (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const where = {
      [Op.or]: [
        { topic: { [Op.iLike]: `%${query}%` } },
        { teachingContent: { [Op.iLike]: `%${query}%` } },
        { clinicalPearls: { [Op.iLike]: `%${query}%` } },
      ],
    };

    const offset = (page - 1) * limit;

    const { count, rows } = await TeachingNote.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [["sessionDate", "DESC"]],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error searching teaching notes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search teaching notes",
      error: error.message,
    });
  }
};

export default {
  createTeachingNote,
  getAllTeachingNotes,
  getTeachingNotesByConsultant,
  getTeachingNotesByPatient,
  getTeachingNoteById,
  updateTeachingNote,
  deleteTeachingNote,
  getTeachingStats,
  searchTeachingNotes,
};
