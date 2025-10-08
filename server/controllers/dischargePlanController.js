// server/controllers/dischargePlanController.js
const DischargePlan = require("../models/DischargePlan");
const { Op } = require("sequelize");

// Create a new discharge plan
exports.createDischargePlan = async (req, res) => {
  try {
    const {
      patientId,
      proposedDischargeDate,
      dischargeDestination,
      dischargeDiagnosis,
      dischargeSummary,
      dischargeMedications,
      followUpInstructions,
      followUpAppointment,
      dietaryInstructions,
      activityRestrictions,
      woundCareInstructions,
      warningSignsToWatch,
      socialSupportNeeded,
      socialWorkerNotes,
      transportationArranged,
      equipmentNeeded,
      referrals,
      dischargeChecklist,
    } = req.body;

    // Check if discharge plan already exists for this patient
    const existing = await DischargePlan.findOne({
      where: {
        patientId,
        status: { [Op.in]: ["PLANNED", "PENDING_APPROVAL", "APPROVED"] },
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Active discharge plan already exists for this patient",
      });
    }

    const dischargePlan = await DischargePlan.create({
      patientId,
      consultantId: req.user.id,
      proposedDischargeDate,
      dischargeDestination,
      dischargeDiagnosis,
      dischargeSummary,
      dischargeMedications: dischargeMedications || [],
      followUpInstructions,
      followUpAppointment,
      dietaryInstructions,
      activityRestrictions,
      woundCareInstructions,
      warningSignsToWatch,
      socialSupportNeeded: socialSupportNeeded || false,
      socialWorkerNotes,
      transportationArranged: transportationArranged || false,
      equipmentNeeded: equipmentNeeded || [],
      referrals: referrals || [],
      dischargeChecklist: dischargeChecklist || {
        vitalSignsStable: false,
        medicationsReconciled: false,
        followUpScheduled: false,
        patientEducationCompleted: false,
        dischargeSummaryProvided: false,
        transportationArranged: false,
      },
      status: "PLANNED",
    });

    res.status(201).json({
      success: true,
      message: "Discharge plan created successfully",
      data: dischargePlan,
    });
  } catch (error) {
    console.error("Error creating discharge plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create discharge plan",
      error: error.message,
    });
  }
};

// Get all discharge plans (with filters)
exports.getAllDischargePlans = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, consultantId } = req.query;

    const where = {};

    if (status) where.status = status;
    if (consultantId) where.consultantId = consultantId;

    const offset = (page - 1) * limit;

    const { count, rows } = await DischargePlan.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [["proposedDischargeDate", "ASC"]],
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
    console.error("Error fetching discharge plans:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch discharge plans",
      error: error.message,
    });
  }
};

// Get discharge plan by patient ID
exports.getDischargePlanByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const dischargePlan = await DischargePlan.findOne({
      where: { patientId },
      order: [["createdAt", "DESC"]],
    });

    if (!dischargePlan) {
      return res.status(404).json({
        success: false,
        message: "No discharge plan found for this patient",
      });
    }

    res.json({
      success: true,
      data: dischargePlan,
    });
  } catch (error) {
    console.error("Error fetching discharge plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch discharge plan",
      error: error.message,
    });
  }
};

// Get pending discharge plans
exports.getPendingDischargePlans = async (req, res) => {
  try {
    const dischargePlans = await DischargePlan.findAll({
      where: {
        status: "PENDING_APPROVAL",
      },
      order: [["proposedDischargeDate", "ASC"]],
    });

    res.json({
      success: true,
      data: dischargePlans,
      count: dischargePlans.length,
    });
  } catch (error) {
    console.error("Error fetching pending discharge plans:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending discharge plans",
      error: error.message,
    });
  }
};

// Get discharge plan by ID
exports.getDischargePlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const dischargePlan = await DischargePlan.findByPk(id);

    if (!dischargePlan) {
      return res.status(404).json({
        success: false,
        message: "Discharge plan not found",
      });
    }

    res.json({
      success: true,
      data: dischargePlan,
    });
  } catch (error) {
    console.error("Error fetching discharge plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch discharge plan",
      error: error.message,
    });
  }
};

// Update discharge plan
exports.updateDischargePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const dischargePlan = await DischargePlan.findByPk(id);

    if (!dischargePlan) {
      return res.status(404).json({
        success: false,
        message: "Discharge plan not found",
      });
    }

    // Only the creator can update
    if (dischargePlan.consultantId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this discharge plan",
      });
    }

    // Cannot update if already completed or cancelled
    if (["COMPLETED", "CANCELLED"].includes(dischargePlan.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot update completed or cancelled discharge plan",
      });
    }

    await dischargePlan.update(updates);

    res.json({
      success: true,
      message: "Discharge plan updated successfully",
      data: dischargePlan,
    });
  } catch (error) {
    console.error("Error updating discharge plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update discharge plan",
      error: error.message,
    });
  }
};

// Submit discharge plan for approval
exports.submitForApproval = async (req, res) => {
  try {
    const { id } = req.params;

    const dischargePlan = await DischargePlan.findByPk(id);

    if (!dischargePlan) {
      return res.status(404).json({
        success: false,
        message: "Discharge plan not found",
      });
    }

    if (dischargePlan.status !== "PLANNED") {
      return res.status(400).json({
        success: false,
        message: "Can only submit planned discharge plans for approval",
      });
    }

    await dischargePlan.update({
      status: "PENDING_APPROVAL",
    });

    res.json({
      success: true,
      message: "Discharge plan submitted for approval",
      data: dischargePlan,
    });
  } catch (error) {
    console.error("Error submitting discharge plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit discharge plan",
      error: error.message,
    });
  }
};

// Approve discharge plan
exports.approveDischargePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalComments } = req.body;

    const dischargePlan = await DischargePlan.findByPk(id);

    if (!dischargePlan) {
      return res.status(404).json({
        success: false,
        message: "Discharge plan not found",
      });
    }

    if (dischargePlan.status !== "PENDING_APPROVAL") {
      return res.status(400).json({
        success: false,
        message: "Can only approve pending discharge plans",
      });
    }

    await dischargePlan.update({
      status: "APPROVED",
      approvedBy: req.user.id,
      approvedAt: new Date(),
      approvalComments,
    });

    res.json({
      success: true,
      message: "Discharge plan approved successfully",
      data: dischargePlan,
    });
  } catch (error) {
    console.error("Error approving discharge plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve discharge plan",
      error: error.message,
    });
  }
};

// Complete discharge (patient discharged)
exports.completeDischargePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { actualDischargeDate } = req.body;

    const dischargePlan = await DischargePlan.findByPk(id);

    if (!dischargePlan) {
      return res.status(404).json({
        success: false,
        message: "Discharge plan not found",
      });
    }

    if (dischargePlan.status !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Can only complete approved discharge plans",
      });
    }

    await dischargePlan.update({
      status: "COMPLETED",
      actualDischargeDate: actualDischargeDate || new Date(),
    });

    res.json({
      success: true,
      message: "Discharge completed successfully",
      data: dischargePlan,
    });
  } catch (error) {
    console.error("Error completing discharge:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete discharge",
      error: error.message,
    });
  }
};

// Cancel discharge plan
exports.cancelDischargePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelledReason } = req.body;

    const dischargePlan = await DischargePlan.findByPk(id);

    if (!dischargePlan) {
      return res.status(404).json({
        success: false,
        message: "Discharge plan not found",
      });
    }

    if (dischargePlan.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel completed discharge",
      });
    }

    if (!cancelledReason) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required",
      });
    }

    await dischargePlan.update({
      status: "CANCELLED",
      cancelledReason,
    });

    res.json({
      success: true,
      message: "Discharge plan cancelled successfully",
      data: dischargePlan,
    });
  } catch (error) {
    console.error("Error cancelling discharge plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel discharge plan",
      error: error.message,
    });
  }
};

// Update discharge checklist
exports.updateDischargeChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const { dischargeChecklist } = req.body;

    const dischargePlan = await DischargePlan.findByPk(id);

    if (!dischargePlan) {
      return res.status(404).json({
        success: false,
        message: "Discharge plan not found",
      });
    }

    await dischargePlan.update({
      dischargeChecklist: {
        ...dischargePlan.dischargeChecklist,
        ...dischargeChecklist,
      },
    });

    res.json({
      success: true,
      message: "Discharge checklist updated successfully",
      data: dischargePlan,
    });
  } catch (error) {
    console.error("Error updating discharge checklist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update discharge checklist",
      error: error.message,
    });
  }
};

// Get discharge statistics
exports.getDischargeStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};

    if (startDate || endDate) {
      where.proposedDischargeDate = {};
      if (startDate) where.proposedDischargeDate[Op.gte] = startDate;
      if (endDate) where.proposedDischargeDate[Op.lte] = endDate;
    }

    const totalPlans = await DischargePlan.count({ where });

    const statusCounts = await DischargePlan.findAll({
      where,
      attributes: [
        "status",
        [
          DischargePlan.sequelize.fn(
            "COUNT",
            DischargePlan.sequelize.col("id")
          ),
          "count",
        ],
      ],
      group: ["status"],
      raw: true,
    });

    const destinationCounts = await DischargePlan.findAll({
      where,
      attributes: [
        "dischargeDestination",
        [
          DischargePlan.sequelize.fn(
            "COUNT",
            DischargePlan.sequelize.col("id")
          ),
          "count",
        ],
      ],
      group: ["dischargeDestination"],
      raw: true,
    });

    const completedCount = await DischargePlan.count({
      where: { ...where, status: "COMPLETED" },
    });

    res.json({
      success: true,
      data: {
        totalPlans,
        completedCount,
        statusBreakdown: statusCounts,
        destinationBreakdown: destinationCounts,
        completionRate:
          totalPlans > 0 ? (completedCount / totalPlans) * 100 : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching discharge stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch discharge statistics",
      error: error.message,
    });
  }
};
