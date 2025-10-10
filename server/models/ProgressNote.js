import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const ProgressNote = sequelize.define(
  "ProgressNote",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "patients",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    noteType: {
      type: DataTypes.ENUM(
        "ADMISSION",
        "PROGRESS",
        "WARD_ROUND",
        "CONSULTATION",
        "DISCHARGE",
        "EMERGENCY",
        "PROCEDURE",
        "HANDOVER"
      ),
      defaultValue: "PROGRESS",
      allowNull: false,
    },
    // SOAP Format
    subjective: {
      type: DataTypes.TEXT,
      comment: "Patient's complaints and symptoms",
    },
    objective: {
      type: DataTypes.TEXT,
      comment: "Clinical findings and vital signs",
    },
    assessment: {
      type: DataTypes.TEXT,
      comment: "Clinical assessment and diagnosis",
    },
    plan: {
      type: DataTypes.TEXT,
      comment: "Treatment plan and next steps",
    },
    // Additional fields
    chiefComplaint: {
      type: DataTypes.STRING(500),
    },
    clinicalFindings: {
      type: DataTypes.TEXT,
    },
    diagnosis: {
      type: DataTypes.STRING(500),
    },
    treatmentPlan: {
      type: DataTypes.TEXT,
    },
    followUpInstructions: {
      type: DataTypes.TEXT,
    },
    // Metadata
    isTemplate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Whether this is a template note",
    },
    templateName: {
      type: DataTypes.STRING(100),
    },
    priority: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH", "URGENT"),
      defaultValue: "MEDIUM",
    },
    status: {
      type: DataTypes.ENUM("DRAFT", "COMPLETED", "REVIEWED", "AMENDED"),
      defaultValue: "COMPLETED",
    },
    reviewedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      comment: "Consultant who reviewed the note",
    },
    reviewedAt: {
      type: DataTypes.DATE,
    },
    reviewComments: {
      type: DataTypes.TEXT,
    },
    attachments: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Array of attachment URLs",
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Tags for categorization",
    },
    isConfidential: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "progress_notes",
    timestamps: true,
    indexes: [
      {
        fields: ["patientId"],
      },
      {
        fields: ["userId"],
      },
      {
        fields: ["noteType"],
      },
      {
        fields: ["createdAt"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["priority"],
      },
    ],
  }
);

export default ProgressNote;
