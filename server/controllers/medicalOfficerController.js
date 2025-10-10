import {
  Patient,
  ProgressNote,
  Investigation,
  Prescription,
  Task,
  FluidBalance,
  UserMySQLModel,
  sequelize,
} from "../config/mysqlDB.js";
import { Op } from "sequelize";

// @desc    Get Medical Officer dashboard overview
// @route   GET /api/medical-officer/dashboard
// @access  Private (Medical Officer)
export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get active patients count
    const activePatientsCount = await Patient.count({
      where: { status: "ADMITTED" },
    });

    // Get today's tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTasks = await Task.count({
      where: {
        assignedTo: userId,
        dueDate: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
        status: {
          [Op.in]: ["PENDING", "IN_PROGRESS"],
        },
      },
    });

    // Get overdue tasks
    const overdueTasks = await Task.count({
      where: {
        assignedTo: userId,
        dueDate: { [Op.lt]: today },
        status: {
          [Op.in]: ["PENDING", "IN_PROGRESS"],
        },
      },
    });

    // Get pending investigations
    const pendingInvestigations = await Investigation.count({
      where: {
        orderedBy: userId,
        status: {
          [Op.in]: ["ORDERED", "SPECIMEN_COLLECTED", "IN_PROGRESS"],
        },
      },
    });

    // Get critical investigations
    const criticalInvestigations = await Investigation.count({
      where: {
        isCritical: true,
        status: "RESULTED",
        resultedDate: {
          [Op.gte]: new Date(Date.now() - 48 * 60 * 60 * 1000),
        },
      },
    });

    // Get active prescriptions (needing attention)
    const activePrescriptions = await Prescription.count({
      where: {
        prescribedBy: userId,
        status: "ACTIVE",
        startDate: { [Op.lte]: new Date() },
        endDate: { [Op.gte]: new Date() },
      },
    });

    // Get recent progress notes (today)
    const todayNotes = await ProgressNote.count({
      where: {
        userId,
        createdAt: {
          [Op.gte]: today,
        },
      },
    });

    // Get patients requiring attention (simplified approach)
    const patientsNeedingAttention = await Patient.findAll({
      where: {
        status: "ADMITTED",
      },
      limit: 10,
      order: [["admissionDate", "DESC"]],
    });

    res.json({
      success: true,
      data: {
        overview: {
          activePatientsCount,
          todayTasks,
          overdueTasks,
          pendingInvestigations,
          criticalInvestigations,
          activePrescriptions,
          todayNotes,
        },
        patientsNeedingAttention: patientsNeedingAttention.length,
        recentPatients: patientsNeedingAttention.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get workload statistics
// @route   GET /api/medical-officer/statistics/workload
// @access  Private (Medical Officer)
export const getWorkloadStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = "week" } = req.query;

    let startDate;
    const endDate = new Date();

    switch (period) {
      case "day":
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }

    // Progress notes created
    const progressNotes = await ProgressNote.count({
      where: {
        userId,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    // Investigations ordered
    const investigationsOrdered = await Investigation.count({
      where: {
        orderedBy: userId,
        orderDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    // Prescriptions written
    const prescriptionsWritten = await Prescription.count({
      where: {
        prescribedBy: userId,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    // Tasks completed
    const tasksCompleted = await Task.count({
      where: {
        assignedTo: userId,
        status: "COMPLETED",
        completedAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    // Tasks assigned
    const tasksAssigned = await Task.count({
      where: {
        assignedBy: userId,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    res.json({
      success: true,
      data: {
        period,
        statistics: {
          progressNotes,
          investigationsOrdered,
          prescriptionsWritten,
          tasksCompleted,
          tasksAssigned,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching workload statistics:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get patient summary for Medical Officer
// @route   GET /api/medical-officer/patients/:patientId/summary
// @access  Private (Medical Officer)
export const getPatientSummary = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findByPk(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Get latest progress note
    const latestNote = await ProgressNote.findOne({
      where: { patientId: parseInt(patientId) },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: UserMySQLModel,
          as: "author",
          attributes: ["id", "username", "role"],
        },
      ],
    });

    // Get pending investigations
    const pendingInvestigations = await Investigation.findAll({
      where: {
        patientId: parseInt(patientId),
        status: {
          [Op.in]: ["ORDERED", "SPECIMEN_COLLECTED", "IN_PROGRESS"],
        },
      },
      limit: 5,
      order: [["orderDate", "DESC"]],
    });

    // Get critical investigations
    const criticalInvestigations = await Investigation.findAll({
      where: {
        patientId: parseInt(patientId),
        isCritical: true,
        status: "RESULTED",
        resultedDate: {
          [Op.gte]: new Date(Date.now() - 48 * 60 * 60 * 1000),
        },
      },
      limit: 5,
      order: [["resultedDate", "DESC"]],
    });

    // Get active prescriptions
    const activePrescriptions = await Prescription.findAll({
      where: {
        patientId: parseInt(patientId),
        status: "ACTIVE",
      },
      limit: 10,
      order: [["startDate", "DESC"]],
    });

    // Get pending tasks
    const pendingTasks = await Task.findAll({
      where: {
        patientId: parseInt(patientId),
        status: {
          [Op.in]: ["PENDING", "IN_PROGRESS"],
        },
      },
      include: [
        {
          model: UserMySQLModel,
          as: "assignee",
          attributes: ["id", "username", "role"],
        },
      ],
      limit: 5,
      order: [["dueDate", "ASC"]],
    });

    // Get 24h fluid balance
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const inputSum = await FluidBalance.sum("volume", {
      where: {
        patientId: parseInt(patientId),
        recordType: "INPUT",
        recordedAt: { [Op.gte]: twentyFourHoursAgo },
      },
    });

    const outputSum = await FluidBalance.sum("volume", {
      where: {
        patientId: parseInt(patientId),
        recordType: "OUTPUT",
        recordedAt: { [Op.gte]: twentyFourHoursAgo },
      },
    });

    const fluidBalance24h = (inputSum || 0) - (outputSum || 0);

    res.json({
      success: true,
      data: {
        patient,
        summary: {
          latestNote,
          pendingInvestigationsCount: pendingInvestigations.length,
          pendingInvestigations: pendingInvestigations.slice(0, 3),
          criticalInvestigationsCount: criticalInvestigations.length,
          criticalInvestigations: criticalInvestigations.slice(0, 3),
          activePrescriptionsCount: activePrescriptions.length,
          activePrescriptions: activePrescriptions.slice(0, 5),
          pendingTasksCount: pendingTasks.length,
          pendingTasks: pendingTasks.slice(0, 3),
          fluidBalance24h: {
            input: inputSum || 0,
            output: outputSum || 0,
            balance: fluidBalance24h,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching patient summary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get patients list for Medical Officer
// @route   GET /api/medical-officer/patients
// @access  Private (Medical Officer)
export const getMyPatients = async (req, res) => {
  try {
    const { status = "ADMITTED", limit = 20, page = 1 } = req.query;

    const where = {};
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    const { count, rows: patients } = await Patient.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["admissionDate", "DESC"]],
      include: [
        {
          model: Task,
          as: "tasks",
          where: {
            status: { [Op.in]: ["PENDING", "IN_PROGRESS"] },
          },
          required: false,
          limit: 1,
          order: [["dueDate", "ASC"]],
        },
      ],
    });

    res.json({
      success: true,
      data: {
        patients,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
