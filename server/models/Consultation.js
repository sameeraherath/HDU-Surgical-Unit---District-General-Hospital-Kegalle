// server/models/Consultation.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Consultation = sequelize.define(
  "Consultation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Patient requiring consultation",
    },
    requestedById: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Medical staff requesting consultation",
    },
    consultantId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Consultant assigned to provide consultation",
    },
    consultationType: {
      type: DataTypes.ENUM(
        "SURGICAL",
        "MEDICAL",
        "CARDIOLOGY",
        "NEUROLOGY",
        "ORTHOPEDICS",
        "PSYCHIATRY",
        "RADIOLOGY",
        "ANESTHESIOLOGY",
        "ICU",
        "OTHER"
      ),
      allowNull: false,
      comment: "Type/specialty of consultation",
    },
    urgency: {
      type: DataTypes.ENUM("ROUTINE", "URGENT", "EMERGENCY"),
      allowNull: false,
      defaultValue: "ROUTINE",
    },
    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "ASSIGNED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED"
      ),
      allowNull: false,
      defaultValue: "PENDING",
    },
    requestReason: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Reason for consultation request",
    },
    clinicalQuestion: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Specific clinical question to be addressed",
    },
    relevantHistory: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Relevant patient history",
    },
    investigations: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Relevant investigations already done",
    },
    requestedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "Date and time consultation was requested",
    },
    assignedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Date consultation was assigned to consultant",
    },
    consultationDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Date consultation was performed",
    },
    completedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Date consultation was completed",
    },
    consultantFindings: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Consultant's clinical findings",
    },
    consultantOpinion: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Consultant's expert opinion",
    },
    recommendations: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Consultant's recommendations",
    },
    followUpRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Whether follow-up consultation is needed",
    },
    followUpDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "Date for follow-up consultation",
    },
    followUpNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Notes for follow-up",
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Supporting documents or images",
      defaultValue: [],
    },
    cancelledReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Reason if consultation was cancelled",
    },
    notifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "When requesting doctor was notified of completion",
    },
  },
  {
    tableName: "consultations",
    timestamps: true,
    indexes: [
      { fields: ["patientId"] },
      { fields: ["requestedById"] },
      { fields: ["consultantId"] },
      { fields: ["status"] },
      { fields: ["urgency"] },
      { fields: ["consultationType"] },
    ],
  }
);

export default Consultation;
