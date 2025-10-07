import { AuditLog, UserMySQLModel } from "../config/mysqlDB.js";

/**
 * Create an audit log entry
 * @param {Object} auditData - Audit log data
 * @returns {Promise<AuditLog>}
 */
export const createAuditLog = async (auditData) => {
  try {
    const {
      userId,
      userRole,
      userName,
      action,
      actionCategory,
      tableName,
      recordId,
      patientId,
      oldValues,
      newValues,
      changedFields,
      description,
      ipAddress,
      userAgent,
      endpoint,
      method,
      statusCode,
      duration,
      severity = "LOW",
      success = true,
      errorMessage,
      metadata,
    } = auditData;

    const auditLog = await AuditLog.create({
      timestamp: new Date(),
      userId,
      userRole,
      userName,
      action,
      actionCategory,
      tableName,
      recordId,
      patientId,
      oldValues,
      newValues,
      changedFields,
      description,
      ipAddress,
      userAgent,
      endpoint,
      method,
      statusCode,
      duration,
      severity,
      success,
      errorMessage,
      metadata,
    });

    return auditLog;
  } catch (error) {
    console.error("Error creating audit log:", error);
    // Don't throw error to prevent audit logging from breaking the main flow
    return null;
  }
};

/**
 * Log authentication events
 */
export const logAuthentication = async (req, action, success, errorMessage = null) => {
  const severity = success ? "LOW" : action === "LOGIN_FAILED" ? "MEDIUM" : "LOW";
  
  return createAuditLog({
    userId: req.user?.id || null,
    userRole: req.user?.role || null,
    userName: req.body?.username || req.user?.username || null,
    action,
    actionCategory: "AUTHENTICATION",
    description: success
      ? `User ${action.toLowerCase()} successfully`
      : `User ${action.toLowerCase()} failed: ${errorMessage}`,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get("user-agent"),
    endpoint: req.originalUrl,
    method: req.method,
    statusCode: success ? 200 : 401,
    severity,
    success,
    errorMessage,
  });
};

/**
 * Log patient care events
 */
export const logPatientCare = async (req, action, patientId, recordId, description, oldValues = null, newValues = null) => {
  const changedFields = oldValues && newValues
    ? Object.keys(newValues).filter(key => JSON.stringify(oldValues[key]) !== JSON.stringify(newValues[key]))
    : null;

  return createAuditLog({
    userId: req.user?.id,
    userRole: req.user?.role,
    userName: req.user?.username,
    action,
    actionCategory: "PATIENT_CARE",
    recordId,
    patientId,
    oldValues,
    newValues,
    changedFields,
    description,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get("user-agent"),
    endpoint: req.originalUrl,
    method: req.method,
    severity: "MEDIUM",
    success: true,
  });
};

/**
 * Log vital signs events
 */
export const logVitalSigns = async (req, action, patientId, recordId, oldValues = null, newValues = null) => {
  const changedFields = oldValues && newValues
    ? Object.keys(newValues).filter(key => JSON.stringify(oldValues[key]) !== JSON.stringify(newValues[key]))
    : null;

  const description = action === "VITAL_SIGNS_RECORD"
    ? `Vital signs recorded for patient ${patientId}`
    : `Vital signs updated for patient ${patientId}`;

  // Check for critical changes
  const isCritical = newValues && (
    newValues.bloodPressureSystolic > 180 ||
    newValues.bloodPressureSystolic < 90 ||
    newValues.heartRate > 120 ||
    newValues.heartRate < 50 ||
    newValues.respiratoryRate > 30 ||
    newValues.respiratoryRate < 10 ||
    newValues.oxygenSaturation < 90
  );

  return createAuditLog({
    userId: req.user?.id,
    userRole: req.user?.role,
    userName: req.user?.username,
    action,
    actionCategory: "VITAL_SIGNS",
    tableName: "critical_factors",
    recordId,
    patientId,
    oldValues,
    newValues,
    changedFields,
    description,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get("user-agent"),
    endpoint: req.originalUrl,
    method: req.method,
    severity: isCritical ? "HIGH" : "MEDIUM",
    success: true,
  });
};

/**
 * Log medication events
 */
export const logMedication = async (req, action, patientId, medicationData, description) => {
  return createAuditLog({
    userId: req.user?.id,
    userRole: req.user?.role,
    userName: req.user?.username,
    action,
    actionCategory: "MEDICATION",
    patientId,
    newValues: medicationData,
    description,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get("user-agent"),
    endpoint: req.originalUrl,
    method: req.method,
    severity: "HIGH",
    success: true,
  });
};

/**
 * Log documentation events
 */
export const logDocumentation = async (req, action, patientId, documentData, description) => {
  return createAuditLog({
    userId: req.user?.id,
    userRole: req.user?.role,
    userName: req.user?.username,
    action,
    actionCategory: "DOCUMENTATION",
    tableName: "patient_documents",
    recordId: documentData.id,
    patientId,
    newValues: documentData,
    description,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get("user-agent"),
    endpoint: req.originalUrl,
    method: req.method,
    severity: "MEDIUM",
    success: true,
  });
};

/**
 * Log administrative actions
 */
export const logAdministrative = async (req, action, description, severity = "MEDIUM", oldValues = null, newValues = null) => {
  const changedFields = oldValues && newValues
    ? Object.keys(newValues).filter(key => JSON.stringify(oldValues[key]) !== JSON.stringify(newValues[key]))
    : null;

  return createAuditLog({
    userId: req.user?.id,
    userRole: req.user?.role,
    userName: req.user?.username,
    action,
    actionCategory: "ADMINISTRATION",
    oldValues,
    newValues,
    changedFields,
    description,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get("user-agent"),
    endpoint: req.originalUrl,
    method: req.method,
    severity,
    success: true,
  });
};

/**
 * Log security events
 */
export const logSecurity = async (req, action, description, severity = "HIGH", success = true, errorMessage = null) => {
  return createAuditLog({
    userId: req.user?.id || null,
    userRole: req.user?.role || null,
    userName: req.user?.username || null,
    action,
    actionCategory: "SECURITY",
    description,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get("user-agent"),
    endpoint: req.originalUrl,
    method: req.method,
    severity,
    success,
    errorMessage,
  });
};

/**
 * Log system events
 */
export const logSystem = async (action, description, severity = "LOW", metadata = null) => {
  return createAuditLog({
    action,
    actionCategory: "SYSTEM",
    description,
    severity,
    success: true,
    metadata,
  });
};

/**
 * Get audit logs with filters
 */
export const getAuditLogs = async (filters = {}) => {
  const {
    page = 1,
    limit = 50,
    userId,
    action,
    actionCategory,
    patientId,
    startDate,
    endDate,
    severity,
    success,
  } = filters;

  const offset = (page - 1) * limit;
  const where = {};

  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (actionCategory) where.actionCategory = actionCategory;
  if (patientId) where.patientId = patientId;
  if (severity) where.severity = severity;
  if (success !== undefined) where.success = success;

  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) where.timestamp.$gte = new Date(startDate);
    if (endDate) where.timestamp.$lte = new Date(endDate);
  }

  const { count, rows } = await AuditLog.findAndCountAll({
    where,
    include: [
      {
        model: UserMySQLModel,
        as: "user",
        attributes: ["id", "username", "email", "role"],
      },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["timestamp", "DESC"]],
  });

  return {
    auditLogs: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
    },
  };
};

/**
 * Get audit statistics
 */
export const getAuditStatistics = async (filters = {}) => {
  const { startDate, endDate, userId, patientId } = filters;
  const where = {};

  if (userId) where.userId = userId;
  if (patientId) where.patientId = patientId;

  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) where.timestamp.$gte = new Date(startDate);
    if (endDate) where.timestamp.$lte = new Date(endDate);
  }

  const [totalLogs, byCategory, bySeverity, failedActions, recentActions] = await Promise.all([
    AuditLog.count({ where }),
    AuditLog.findAll({
      where,
      attributes: [
        "actionCategory",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["actionCategory"],
      raw: true,
    }),
    AuditLog.findAll({
      where,
      attributes: [
        "severity",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["severity"],
      raw: true,
    }),
    AuditLog.count({ where: { ...where, success: false } }),
    AuditLog.findAll({
      where,
      limit: 10,
      order: [["timestamp", "DESC"]],
      include: [
        {
          model: UserMySQLModel,
          as: "user",
          attributes: ["username", "role"],
        },
      ],
    }),
  ]);

  return {
    totalLogs,
    byCategory,
    bySeverity,
    failedActions,
    recentActions,
  };
};

export default {
  createAuditLog,
  logAuthentication,
  logPatientCare,
  logVitalSigns,
  logMedication,
  logDocumentation,
  logAdministrative,
  logSecurity,
  logSystem,
  getAuditLogs,
  getAuditStatistics,
};
