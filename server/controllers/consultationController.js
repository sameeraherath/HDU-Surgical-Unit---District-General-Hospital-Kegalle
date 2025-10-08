// server/controllers/consultationController.js
const Consultation = require("../models/Consultation");
const { Op } = require("sequelize");

// Create a new consultation request
exports.createConsultation = async (req, res) => {
  try {
    const {
      patientId,
      consultationType,
      urgency,
      requestReason,
      clinicalQuestion,
      relevantHistory,
      investigations,
    } = req.body;

    const consultation = await Consultation.create({
      patientId,
      requestedById: req.user.id,
      consultationType,
      urgency: urgency || "ROUTINE",
      requestReason,
      clinicalQuestion,
      relevantHistory,
      investigations,
      status: "PENDING",
      requestedDate: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Consultation request created successfully",
      data: consultation,
    });
  } catch (error) {
    console.error("Error creating consultation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create consultation request",
      error: error.message,
    });
  }
};

// Get all consultations (with filters)
exports.getAllConsultations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      urgency,
      consultationType,
      consultantId,
    } = req.query;

    const where = {};

    if (status) where.status = status;
    if (urgency) where.urgency = urgency;
    if (consultationType) where.consultationType = consultationType;
    if (consultantId) where.consultantId = consultantId;

    const offset = (page - 1) * limit;

    const { count, rows } = await Consultation.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [
        ["urgency", "DESC"],
        ["requestedDate", "DESC"],
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
    console.error("Error fetching consultations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch consultations",
      error: error.message,
    });
  }
};

// Get pending consultations
exports.getPendingConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.findAll({
      where: {
        status: "PENDING",
      },
      order: [
        ["urgency", "DESC"],
        ["requestedDate", "ASC"],
      ],
    });

    res.json({
      success: true,
      data: consultations,
      count: consultations.length,
    });
  } catch (error) {
    console.error("Error fetching pending consultations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending consultations",
      error: error.message,
    });
  }
};

// Get my consultations (assigned to me as consultant)
exports.getMyConsultations = async (req, res) => {
  try {
    const { status } = req.query;

    const where = {
      consultantId: req.user.id,
    };

    if (status) where.status = status;

    const consultations = await Consultation.findAll({
      where,
      order: [
        ["urgency", "DESC"],
        ["requestedDate", "DESC"],
      ],
    });

    res.json({
      success: true,
      data: consultations,
      count: consultations.length,
    });
  } catch (error) {
    console.error("Error fetching my consultations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch my consultations",
      error: error.message,
    });
  }
};

// Get consultations by patient
exports.getConsultationsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const consultations = await Consultation.findAll({
      where: { patientId },
      order: [["requestedDate", "DESC"]],
    });

    res.json({
      success: true,
      data: consultations,
      count: consultations.length,
    });
  } catch (error) {
    console.error("Error fetching patient consultations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient consultations",
      error: error.message,
    });
  }
};

// Get consultation by ID
exports.getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findByPk(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    res.json({
      success: true,
      data: consultation,
    });
  } catch (error) {
    console.error("Error fetching consultation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch consultation",
      error: error.message,
    });
  }
};

// Assign consultation to consultant
exports.assignConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { consultantId } = req.body;

    const consultation = await Consultation.findByPk(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    if (consultation.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Can only assign pending consultations",
      });
    }

    await consultation.update({
      consultantId: consultantId || req.user.id,
      status: "ASSIGNED",
      assignedDate: new Date(),
    });

    res.json({
      success: true,
      message: "Consultation assigned successfully",
      data: consultation,
    });
  } catch (error) {
    console.error("Error assigning consultation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to assign consultation",
      error: error.message,
    });
  }
};

// Update consultation status
exports.updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const consultation = await Consultation.findByPk(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    const updates = { status };

    if (status === "IN_PROGRESS") {
      updates.consultationDate = new Date();
    } else if (status === "COMPLETED") {
      updates.completedDate = new Date();
    }

    await consultation.update(updates);

    res.json({
      success: true,
      message: "Consultation status updated successfully",
      data: consultation,
    });
  } catch (error) {
    console.error("Error updating consultation status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update consultation status",
      error: error.message,
    });
  }
};

// Complete consultation (provide opinion)
exports.completeConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      consultantFindings,
      consultantOpinion,
      recommendations,
      followUpRequired,
      followUpDate,
      followUpNotes,
    } = req.body;

    const consultation = await Consultation.findByPk(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    if (consultation.consultantId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to complete this consultation",
      });
    }

    await consultation.update({
      consultantFindings,
      consultantOpinion,
      recommendations,
      followUpRequired: followUpRequired || false,
      followUpDate,
      followUpNotes,
      status: "COMPLETED",
      completedDate: new Date(),
      notifiedAt: new Date(),
    });

    res.json({
      success: true,
      message: "Consultation completed successfully",
      data: consultation,
    });
  } catch (error) {
    console.error("Error completing consultation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete consultation",
      error: error.message,
    });
  }
};

// Cancel consultation
exports.cancelConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelledReason } = req.body;

    const consultation = await Consultation.findByPk(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    if (!cancelledReason) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required",
      });
    }

    await consultation.update({
      status: "CANCELLED",
      cancelledReason,
    });

    res.json({
      success: true,
      message: "Consultation cancelled successfully",
      data: consultation,
    });
  } catch (error) {
    console.error("Error cancelling consultation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel consultation",
      error: error.message,
    });
  }
};

// Get consultation statistics
exports.getConsultationStats = async (req, res) => {
  try {
    const { startDate, endDate, consultantId } = req.query;

    const where = {};

    if (consultantId) where.consultantId = consultantId;

    if (startDate || endDate) {
      where.requestedDate = {};
      if (startDate) where.requestedDate[Op.gte] = startDate;
      if (endDate) where.requestedDate[Op.lte] = endDate;
    }

    const totalConsultations = await Consultation.count({ where });

    const statusCounts = await Consultation.findAll({
      where,
      attributes: [
        "status",
        [
          Consultation.sequelize.fn("COUNT", Consultation.sequelize.col("id")),
          "count",
        ],
      ],
      group: ["status"],
      raw: true,
    });

    const urgencyCounts = await Consultation.findAll({
      where,
      attributes: [
        "urgency",
        [
          Consultation.sequelize.fn("COUNT", Consultation.sequelize.col("id")),
          "count",
        ],
      ],
      group: ["urgency"],
      raw: true,
    });

    const typeCounts = await Consultation.findAll({
      where,
      attributes: [
        "consultationType",
        [
          Consultation.sequelize.fn("COUNT", Consultation.sequelize.col("id")),
          "count",
        ],
      ],
      group: ["consultationType"],
      raw: true,
    });

    const completedCount = await Consultation.count({
      where: { ...where, status: "COMPLETED" },
    });

    res.json({
      success: true,
      data: {
        totalConsultations,
        completedCount,
        statusBreakdown: statusCounts,
        urgencyBreakdown: urgencyCounts,
        typeBreakdown: typeCounts,
        completionRate:
          totalConsultations > 0
            ? (completedCount / totalConsultations) * 100
            : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching consultation stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch consultation statistics",
      error: error.message,
    });
  }
};
