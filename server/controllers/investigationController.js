import {
  Investigation,
  InvestigationResult,
  Patient,
  UserMySQLModel,
} from "../config/mysqlDB.js";
import { Op } from "sequelize";
import { logPatientCare } from "../services/auditService.js";

// @desc    Order a new investigation
// @route   POST /api/medical-officer/investigations
// @access  Private (Medical Staff)
export const orderInvestigation = async (req, res) => {
  try {
    const {
      patientId,
      investigationType,
      investigationCategory,
      testName,
      testCode,
      urgency,
      priority,
      clinicalIndication,
      specialInstructions,
      specimenType,
      scheduledDate,
    } = req.body;

    // Verify patient exists
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const investigation = await Investigation.create({
      patientId,
      orderedBy: req.user.id,
      investigationType,
      investigationCategory,
      testName,
      testCode,
      urgency: urgency || "ROUTINE",
      priority: priority || "MEDIUM",
      clinicalIndication,
      specialInstructions,
      specimenType,
      scheduledDate,
      status: "ORDERED",
      orderDate: new Date(),
    });

    // Audit log
    await logPatientCare({
      userId: req.user.id,
      action: "INVESTIGATION_ORDER",
      patientId,
      description: `Ordered ${investigationType} - ${testName}`,
      newValues: investigation.toJSON(),
      req,
    });

    // Send notification
    const io = req.app.get("io");
    if (io) {
      // Notify lab staff
      io.to("role_LabTechnician").emit("investigation-ordered", {
        investigation,
        patient,
      });

      // Notify patient's medical team
      io.to(`patient_${patientId}`).emit("investigation-ordered", {
        investigation,
      });
    }

    res.status(201).json({
      message: "Investigation ordered successfully",
      investigation,
    });
  } catch (error) {
    console.error("Error ordering investigation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get investigations for a patient
// @route   GET /api/medical-officer/investigations/:patientId
// @access  Private (Medical Staff)
export const getInvestigationsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const {
      investigationType,
      status,
      urgency,
      limit = 50,
      page = 1,
    } = req.query;

    const where = { patientId: parseInt(patientId) };
    if (investigationType) where.investigationType = investigationType;
    if (status) where.status = status;
    if (urgency) where.urgency = urgency;

    const offset = (page - 1) * limit;

    const { count, rows: investigations } =
      await Investigation.findAndCountAll({
        where,
        include: [
          {
            model: UserMySQLModel,
            as: "orderer",
            attributes: ["id", "username", "role"],
          },
          {
            model: InvestigationResult,
            as: "results",
            limit: 5,
            order: [["resultDate", "DESC"]],
          },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["orderDate", "DESC"]],
      });

    res.json({
      investigations,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching investigations:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get pending investigations
// @route   GET /api/medical-officer/investigations/pending
// @access  Private (Medical Staff)
export const getPendingInvestigations = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: investigations } =
      await Investigation.findAndCountAll({
        where: {
          status: {
            [Op.in]: ["ORDERED", "SPECIMEN_COLLECTED", "IN_PROGRESS"],
          },
        },
        include: [
          {
            model: Patient,
            as: "patient",
            attributes: ["id", "firstName", "lastName", "patientId"],
          },
          {
            model: UserMySQLModel,
            as: "orderer",
            attributes: ["id", "username", "role"],
          },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [
          ["urgency", "DESC"],
          ["orderDate", "ASC"],
        ],
      });

    res.json({
      investigations,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching pending investigations:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update investigation status
// @route   PUT /api/medical-officer/investigations/:id/status
// @access  Private (Medical Staff/Lab Staff)
export const updateInvestigationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const investigation = await Investigation.findByPk(id);

    if (!investigation) {
      return res.status(404).json({ message: "Investigation not found" });
    }

    const oldStatus = investigation.status;
    const updateData = { status };

    if (notes) updateData.notes = notes;

    if (status === "SPECIMEN_COLLECTED") {
      updateData.specimenCollectedAt = new Date();
      updateData.specimenCollectedBy = req.user.id;
    } else if (status === "COMPLETED") {
      updateData.completedDate = new Date();
    } else if (status === "RESULTED") {
      updateData.resultedDate = new Date();
    }

    await investigation.update(updateData);

    // Audit log
    await logPatientCare({
      userId: req.user.id,
      action: "INVESTIGATION_STATUS_UPDATE",
      patientId: investigation.patientId,
      description: `Updated investigation status from ${oldStatus} to ${status}`,
      oldValues: { status: oldStatus },
      newValues: { status },
      req,
    });

    // Send notification
    const io = req.app.get("io");
    if (io && status === "RESULTED") {
      io.to(`user_${investigation.orderedBy}`).emit(
        "investigation-resulted",
        {
          investigation,
        }
      );
    }

    res.json({
      message: "Investigation status updated successfully",
      investigation,
    });
  } catch (error) {
    console.error("Error updating investigation status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Cancel an investigation
// @route   PUT /api/medical-officer/investigations/:id/cancel
// @access  Private (Medical Staff - Orderer or Consultant)
export const cancelInvestigation = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const investigation = await Investigation.findByPk(id);

    if (!investigation) {
      return res.status(404).json({ message: "Investigation not found" });
    }

    // Check if user is the orderer or a consultant
    if (
      investigation.orderedBy !== req.user.id &&
      req.user.role !== "Consultant"
    ) {
      return res.status(403).json({
        message: "Access denied. Only the orderer or consultant can cancel.",
      });
    }

    await investigation.update({
      status: "CANCELLED",
      cancellationReason,
    });

    // Audit log
    await logPatientCare({
      userId: req.user.id,
      action: "INVESTIGATION_CANCEL",
      patientId: investigation.patientId,
      description: `Cancelled investigation: ${investigation.testName}`,
      req,
    });

    res.json({
      message: "Investigation cancelled successfully",
      investigation,
    });
  } catch (error) {
    console.error("Error cancelling investigation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add investigation result
// @route   POST /api/medical-officer/investigations/:id/results
// @access  Private (Lab Staff/Medical Staff)
export const addInvestigationResult = async (req, res) => {
  try {
    const { id } = req.params;
    const resultData = req.body;

    const investigation = await Investigation.findByPk(id);

    if (!investigation) {
      return res.status(404).json({ message: "Investigation not found" });
    }

    const result = await InvestigationResult.create({
      investigationId: id,
      patientId: investigation.patientId,
      ...resultData,
      resultDate: new Date(),
    });

    // Update investigation status
    await investigation.update({
      status: "RESULTED",
      resultedDate: new Date(),
      reportedBy: req.user.id,
      isCritical: resultData.isCritical || false,
    });

    // Audit log
    await logPatientCare({
      userId: req.user.id,
      action: "INVESTIGATION_RESULT_ADD",
      patientId: investigation.patientId,
      description: `Added result for ${investigation.testName}`,
      req,
    });

    // Send critical result notification
    if (resultData.isCritical) {
      const io = req.app.get("io");
      if (io) {
        io.to(`user_${investigation.orderedBy}`).emit(
          "critical-investigation-result",
          {
            investigation,
            result,
          }
        );
      }

      await investigation.update({
        criticalNotifiedAt: new Date(),
      });
    }

    res.status(201).json({
      message: "Investigation result added successfully",
      result,
    });
  } catch (error) {
    console.error("Error adding investigation result:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get investigation results
// @route   GET /api/medical-officer/investigations/:id/results
// @access  Private (Medical Staff)
export const getInvestigationResults = async (req, res) => {
  try {
    const { id } = req.params;

    const results = await InvestigationResult.findAll({
      where: { investigationId: id },
      include: [
        {
          model: UserMySQLModel,
          as: "verifier",
          attributes: ["id", "username", "role"],
        },
      ],
      order: [["resultDate", "DESC"]],
    });

    res.json({ results });
  } catch (error) {
    console.error("Error fetching investigation results:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Review investigation
// @route   PUT /api/medical-officer/investigations/:id/review
// @access  Private (Medical Staff)
export const reviewInvestigation = async (req, res) => {
  try {
    const { id } = req.params;

    const investigation = await Investigation.findByPk(id);

    if (!investigation) {
      return res.status(404).json({ message: "Investigation not found" });
    }

    await investigation.update({
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
    });

    // Audit log
    await logPatientCare({
      userId: req.user.id,
      action: "INVESTIGATION_REVIEW",
      patientId: investigation.patientId,
      description: `Reviewed investigation: ${investigation.testName}`,
      req,
    });

    res.json({
      message: "Investigation reviewed successfully",
      investigation,
    });
  } catch (error) {
    console.error("Error reviewing investigation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get critical investigation results
// @route   GET /api/medical-officer/investigations/critical
// @access  Private (Medical Staff)
export const getCriticalInvestigations = async (req, res) => {
  try {
    const { limit = 20, hours = 48 } = req.query;

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const investigations = await Investigation.findAll({
      where: {
        isCritical: true,
        resultedDate: {
          [Op.gte]: since,
        },
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: ["id", "firstName", "lastName", "patientId"],
        },
        {
          model: InvestigationResult,
          as: "results",
          where: { isCritical: true },
        },
      ],
      limit: parseInt(limit),
      order: [["resultedDate", "DESC"]],
    });

    res.json({ investigations });
  } catch (error) {
    console.error("Error fetching critical investigations:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
