// server/controllers/clinicalAuditController.js
const ClinicalAudit = require("../models/ClinicalAudit");
const { Op } = require("sequelize");

// Create a new clinical audit
exports.createClinicalAudit = async (req, res) => {
  try {
    const {
      auditType,
      auditTitle,
      auditPeriod,
      objectives,
      methodology,
      standardsCriteria,
      casesReviewed,
      patientIds,
      tags,
    } = req.body;

    const clinicalAudit = await ClinicalAudit.create({
      consultantId: req.user.id,
      auditType,
      auditTitle,
      auditPeriod,
      objectives,
      methodology,
      standardsCriteria,
      casesReviewed,
      patientIds: patientIds || [],
      status: "PLANNING",
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      message: "Clinical audit created successfully",
      data: clinicalAudit,
    });
  } catch (error) {
    console.error("Error creating clinical audit:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create clinical audit",
      error: error.message,
    });
  }
};

// Get all clinical audits (with filters)
exports.getAllClinicalAudits = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      auditType,
      status,
      consultantId,
    } = req.query;

    const where = {};

    if (auditType) where.auditType = auditType;
    if (status) where.status = status;
    if (consultantId) where.consultantId = consultantId;

    const offset = (page - 1) * limit;

    const { count, rows } = await ClinicalAudit.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
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
    console.error("Error fetching clinical audits:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch clinical audits",
      error: error.message,
    });
  }
};

// Get clinical audits by consultant
exports.getClinicalAuditsByConsultant = async (req, res) => {
  try {
    const { consultantId } = req.params;

    const clinicalAudits = await ClinicalAudit.findAll({
      where: { consultantId },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: clinicalAudits,
      count: clinicalAudits.length,
    });
  } catch (error) {
    console.error("Error fetching consultant clinical audits:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch consultant clinical audits",
      error: error.message,
    });
  }
};

// Get clinical audit by ID
exports.getClinicalAuditById = async (req, res) => {
  try {
    const { id } = req.params;

    const clinicalAudit = await ClinicalAudit.findByPk(id);

    if (!clinicalAudit) {
      return res.status(404).json({
        success: false,
        message: "Clinical audit not found",
      });
    }

    res.json({
      success: true,
      data: clinicalAudit,
    });
  } catch (error) {
    console.error("Error fetching clinical audit:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch clinical audit",
      error: error.message,
    });
  }
};

// Update clinical audit
exports.updateClinicalAudit = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const clinicalAudit = await ClinicalAudit.findByPk(id);

    if (!clinicalAudit) {
      return res.status(404).json({
        success: false,
        message: "Clinical audit not found",
      });
    }

    // Only the creator can update
    if (clinicalAudit.consultantId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this clinical audit",
      });
    }

    await clinicalAudit.update(updates);

    res.json({
      success: true,
      message: "Clinical audit updated successfully",
      data: clinicalAudit,
    });
  } catch (error) {
    console.error("Error updating clinical audit:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update clinical audit",
      error: error.message,
    });
  }
};

// Update audit status
exports.updateAuditStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const clinicalAudit = await ClinicalAudit.findByPk(id);

    if (!clinicalAudit) {
      return res.status(404).json({
        success: false,
        message: "Clinical audit not found",
      });
    }

    await clinicalAudit.update({ status });

    res.json({
      success: true,
      message: "Audit status updated successfully",
      data: clinicalAudit,
    });
  } catch (error) {
    console.error("Error updating audit status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update audit status",
      error: error.message,
    });
  }
};

// Record audit presentation
exports.recordPresentation = async (req, res) => {
  try {
    const { id } = req.params;
    const { presentationVenue, attendees } = req.body;

    const clinicalAudit = await ClinicalAudit.findByPk(id);

    if (!clinicalAudit) {
      return res.status(404).json({
        success: false,
        message: "Clinical audit not found",
      });
    }

    await clinicalAudit.update({
      status: "PRESENTED",
      presentedAt: new Date(),
      presentationVenue,
      attendees: attendees || [],
    });

    res.json({
      success: true,
      message: "Audit presentation recorded successfully",
      data: clinicalAudit,
    });
  } catch (error) {
    console.error("Error recording presentation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to record presentation",
      error: error.message,
    });
  }
};

// Delete clinical audit
exports.deleteClinicalAudit = async (req, res) => {
  try {
    const { id } = req.params;

    const clinicalAudit = await ClinicalAudit.findByPk(id);

    if (!clinicalAudit) {
      return res.status(404).json({
        success: false,
        message: "Clinical audit not found",
      });
    }

    // Only creator can delete
    if (clinicalAudit.consultantId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this clinical audit",
      });
    }

    await clinicalAudit.destroy();

    res.json({
      success: true,
      message: "Clinical audit deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting clinical audit:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete clinical audit",
      error: error.message,
    });
  }
};

// Get audit statistics
exports.getAuditStats = async (req, res) => {
  try {
    const { consultantId } = req.query;

    const where = {};
    if (consultantId) where.consultantId = consultantId;

    const totalAudits = await ClinicalAudit.count({ where });

    const auditTypeCounts = await ClinicalAudit.findAll({
      where,
      attributes: [
        "auditType",
        [ClinicalAudit.sequelize.fn("COUNT", ClinicalAudit.sequelize.col("id")), "count"],
      ],
      group: ["auditType"],
      raw: true,
    });

    const statusCounts = await ClinicalAudit.findAll({
      where,
      attributes: [
        "status",
        [ClinicalAudit.sequelize.fn("COUNT", ClinicalAudit.sequelize.col("id")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    const completedCount = await ClinicalAudit.count({
      where: { ...where, status: "COMPLETED" },
    });

    const presentedCount = await ClinicalAudit.count({
      where: { ...where, status: "PRESENTED" },
    });

    const avgComplianceRate = await ClinicalAudit.findOne({
      where: {
        ...where,
        complianceRate: { [Op.ne]: null },
      },
      attributes: [
        [ClinicalAudit.sequelize.fn("AVG", ClinicalAudit.sequelize.col("complianceRate")), "avg"],
      ],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        totalAudits,
        completedCount,
        presentedCount,
        auditTypeBreakdown: auditTypeCounts,
        statusBreakdown: statusCounts,
        avgComplianceRate: avgComplianceRate?.avg
          ? parseFloat(avgComplianceRate.avg).toFixed(2)
          : null,
      },
    });
  } catch (error) {
    console.error("Error fetching audit stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit statistics",
      error: error.message,
    });
  }
};
