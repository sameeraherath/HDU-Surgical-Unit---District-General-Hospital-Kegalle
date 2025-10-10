import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      references: {
        model: "patients",
        key: "id",
      },
      comment: "Patient related to this task (if applicable)",
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      comment: "User assigned to complete the task",
    },
    assignedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      comment: "User who assigned the task",
    },
    taskType: {
      type: DataTypes.ENUM(
        "PATIENT_REVIEW",
        "VITAL_SIGNS_CHECK",
        "MEDICATION_ADMINISTRATION",
        "INVESTIGATION_ORDER",
        "INVESTIGATION_FOLLOW_UP",
        "DOCUMENTATION",
        "CONSULTATION",
        "PROCEDURE",
        "DISCHARGE_PLANNING",
        "ADMINISTRATIVE",
        "OTHER"
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    priority: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH", "URGENT", "CRITICAL"),
      defaultValue: "MEDIUM",
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
        "DEFERRED",
        "OVERDUE"
      ),
      defaultValue: "PENDING",
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
    },
    dueTime: {
      type: DataTypes.TIME,
    },
    estimatedDuration: {
      type: DataTypes.INTEGER,
      comment: "Estimated duration in minutes",
    },
    startedAt: {
      type: DataTypes.DATE,
    },
    completedAt: {
      type: DataTypes.DATE,
    },
    completionNotes: {
      type: DataTypes.TEXT,
      comment: "Notes added upon completion",
    },
    completedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    cancelledAt: {
      type: DataTypes.DATE,
    },
    cancelledBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    cancellationReason: {
      type: DataTypes.TEXT,
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    recurrencePattern: {
      type: DataTypes.JSON,
      comment: "Pattern for recurring tasks",
    },
    parentTaskId: {
      type: DataTypes.INTEGER,
      references: {
        model: "tasks",
        key: "id",
      },
      comment: "Parent task if this is a subtask",
    },
    relatedTaskIds: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Array of related task IDs",
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    attachments: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Array of attachment URLs",
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    reminderTime: {
      type: DataTypes.DATE,
    },
    escalationLevel: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Number of times task has been escalated",
    },
    escalatedAt: {
      type: DataTypes.DATE,
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
  },
  {
    tableName: "tasks",
    timestamps: true,
    indexes: [
      {
        fields: ["patientId"],
      },
      {
        fields: ["assignedTo"],
      },
      {
        fields: ["assignedBy"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["priority"],
      },
      {
        fields: ["dueDate"],
      },
      {
        fields: ["taskType"],
      },
    ],
  }
);

export default Task;
