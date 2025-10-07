import { DataTypes } from "sequelize";

const defineNotification = (sequelize) => {
  const Notification = sequelize.define(
    "Notification",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      type: {
        type: DataTypes.ENUM(
          "info",
          "success",
          "warning",
          "error",
          "critical",
          "task",
          "reminder",
          "system"
        ),
        allowNull: false,
        defaultValue: "info",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM(
          "patient",
          "vital_signs",
          "medication",
          "lab_results",
          "consultation",
          "discharge",
          "admission",
          "system",
          "task",
          "general"
        ),
        allowNull: false,
        defaultValue: "general",
      },
      priority: {
        type: DataTypes.ENUM("low", "medium", "high", "urgent"),
        allowNull: false,
        defaultValue: "medium",
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      actionUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "URL to navigate when notification is clicked",
      },
      actionType: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Type of action: navigate, modal, external",
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Additional data: patientId, taskId, etc.",
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Notification expiration time",
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      sentViaEmail: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      emailSentAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "notifications",
      indexes: [
        {
          fields: ["userId"],
        },
        {
          fields: ["userId", "isRead"],
        },
        {
          fields: ["userId", "isArchived"],
        },
        {
          fields: ["type"],
        },
        {
          fields: ["category"],
        },
        {
          fields: ["priority"],
        },
        {
          fields: ["createdAt"],
        },
      ],
    }
  );

  return Notification;
};

export default defineNotification;
