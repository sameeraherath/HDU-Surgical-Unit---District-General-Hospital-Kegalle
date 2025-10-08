// server/models/WardRound.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const WardRound = sequelize.define(
  "WardRound",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Patient being reviewed in ward round",
    },
    consultantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Consultant conducting ward round",
    },
    roundDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "Date of ward round",
    },
    roundTime: {
      type: DataTypes.TIME,
      allowNull: false,
      comment: "Time of ward round",
    },
    chiefComplaint: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Patient's main complaint",
    },
    clinicalFindings: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Physical examination findings",
    },
    assessment: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Clinical assessment and diagnosis",
    },
    managementPlan: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Treatment and management plan",
    },
    investigationsOrdered: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Investigations ordered during round",
    },
    followUpPlan: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Follow-up instructions",
    },
    teachingPoints: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Teaching points discussed with team",
    },
    attendees: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "List of medical staff present (IDs and roles)",
      defaultValue: [],
    },
    patientStatus: {
      type: DataTypes.ENUM(
        "STABLE",
        "IMPROVING",
        "DETERIORATING",
        "CRITICAL",
        "FOR_DISCHARGE"
      ),
      allowNull: false,
      defaultValue: "STABLE",
    },
    dischargeDiscussed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Whether discharge was discussed",
    },
    estimatedDischargeDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "Estimated date of discharge if discussed",
    },
    reviewedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Senior consultant who reviewed the round notes",
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reviewComments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "ward_rounds",
    timestamps: true,
    indexes: [
      { fields: ["patientId"] },
      { fields: ["consultantId"] },
      { fields: ["roundDate"] },
      { fields: ["patientStatus"] },
    ],
  }
);

module.exports = WardRound;
