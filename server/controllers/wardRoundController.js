// server/controllers/wardRoundController.js
const WardRound = require("../models/WardRound");
const { Op } = require("sequelize");

// Create a new ward round entry
exports.createWardRound = async (req, res) => {
  try {
    const {
      patientId,
      roundTime,
      chiefComplaint,
      clinicalFindings,
      assessment,
      managementPlan,
      investigationsOrdered,
      followUpPlan,
      teachingPoints,
      attendees,
      patientStatus,
      dischargeDiscussed,
      estimatedDischargeDate,
    } = req.body;

    const wardRound = await WardRound.create({
      patientId,
      consultantId: req.user.id,
      roundDate: new Date(),
      roundTime,
      chiefComplaint,
      clinicalFindings,
      assessment,
      managementPlan,
      investigationsOrdered,
      followUpPlan,
      teachingPoints,
      attendees: attendees || [],
      patientStatus: patientStatus || "STABLE",
      dischargeDiscussed: dischargeDiscussed || false,
      estimatedDischargeDate,
    });

    res.status(201).json({
      success: true,
      message: "Ward round created successfully",
      data: wardRound,
    });
  } catch (error) {
    console.error("Error creating ward round:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create ward round",
      error: error.message,
    });
  }
};

// Get all ward rounds (with filters)
exports.getAllWardRounds = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      patientId,
      consultantId,
      startDate,
      endDate,
      patientStatus,
    } = req.query;

    const where = {};

    if (patientId) where.patientId = patientId;
    if (consultantId) where.consultantId = consultantId;
    if (patientStatus) where.patientStatus = patientStatus;

    if (startDate || endDate) {
      where.roundDate = {};
      if (startDate) where.roundDate[Op.gte] = startDate;
      if (endDate) where.roundDate[Op.lte] = endDate;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await WardRound.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [
        ["roundDate", "DESC"],
        ["roundTime", "DESC"],
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
    console.error("Error fetching ward rounds:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ward rounds",
      error: error.message,
    });
  }
};

// Get ward rounds by patient
exports.getWardRoundsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const wardRounds = await WardRound.findAll({
      where: { patientId },
      order: [
        ["roundDate", "DESC"],
        ["roundTime", "DESC"],
      ],
    });

    res.json({
      success: true,
      data: wardRounds,
      count: wardRounds.length,
    });
  } catch (error) {
    console.error("Error fetching patient ward rounds:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient ward rounds",
      error: error.message,
    });
  }
};

// Get today's ward rounds
exports.getTodaysWardRounds = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const wardRounds = await WardRound.findAll({
      where: {
        roundDate: today,
        consultantId: req.user.id,
      },
      order: [["roundTime", "ASC"]],
    });

    res.json({
      success: true,
      data: wardRounds,
      count: wardRounds.length,
    });
  } catch (error) {
    console.error("Error fetching today's ward rounds:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch today's ward rounds",
      error: error.message,
    });
  }
};

// Get single ward round by ID
exports.getWardRoundById = async (req, res) => {
  try {
    const { id } = req.params;

    const wardRound = await WardRound.findByPk(id);

    if (!wardRound) {
      return res.status(404).json({
        success: false,
        message: "Ward round not found",
      });
    }

    res.json({
      success: true,
      data: wardRound,
    });
  } catch (error) {
    console.error("Error fetching ward round:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ward round",
      error: error.message,
    });
  }
};

// Update ward round
exports.updateWardRound = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const wardRound = await WardRound.findByPk(id);

    if (!wardRound) {
      return res.status(404).json({
        success: false,
        message: "Ward round not found",
      });
    }

    // Only the creator or reviewer can update
    if (
      wardRound.consultantId !== req.user.id &&
      req.user.role !== "Consultant"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this ward round",
      });
    }

    await wardRound.update(updates);

    res.json({
      success: true,
      message: "Ward round updated successfully",
      data: wardRound,
    });
  } catch (error) {
    console.error("Error updating ward round:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update ward round",
      error: error.message,
    });
  }
};

// Review ward round (senior consultant)
exports.reviewWardRound = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewComments } = req.body;

    const wardRound = await WardRound.findByPk(id);

    if (!wardRound) {
      return res.status(404).json({
        success: false,
        message: "Ward round not found",
      });
    }

    await wardRound.update({
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
      reviewComments,
    });

    res.json({
      success: true,
      message: "Ward round reviewed successfully",
      data: wardRound,
    });
  } catch (error) {
    console.error("Error reviewing ward round:", error);
    res.status(500).json({
      success: false,
      message: "Failed to review ward round",
      error: error.message,
    });
  }
};

// Delete ward round
exports.deleteWardRound = async (req, res) => {
  try {
    const { id } = req.params;

    const wardRound = await WardRound.findByPk(id);

    if (!wardRound) {
      return res.status(404).json({
        success: false,
        message: "Ward round not found",
      });
    }

    // Only creator can delete
    if (wardRound.consultantId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this ward round",
      });
    }

    await wardRound.destroy();

    res.json({
      success: true,
      message: "Ward round deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ward round:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete ward round",
      error: error.message,
    });
  }
};

// Get ward round summary statistics
exports.getWardRoundStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const consultantId = req.user.id;

    const where = { consultantId };

    if (startDate || endDate) {
      where.roundDate = {};
      if (startDate) where.roundDate[Op.gte] = startDate;
      if (endDate) where.roundDate[Op.lte] = endDate;
    }

    const totalRounds = await WardRound.count({ where });

    const patientStatusCounts = await WardRound.findAll({
      where,
      attributes: [
        "patientStatus",
        [
          WardRound.sequelize.fn("COUNT", WardRound.sequelize.col("id")),
          "count",
        ],
      ],
      group: ["patientStatus"],
      raw: true,
    });

    const dischargeDiscussedCount = await WardRound.count({
      where: { ...where, dischargeDiscussed: true },
    });

    const reviewedCount = await WardRound.count({
      where: {
        ...where,
        reviewedBy: { [Op.ne]: null },
      },
    });

    res.json({
      success: true,
      data: {
        totalRounds,
        patientStatusBreakdown: patientStatusCounts,
        dischargeDiscussedCount,
        reviewedCount,
        reviewRate: totalRounds > 0 ? (reviewedCount / totalRounds) * 100 : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching ward round stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ward round statistics",
      error: error.message,
    });
  }
};
