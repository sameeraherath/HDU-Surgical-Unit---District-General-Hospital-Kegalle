import { getAuditLogs, getAuditStatistics } from "../services/auditService.js";
import { AuditLog, UserMySQLModel } from "../config/mysqlDB.js";
import { Op } from "sequelize";

// @desc    Get audit logs
// @route   GET /api/audit/logs
// @access  Private (Admin/Consultant)
export const getAuditLogsController = async (req, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      userId: req.query.userId,
      action: req.query.action,
      actionCategory: req.query.actionCategory,
      patientId: req.query.patientId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      severity: req.query.severity,
      success: req.query.success,
    };

    const result = await getAuditLogs(filters);

    res.json(result);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get audit log by ID
// @route   GET /api/audit/logs/:id
// @access  Private (Admin/Consultant)
export const getAuditLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const auditLog = await AuditLog.findByPk(id, {
      include: [
        {
          model: UserMySQLModel,
          as: "user",
          attributes: ["id", "username", "email", "role"],
        },
      ],
    });

    if (!auditLog) {
      return res.status(404).json({ message: "Audit log not found" });
    }

    res.json({ auditLog });
  } catch (error) {
    console.error("Error fetching audit log:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get audit history for a specific record
// @route   GET /api/audit/history/:tableName/:recordId
// @access  Private
export const getAuditHistory = async (req, res) => {
  try {
    const { tableName, recordId } = req.params;

    const auditLogs = await AuditLog.findAll({
      where: {
        tableName,
        recordId,
      },
      include: [
        {
          model: UserMySQLModel,
          as: "user",
          attributes: ["id", "username", "role"],
        },
      ],
      order: [["timestamp", "DESC"]],
    });

    if (!auditLogs || auditLogs.length === 0) {
      return res.status(404).json({ message: "No audit history found" });
    }

    res.json({ auditLogs, count: auditLogs.length });
  } catch (error) {
    console.error("Error fetching audit history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get audit statistics
// @route   GET /api/audit/statistics
// @access  Private (Admin/Consultant)
export const getAuditStatisticsController = async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      userId: req.query.userId,
      patientId: req.query.patientId,
    };

    const statistics = await getAuditStatistics(filters);

    res.json(statistics);
  } catch (error) {
    console.error("Error fetching audit statistics:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get user activity timeline
// @route   GET /api/audit/user/:userId/timeline
// @access  Private (Admin/Consultant or Self)
export const getUserActivityTimeline = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, page = 1 } = req.query;

    // Check if user can access this timeline
    if (
      req.user.id !== parseInt(userId) &&
      !["Consultant", "Admin"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const offset = (page - 1) * limit;

    const { count, rows: activities } = await AuditLog.findAndCountAll({
      where: { userId: parseInt(userId) },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["timestamp", "DESC"]],
    });

    res.json({
      activities,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching user activity timeline:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get patient activity timeline
// @route   GET /api/audit/patient/:patientId/timeline
// @access  Private (Medical Staff)
export const getPatientActivityTimeline = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { limit = 50, page = 1 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: activities } = await AuditLog.findAndCountAll({
      where: { patientId: parseInt(patientId) },
      include: [
        {
          model: UserMySQLModel,
          as: "user",
          attributes: ["id", "username", "role"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["timestamp", "DESC"]],
    });

    res.json({
      activities,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching patient activity timeline:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get recent critical events
// @route   GET /api/audit/critical-events
// @access  Private (Admin/Consultant)
export const getCriticalEvents = async (req, res) => {
  try {
    const { limit = 20, hours = 24 } = req.query;

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const criticalEvents = await AuditLog.findAll({
      where: {
        severity: {
          [Op.in]: ["HIGH", "CRITICAL"],
        },
        timestamp: {
          [Op.gte]: since,
        },
      },
      include: [
        {
          model: UserMySQLModel,
          as: "user",
          attributes: ["id", "username", "role"],
        },
      ],
      limit: parseInt(limit),
      order: [["timestamp", "DESC"]],
    });

    res.json({ criticalEvents, count: criticalEvents.length });
  } catch (error) {
    console.error("Error fetching critical events:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get failed actions
// @route   GET /api/audit/failed-actions
// @access  Private (Admin/Consultant)
export const getFailedActions = async (req, res) => {
  try {
    const { limit = 50, page = 1, hours = 24 } = req.query;

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const offset = (page - 1) * limit;

    const { count, rows: failedActions } = await AuditLog.findAndCountAll({
      where: {
        success: false,
        timestamp: {
          [Op.gte]: since,
        },
      },
      include: [
        {
          model: UserMySQLModel,
          as: "user",
          attributes: ["id", "username", "role"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["timestamp", "DESC"]],
    });

    res.json({
      failedActions,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching failed actions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Export audit logs
// @route   GET /api/audit/export
// @access  Private (Admin/Consultant)
export const exportAuditLogs = async (req, res) => {
  try {
    const { startDate, endDate, format = "json" } = req.query;

    const where = {};
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp[Op.gte] = new Date(startDate);
      if (endDate) where.timestamp[Op.lte] = new Date(endDate);
    }

    const auditLogs = await AuditLog.findAll({
      where,
      include: [
        {
          model: UserMySQLModel,
          as: "user",
          attributes: ["username", "role"],
        },
      ],
      order: [["timestamp", "DESC"]],
    });

    if (format === "csv") {
      // CSV export
      const csv = auditLogs.map((log) => {
        return [
          log.timestamp,
          log.user?.username || "N/A",
          log.action,
          log.actionCategory,
          log.description,
          log.severity,
          log.success,
        ].join(",");
      });

      const csvContent =
        "Timestamp,User,Action,Category,Description,Severity,Success\n" +
        csv.join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=audit-logs-${Date.now()}.csv`
      );
      res.send(csvContent);
    } else {
      // JSON export
      res.json({ auditLogs, count: auditLogs.length });
    }
  } catch (error) {
    console.error("Error exporting audit logs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
