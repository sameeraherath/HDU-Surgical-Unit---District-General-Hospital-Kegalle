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
        allowNull: true, // Allow null if action can be system-generated
        references: {
          model: "users", // Reference the actual 'users' table name
          key: "id",
        },
        onDelete: "SET NULL",
      },
      action: {
        type: DataTypes.STRING, // E.g., 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'
        allowNull: false,
      },
      tableName: {
        type: DataTypes.STRING, // E.g., 'CriticalFactors', 'Patients', 'User'
        allowNull: true,
      },
      recordId: {
        type: DataTypes.INTEGER, // ID of the affected record in tableName
        allowNull: true,
      },
      oldValues: {
        type: DataTypes.JSON, // Store previous state of the record (for UPDATE)
        allowNull: true,
      },
      newValues: {
        type: DataTypes.JSON, // Store new state of the record (for CREATE/UPDATE)
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT, // Human-readable description of the event
        allowNull: true,
      },
    },
    {
      timestamps: false, // 'timestamp' field serves this purpose
      tableName: "audit_logs",
    }
  );

  return AuditLog;
};

export default defineAuditLog;
