import { DataTypes } from "sequelize";

const defineUserPreference = (sequelize) => {
  const UserPreference = sequelize.define(
    "UserPreference",
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
      theme: {
        type: DataTypes.ENUM("light", "dark", "auto"),
        defaultValue: "light",
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING(10),
        defaultValue: "en",
        allowNull: false,
      },
      timezone: {
        type: DataTypes.STRING(50),
        defaultValue: "Asia/Colombo",
        allowNull: false,
      },
      dateFormat: {
        type: DataTypes.STRING(20),
        defaultValue: "DD/MM/YYYY",
        allowNull: false,
      },
      timeFormat: {
        type: DataTypes.ENUM("12", "24"),
        defaultValue: "24",
        allowNull: false,
      },
      dashboardLayout: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Custom dashboard widget configuration",
      },
      notificationsEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      emailNotifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      soundEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      autoRefresh: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: "Auto-refresh dashboard data",
      },
      refreshInterval: {
        type: DataTypes.INTEGER,
        defaultValue: 30,
        allowNull: false,
        comment: "Refresh interval in seconds",
      },
    },
    {
      timestamps: true,
      tableName: "user_preferences",
      indexes: [
        {
          unique: true,
          fields: ["userId"],
        },
      ],
    }
  );

  return UserPreference;
};

export default defineUserPreference;
