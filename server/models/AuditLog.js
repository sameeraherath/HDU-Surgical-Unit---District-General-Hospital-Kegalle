import { DataTypes } from "sequelize";

const defineAuditLog = (sequelize) => {
  const AuditLog = sequelize.define(
    "AuditLog",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      userRole: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "User role at time of action",
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Username at time of action (for deleted users)",
      },
      action: {
        type: DataTypes.ENUM(
          "CREATE",
          "READ",
          "UPDATE",
          "DELETE",
          "LOGIN",
          "LOGOUT",
          "LOGIN_FAILED",
          "PASSWORD_CHANGE",
          "PROFILE_UPDATE",
          "ADMISSION",
          "DISCHARGE",
          "VITAL_SIGNS_RECORD",
          "VITAL_SIGNS_UPDATE",
          "MEDICATION_ADMIN",
          "DOCUMENT_UPLOAD",
          "DOCUMENT_DELETE",
          "PATIENT_UPDATE",
          "BED_ASSIGNMENT",
          "NOTIFICATION_SEND",
          "SETTINGS_CHANGE",
          "SYSTEM"
        ),
        allowNull: false,
      },
      actionCategory: {
        type: DataTypes.ENUM(
          "AUTHENTICATION",
          "PATIENT_CARE",
          "VITAL_SIGNS",
          "MEDICATION",
          "DOCUMENTATION",
          "ADMINISTRATION",
          "SYSTEM",
          "SECURITY"
        ),
        allowNull: false,
        defaultValue: "SYSTEM",
      },
      tableName: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Database table affected",
      },
      recordId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID of the affected record",
      },
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Patient ID if action involves a patient",
      },
      oldValues: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Previous values before change",
      },
      newValues: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "New values after change",
      },
      changedFields: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Array of field names that changed",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Human-readable description",
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: "IP address of the user",
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Browser/client user agent",
      },
      endpoint: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "API endpoint called",
      },
      method: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: "HTTP method (GET, POST, PUT, DELETE)",
      },
      statusCode: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "HTTP status code",
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Request duration in milliseconds",
      },
      severity: {
        type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH", "CRITICAL"),
        allowNull: false,
        defaultValue: "LOW",
      },
      success: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Error message if action failed",
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Additional contextual data",
      },
    },
    {
      timestamps: false,
      tableName: "audit_logs",
      indexes: [
        { fields: ["userId"] },
        { fields: ["timestamp"] },
        { fields: ["action"] },
        { fields: ["actionCategory"] },
        { fields: ["patientId"] },
        { fields: ["tableName"] },
        { fields: ["severity"] },
        { fields: ["success"] },
        { fields: ["timestamp", "userId"] },
        { fields: ["timestamp", "action"] },
      ],
    }
  );

  return AuditLog;
};

export default defineAuditLog;
