import {
  FluidBalance,
  Patient,
  UserMySQLModel,
  sequelize,
} from "../config/mysqlDB.js";
import { Op } from "sequelize";
import { logPatientCare } from "../services/auditService.js";

// @desc    Record fluid balance entry
// @route   POST /api/medical-officer/fluid-balance
// @access  Private (Medical Staff)
export const recordFluidBalance = async (req, res) => {
  try {
    const {
      patientId,
      recordType,
      inputType,
      inputRoute,
      outputType,
      volume,
      fluidType,
      fluidDescription,
      ivFluidType,
      ivRate,
      ivStartTime,
      ivEndTime,
      color,
      consistency,
      odor,
      recordedAt,
      shiftTime,
      notes,
      isEstimated,
      isAbnormal,
    } = req.body;

    // Verify patient exists
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Validate record type specific fields
    if (recordType === "INPUT" && !inputType) {
      return res
        .status(400)
        .json({ message: "Input type is required for INPUT records" });
    }

    if (recordType === "OUTPUT" && !outputType) {
      return res
        .status(400)
        .json({ message: "Output type is required for OUTPUT records" });
    }

    const fluidBalance = await FluidBalance.create({
      patientId,
      recordedBy: req.user.id,
      recordType,
      inputType: recordType === "INPUT" ? inputType : null,
      inputRoute: recordType === "INPUT" ? inputRoute : null,
      outputType: recordType === "OUTPUT" ? outputType : null,
      volume,
      unit: "ml",
      fluidType,
      fluidDescription,
      ivFluidType,
      ivRate,
      ivStartTime,
      ivEndTime,
      color,
      consistency,
      odor,
      recordedAt: recordedAt || new Date(),
      shiftTime,
      notes,
      isEstimated: isEstimated || false,
      isAbnormal: isAbnormal || false,
    });

    // Calculate 24-hour cumulative
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const inputSum = await FluidBalance.sum("volume", {
      where: {
        patientId,
        recordType: "INPUT",
        recordedAt: { [Op.gte]: twentyFourHoursAgo },
      },
    });

    const outputSum = await FluidBalance.sum("volume", {
      where: {
        patientId,
        recordType: "OUTPUT",
        recordedAt: { [Op.gte]: twentyFourHoursAgo },
      },
    });

    const balance = (inputSum || 0) - (outputSum || 0);

    // Update cumulative fields
    await fluidBalance.update({
      cumulativeInput24h: inputSum || 0,
      cumulativeOutput24h: outputSum || 0,
      balance24h: balance,
    });

    // Audit log
    await logPatientCare({
      userId: req.user.id,
      action: "FLUID_BALANCE_RECORD",
      patientId,
      description: `Recorded ${recordType} - ${volume}ml`,
      newValues: fluidBalance.toJSON(),
      req,
    });

    // Send notification if abnormal or balance is concerning
    if (isAbnormal || Math.abs(balance) > 1000) {
      const io = req.app.get("io");
      if (io) {
        io.to(`patient_${patientId}`).emit("fluid-balance-alert", {
          fluidBalance,
          cumulativeBalance: balance,
        });
      }
    }

    res.status(201).json({
      message: "Fluid balance recorded successfully",
      fluidBalance,
      cumulativeInput24h: inputSum || 0,
      cumulativeOutput24h: outputSum || 0,
      balance24h: balance,
    });
  } catch (error) {
    console.error("Error recording fluid balance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get fluid balance records for a patient
// @route   GET /api/medical-officer/fluid-balance/:patientId
// @access  Private (Medical Staff)
export const getFluidBalanceByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const {
      recordType,
      startDate,
      endDate,
      shiftTime,
      limit = 100,
      page = 1,
    } = req.query;

    const where = { patientId: parseInt(patientId) };
    if (recordType) where.recordType = recordType;
    if (shiftTime) where.shiftTime = shiftTime;

    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) where.recordedAt[Op.gte] = new Date(startDate);
      if (endDate) where.recordedAt[Op.lte] = new Date(endDate);
    }

    const offset = (page - 1) * limit;

    const { count, rows: records } = await FluidBalance.findAndCountAll({
      where,
      include: [
        {
          model: UserMySQLModel,
          as: "recorder",
          attributes: ["id", "username", "role"],
        },
        {
          model: UserMySQLModel,
          as: "verifier",
          attributes: ["id", "username", "role"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["recordedAt", "DESC"]],
    });

    res.json({
      records,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching fluid balance records:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get fluid balance summary for a patient
// @route   GET /api/medical-officer/fluid-balance/:patientId/summary
// @access  Private (Medical Staff)
export const getFluidBalanceSummary = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { hours = 24 } = req.query;

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const inputSum = await FluidBalance.sum("volume", {
      where: {
        patientId: parseInt(patientId),
        recordType: "INPUT",
        recordedAt: { [Op.gte]: since },
      },
    });

    const outputSum = await FluidBalance.sum("volume", {
      where: {
        patientId: parseInt(patientId),
        recordType: "OUTPUT",
        recordedAt: { [Op.gte]: since },
      },
    });

    const balance = (inputSum || 0) - (outputSum || 0);

    // Get breakdown by type
    const inputByType = await FluidBalance.findAll({
      attributes: [
        "inputType",
        [sequelize.fn("SUM", sequelize.col("volume")), "totalVolume"],
      ],
      where: {
        patientId: parseInt(patientId),
        recordType: "INPUT",
        recordedAt: { [Op.gte]: since },
      },
      group: ["inputType"],
    });

    const outputByType = await FluidBalance.findAll({
      attributes: [
        "outputType",
        [sequelize.fn("SUM", sequelize.col("volume")), "totalVolume"],
      ],
      where: {
        patientId: parseInt(patientId),
        recordType: "OUTPUT",
        recordedAt: { [Op.gte]: since },
      },
      group: ["outputType"],
    });

    res.json({
      period: `${hours} hours`,
      totalInput: inputSum || 0,
      totalOutput: outputSum || 0,
      balance,
      inputByType,
      outputByType,
    });
  } catch (error) {
    console.error("Error fetching fluid balance summary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get fluid balance chart data
// @route   GET /api/medical-officer/fluid-balance/:patientId/chart
// @access  Private (Medical Staff)
export const getFluidBalanceChartData = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { hours = 24, interval = 4 } = req.query;

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const intervalMs = interval * 60 * 60 * 1000;

    const records = await FluidBalance.findAll({
      where: {
        patientId: parseInt(patientId),
        recordedAt: { [Op.gte]: since },
      },
      order: [["recordedAt", "ASC"]],
    });

    // Group by intervals
    const chartData = [];
    const now = Date.now();
    const startTime = since.getTime();

    for (let i = startTime; i <= now; i += intervalMs) {
      const intervalStart = new Date(i);
      const intervalEnd = new Date(i + intervalMs);

      const intervalRecords = records.filter((r) => {
        const recordTime = new Date(r.recordedAt).getTime();
        return recordTime >= i && recordTime < i + intervalMs;
      });

      const input = intervalRecords
        .filter((r) => r.recordType === "INPUT")
        .reduce((sum, r) => sum + parseFloat(r.volume), 0);

      const output = intervalRecords
        .filter((r) => r.recordType === "OUTPUT")
        .reduce((sum, r) => sum + parseFloat(r.volume), 0);

      chartData.push({
        time: intervalStart,
        input,
        output,
        balance: input - output,
      });
    }

    res.json({ chartData });
  } catch (error) {
    console.error("Error fetching fluid balance chart data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update fluid balance record
// @route   PUT /api/medical-officer/fluid-balance/:id
// @access  Private (Medical Staff - Recorder only)
export const updateFluidBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const record = await FluidBalance.findByPk(id);

    if (!record) {
      return res
        .status(404)
        .json({ message: "Fluid balance record not found" });
    }

    // Check if user is the recorder
    if (record.recordedBy !== req.user.id && req.user.role !== "Consultant") {
      return res.status(403).json({
        message: "Access denied. Only the recorder or consultant can update.",
      });
    }

    const oldValues = record.toJSON();
    await record.update(updateData);

    // Audit log
    await logPatientCare({
      userId: req.user.id,
      action: "FLUID_BALANCE_UPDATE",
      patientId: record.patientId,
      description: `Updated fluid balance record`,
      oldValues,
      newValues: record.toJSON(),
      req,
    });

    res.json({
      message: "Fluid balance record updated successfully",
      record,
    });
  } catch (error) {
    console.error("Error updating fluid balance record:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Verify fluid balance record
// @route   PUT /api/medical-officer/fluid-balance/:id/verify
// @access  Private (Medical Staff)
export const verifyFluidBalance = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await FluidBalance.findByPk(id);

    if (!record) {
      return res
        .status(404)
        .json({ message: "Fluid balance record not found" });
    }

    await record.update({
      verifiedBy: req.user.id,
      verifiedAt: new Date(),
    });

    // Audit log
    await logPatientCare({
      userId: req.user.id,
      action: "FLUID_BALANCE_VERIFY",
      patientId: record.patientId,
      description: `Verified fluid balance record`,
      req,
    });

    res.json({
      message: "Fluid balance record verified successfully",
      record,
    });
  } catch (error) {
    console.error("Error verifying fluid balance record:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete fluid balance record
// @route   DELETE /api/medical-officer/fluid-balance/:id
// @access  Private (Medical Staff - Recorder or Consultant)
export const deleteFluidBalance = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await FluidBalance.findByPk(id);

    if (!record) {
      return res
        .status(404)
        .json({ message: "Fluid balance record not found" });
    }

    // Check if user is the recorder or a consultant
    if (record.recordedBy !== req.user.id && req.user.role !== "Consultant") {
      return res.status(403).json({
        message: "Access denied. Only the recorder or consultant can delete.",
      });
    }

    // Audit log before deletion
    await logPatientCare({
      userId: req.user.id,
      action: "FLUID_BALANCE_DELETE",
      patientId: record.patientId,
      description: `Deleted fluid balance record`,
      oldValues: record.toJSON(),
      req,
    });

    await record.destroy();

    res.json({ message: "Fluid balance record deleted successfully" });
  } catch (error) {
    console.error("Error deleting fluid balance record:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
