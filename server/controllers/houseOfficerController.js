import {
  Patient,
  ProgressNote,
  Investigation,
  Prescription,
  Task,
  FluidBalance,
  UserMySQLModel,
  Admission,
  sequelize,
} from "../config/mysqlDB.js";
import { Op } from "sequelize";

// @desc    Get House Officer dashboard overview
// @route   GET /api/house-officer/dashboard
// @access  Private (House Officer)
export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get active patients count (all patients, not just assigned to this user)
    const activePatientsCount = await Patient.count({
      include: [
        {
          model: Admission,
          as: "admissions",
          where: {
            status: "Active",
          },
          required: true,
        },
      ],
    });

    // Get today's assigned tasks
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

    // Get completed tasks this week
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const completedTasksThisWeek = await Task.count({
      where: {
        assignedTo: userId,
        status: "COMPLETED",
        completedAt: {
          [Op.gte]: weekAgo,
        },
      },
    });

    // Get patients with pending tasks assigned to this house officer
    const patientsWithPendingTasks = await Patient.findAll({
      include: [
        {
          model: Admission,
          as: "admissions",
          where: {
            status: "Active",
          },
          required: true,
        },
        {
          model: Task,
          as: "tasks",
          where: {
            assignedTo: userId,
            status: {
              [Op.in]: ["PENDING", "IN_PROGRESS"],
            },
          },
          required: true,
        },
      ],
      limit: 10,
      order: [["createdAt", "DESC"]],
    });

    // Get recent progress notes (read-only access)
    const recentProgressNotes = await ProgressNote.findAll({
      where: {
        patientId: {
          [Op.in]: patientsWithPendingTasks.map(p => p.id),
        },
      },
      include: [
        {
          model: UserMySQLModel,
          as: "author",
          attributes: ["id", "username", "role", "nameWithInitials"],
        },
        {
          model: Patient,
          as: "patient",
          attributes: ["id", "patientNumber", "fullName"],
        },
      ],
      limit: 5,
      order: [["createdAt", "DESC"]],
    });

    // Get critical investigations (read-only)
    const criticalInvestigations = await Investigation.findAll({
      where: {
        isCritical: true,
        status: "RESULTED",
        resultedDate: {
          [Op.gte]: new Date(Date.now() - 48 * 60 * 60 * 1000),
        },
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: ["id", "patientNumber", "fullName"],
        },
        {
          model: UserMySQLModel,
          as: "orderedByUser",
          attributes: ["id", "username", "role", "nameWithInitials"],
        },
      ],
      limit: 5,
      order: [["resultedDate", "DESC"]],
    });

    res.json({
      success: true,
      data: {
        overview: {
          activePatientsCount,
          todayTasks,
          overdueTasks,
          completedTasksThisWeek,
          patientsWithPendingTasksCount: patientsWithPendingTasks.length,
        },
        patientsWithPendingTasks: patientsWithPendingTasks.slice(0, 5),
        recentProgressNotes,
        criticalInvestigations,
      },
    });
  } catch (error) {
    console.error("Error fetching house officer dashboard overview:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard overview",
      error: error.message,
    });
  }
};

// @desc    Get assigned tasks for House Officer
// @route   GET /api/house-officer/tasks
// @access  Private (House Officer)
export const getAssignedTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, priority, limit = 20, page = 1 } = req.query;

    const where = {
      assignedTo: userId,
    };

    if (status) {
      where.status = status;
    } else {
      // Default to pending and in-progress tasks
      where.status = {
        [Op.in]: ["PENDING", "IN_PROGRESS"],
      };
    }

    if (priority) {
      where.priority = priority;
    }

    const offset = (page - 1) * limit;

    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: ["id", "patientId", "firstName", "lastName", "bedNumber"],
        },
        {
          model: UserMySQLModel,
          as: "assignee",
          attributes: ["id", "username", "role", "nameWithInitials"],
        },
        {
          model: UserMySQLModel,
          as: "assigner",
          attributes: ["id", "username", "role", "nameWithInitials"],
        },
      ],
      order: [["dueDate", "ASC"]],
    });

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch assigned tasks",
      error: error.message,
    });
  }
};

// @desc    Update task status (House Officer can complete tasks)
// @route   PUT /api/house-officer/tasks/:taskId
// @access  Private (House Officer)
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const { status, notes } = req.body;

    // Find the task and verify it's assigned to this house officer
    const task = await Task.findOne({
      where: {
        id: taskId,
        assignedTo: userId,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or not assigned to you",
      });
    }

    // Update task status
    const updateData = { status };
    
    if (status === "COMPLETED") {
      updateData.completedAt = new Date();
      updateData.completedBy = userId;
    }

    if (notes) {
      updateData.completionNotes = notes;
    }

    await task.update(updateData);

    // Fetch updated task with relations
    const updatedTask = await Task.findByPk(taskId, {
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: ["id", "patientId", "firstName", "lastName", "bedNumber"],
        },
        {
          model: UserMySQLModel,
          as: "assignee",
          attributes: ["id", "username", "role", "nameWithInitials"],
        },
        {
          model: UserMySQLModel,
          as: "assigner",
          attributes: ["id", "username", "role", "nameWithInitials"],
        },
      ],
    });

    res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task status",
      error: error.message,
    });
  }
};

// @desc    Get patient details for House Officer (read-only)
// @route   GET /api/house-officer/patients/:patientId
// @access  Private (House Officer)
export const getPatientDetails = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findByPk(patientId, {
      include: [
        {
          model: Admission,
          as: "admissions",
          where: {
            status: "Active",
          },
          required: false,
        },
        {
          model: Task,
          as: "tasks",
          where: {
            assignedTo: req.user.id,
          },
          required: false,
          include: [
            {
              model: UserMySQLModel,
              as: "assigner",
              attributes: ["id", "username", "role", "nameWithInitials"],
            },
          ],
        },
        {
          model: ProgressNote,
          as: "progressNotes",
          limit: 10,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: UserMySQLModel,
              as: "author",
              attributes: ["id", "username", "role", "nameWithInitials"],
            },
          ],
        },
        {
          model: Investigation,
          as: "investigations",
          limit: 10,
          order: [["orderDate", "DESC"]],
          include: [
            {
              model: UserMySQLModel,
              as: "orderedByUser",
              attributes: ["id", "username", "role", "nameWithInitials"],
            },
          ],
        },
        {
          model: Prescription,
          as: "prescriptions",
          where: {
            status: "ACTIVE",
          },
          required: false,
          limit: 10,
          order: [["startDate", "DESC"]],
          include: [
            {
              model: UserMySQLModel,
              as: "prescribedByUser",
              attributes: ["id", "username", "role", "nameWithInitials"],
            },
          ],
        },
      ],
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

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
        fluidBalance24h: {
          input: inputSum || 0,
          output: outputSum || 0,
          balance: fluidBalance24h,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching patient details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient details",
      error: error.message,
    });
  }
};

// @desc    Get patients list for House Officer (read-only)
// @route   GET /api/house-officer/patients
// @access  Private (House Officer)
export const getPatientsList = async (req, res) => {
  try {
    const { status = "Active", limit = 20, page = 1 } = req.query;

    const where = {};
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    const { count, rows: patients } = await Patient.findAndCountAll({
      include: [
        {
          model: Admission,
          as: "admissions",
          where: {
            status: status,
          },
          required: true,
        },
        {
          model: Task,
          as: "tasks",
          where: {
            assignedTo: req.user.id,
            status: {
              [Op.in]: ["PENDING", "IN_PROGRESS"],
            },
          },
          required: false,
          limit: 1,
          order: [["dueDate", "ASC"]],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
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
    console.error("Error fetching patients list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patients list",
      error: error.message,
    });
  }
};

// @desc    Get task statistics for House Officer
// @route   GET /api/house-officer/statistics/tasks
// @access  Private (House Officer)
export const getTaskStatistics = async (req, res) => {
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
        assignedTo: userId,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    // Overdue tasks
    const overdueTasks = await Task.count({
      where: {
        assignedTo: userId,
        dueDate: { [Op.lt]: new Date() },
        status: {
          [Op.in]: ["PENDING", "IN_PROGRESS"],
        },
      },
    });

    // Tasks by priority
    const tasksByPriority = await Task.findAll({
      where: {
        assignedTo: userId,
        status: {
          [Op.in]: ["PENDING", "IN_PROGRESS"],
        },
      },
      attributes: [
        "priority",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["priority"],
    });

    res.json({
      success: true,
      data: {
        period,
        statistics: {
          tasksCompleted,
          tasksAssigned,
          overdueTasks,
          tasksByPriority: tasksByPriority.reduce((acc, item) => {
            acc[item.priority] = parseInt(item.dataValues.count);
            return acc;
          }, {}),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching task statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch task statistics",
      error: error.message,
    });
  }
};
