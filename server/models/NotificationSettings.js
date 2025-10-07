import { DataTypes } from "sequelize";

const defineNotificationSettings = (sequelize) => {
  const NotificationSettings = sequelize.define(
    "NotificationSettings",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      // General notification settings
      enableNotifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      enableSound: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      enableDesktopNotifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      enableEmailNotifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      // Category-specific settings
      notifyPatientAdmission: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      notifyPatientDischarge: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      notifyCriticalVitalSigns: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      notifyMedication: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      notifyLabResults: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      notifyConsultation: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      notifyTaskAssignment: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      notifyTaskReminder: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      notifySystemUpdates: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      // Quiet hours
      enableQuietHours: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      quietHoursStart: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: "22:00:00",
      },
      quietHoursEnd: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: "08:00:00",
      },
      // Digest settings
      enableDailyDigest: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      dailyDigestTime: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: "08:00:00",
      },
    },
    {
      timestamps: true,
      tableName: "notification_settings",
      indexes: [
        {
          unique: true,
          fields: ["userId"],
        },
      ],
    }
  );

  return NotificationSettings;
};

export default defineNotificationSettings;
