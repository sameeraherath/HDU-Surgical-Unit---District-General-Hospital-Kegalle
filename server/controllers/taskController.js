import { Task, Patient, UserMySQLModel } from "../config/mysqlDB.js";
import { Op } from "sequelize";
import { logAdministrative } from "../services/auditService.js";

// @desc    Create a new task
// @route   POST /api/medical-officer/tasks
// @access  Private (Medical Staff)
export const createTask = async (req, res) => {
  try {
    const {
      patientId,
      assignedTo,
      taskType,
      title,
      description,
      priority,
      dueDate,
      dueTime,
      estimatedDuration,
      isRecurring,
      recurrencePattern,
      tags,
    } = req.body;

    // Verify patient exists if patientId provided
    if (patientId) {
      const patient = await Patient.findByPk(patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
    }

    // Verify assignee exists
    const assignee = await UserMySQLModel.findByPk(assignedTo);
    if (!assignee) {
      return res.status(404).json({ message: "Assignee not found" });
    }

    const task = await Task.create({
      patientId: patientId || null,
      assignedTo,
      assignedBy: req.user.id,
      taskType,
      title,
      description,
      priority: priority || "MEDIUM",
      status: "PENDING",
      dueDate,
      dueTime,
      estimatedDuration,
      isRecurring: isRecurring || false,
      recurrencePattern: recurrencePattern || null,
      tags: tags || [],
    });

    // Audit log
    await logAdministrative({
      userId: req.user.id,
      action: "TASK_CREATE",
      description: `Created task: ${title} for ${assignee.username}`,
      severity:
        priority === "CRITICAL" || priority === "URGENT" ? "HIGH" : "MEDIUM",
      newValues: task.toJSON(),
      req,
    });

    // Send notification to assignee
    const io = req.app.get("io");
    if (io) {
      io.to(`user_${assignedTo}`).emit("task-assigned", {
        task,
        assigner: {
          id: req.user.id,
          username: req.user.username,
          role: req.user.role,
        },
      });
    }

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get tasks assigned to current user
// @route   GET /api/medical-officer/tasks/my-tasks
// @access  Private
export const getMyTasks = async (req, res) => {
  try {
    const { status, priority, taskType, limit = 50, page = 1 } = req.query;

    const where = { assignedTo: req.user.id };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (taskType) where.taskType = taskType;

    const offset = (page - 1) * limit;

    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: ["id", "firstName", "lastName", "patientId"],
        },
        {
          model: UserMySQLModel,
          as: "assigner",
          attributes: ["id", "username", "role"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ["priority", "DESC"],
        ["dueDate", "ASC"],
      ],
    });

    res.json({
      tasks,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching my tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get tasks for a patient
// @route   GET /api/medical-officer/tasks/patient/:patientId
// @access  Private (Medical Staff)
export const getTasksByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status, limit = 50, page = 1 } = req.query;

    const where = { patientId: parseInt(patientId) };
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      include: [
        {
          model: UserMySQLModel,
          as: "assignee",
          attributes: ["id", "username", "role"],
        },
        {
          model: UserMySQLModel,
          as: "assigner",
          attributes: ["id", "username", "role"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.json({
      tasks,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching patient tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get tasks created by current user
// @route   GET /api/medical-officer/tasks/created-by-me
// @access  Private
export const getTasksCreatedByMe = async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    const where = { assignedBy: req.user.id };
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: ["id", "firstName", "lastName", "patientId"],
        },
        {
          model: UserMySQLModel,
          as: "assignee",
          attributes: ["id", "username", "role"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.json({
      tasks,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching created tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/medical-officer/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, completionNotes } = req.body;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user is assigned to the task or is the assigner
    if (
      task.assignedTo !== req.user.id &&
      task.assignedBy !== req.user.id &&
      req.user.role !== "Consultant"
    ) {
      return res.status(403).json({
        message: "Access denied. Only assignee or assigner can update status.",
      });
    }

    const updateData = { status };

    if (status === "IN_PROGRESS" && !task.startedAt) {
      updateData.startedAt = new Date();
    }

    if (status === "COMPLETED") {
      updateData.completedAt = new Date();
      updateData.completedBy = req.user.id;
      if (completionNotes) updateData.completionNotes = completionNotes;
    }

    const oldStatus = task.status;
    await task.update(updateData);

    // Audit log
    await logAdministrative({
      userId: req.user.id,
      action: "TASK_STATUS_UPDATE",
      description: `Updated task status from ${oldStatus} to ${status}`,
      severity: "LOW",
      oldValues: { status: oldStatus },
      newValues: { status },
      req,
    });

    // Send notification to assigner if completed
    if (status === "COMPLETED") {
      const io = req.app.get("io");
      if (io) {
        io.to(`user_${task.assignedBy}`).emit("task-completed", {
          task,
          completedBy: {
            id: req.user.id,
            username: req.user.username,
            role: req.user.role,
          },
        });
      }
    }

    res.json({
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/medical-officer/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user is the assigner or a consultant
    if (task.assignedBy !== req.user.id && req.user.role !== "Consultant") {
      return res.status(403).json({
        message: "Access denied. Only the assigner or consultant can update.",
      });
    }

    const oldValues = task.toJSON();
    await task.update(updateData);

    // Audit log
    await logAdministrative({
      userId: req.user.id,
      action: "TASK_UPDATE",
      description: `Updated task: ${task.title}`,
      severity: "LOW",
      oldValues,
      newValues: task.toJSON(),
      req,
    });

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Cancel a task
// @route   PUT /api/medical-officer/tasks/:id/cancel
// @access  Private
export const cancelTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user is the assigner or a consultant
    if (task.assignedBy !== req.user.id && req.user.role !== "Consultant") {
      return res.status(403).json({
        message: "Access denied. Only the assigner or consultant can cancel.",
      });
    }

    await task.update({
      status: "CANCELLED",
      cancelledAt: new Date(),
      cancelledBy: req.user.id,
      cancellationReason,
    });

    // Audit log
    await logAdministrative({
      userId: req.user.id,
      action: "TASK_CANCEL",
      description: `Cancelled task: ${task.title}`,
      severity: "LOW",
      req,
    });

    // Send notification to assignee
    const io = req.app.get("io");
    if (io) {
      io.to(`user_${task.assignedTo}`).emit("task-cancelled", { task });
    }

    res.json({
      message: "Task cancelled successfully",
      task,
    });
  } catch (error) {
    console.error("Error cancelling task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/medical-officer/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user is the assigner or a consultant
    if (task.assignedBy !== req.user.id && req.user.role !== "Consultant") {
      return res.status(403).json({
        message: "Access denied. Only the assigner or consultant can delete.",
      });
    }

    // Audit log before deletion
    await logAdministrative({
      userId: req.user.id,
      action: "TASK_DELETE",
      description: `Deleted task: ${task.title}`,
      severity: "MEDIUM",
      oldValues: task.toJSON(),
      req,
    });

    await task.destroy();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get overdue tasks
// @route   GET /api/medical-officer/tasks/overdue
// @access  Private
export const getOverdueTasks = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: tasks } = await Task.findAndCountAll({
      where: {
        status: {
          [Op.in]: ["PENDING", "IN_PROGRESS"],
        },
        dueDate: {
          [Op.lt]: new Date(),
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
          as: "assignee",
          attributes: ["id", "username", "role"],
        },
        {
          model: UserMySQLModel,
          as: "assigner",
          attributes: ["id", "username", "role"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["dueDate", "ASC"]],
    });

    res.json({
      tasks,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching overdue tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get task statistics
// @route   GET /api/medical-officer/tasks/statistics
// @access  Private
export const getTaskStatistics = async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;

    const totalTasks = await Task.count({
      where: { assignedTo: userId },
    });

    const pendingTasks = await Task.count({
      where: { assignedTo: userId, status: "PENDING" },
    });

    const inProgressTasks = await Task.count({
      where: { assignedTo: userId, status: "IN_PROGRESS" },
    });

    const completedTasks = await Task.count({
      where: { assignedTo: userId, status: "COMPLETED" },
    });

    const overdueTasks = await Task.count({
      where: {
        assignedTo: userId,
        status: { [Op.in]: ["PENDING", "IN_PROGRESS"] },
        dueDate: { [Op.lt]: new Date() },
      },
    });

    const urgentTasks = await Task.count({
      where: {
        assignedTo: userId,
        status: { [Op.in]: ["PENDING", "IN_PROGRESS"] },
        priority: { [Op.in]: ["URGENT", "CRITICAL"] },
      },
    });

    res.json({
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
      urgentTasks,
    });
  } catch (error) {
    console.error("Error fetching task statistics:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
