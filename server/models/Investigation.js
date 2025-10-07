import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysqlDB.js";

const Investigation = sequelize.define(
  "Investigation",
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
    orderedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      comment: "User who ordered the investigation",
    },
    investigationType: {
      type: DataTypes.ENUM("LABORATORY", "IMAGING", "PATHOLOGY", "PROCEDURE", "OTHER"),
      allowNull: false,
    },
    investigationCategory: {
      type: DataTypes.STRING(100),
      comment: "e.g., Hematology, Biochemistry, Radiology, etc.",
    },
    testName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "Name of the test/investigation",
    },
    testCode: {
      type: DataTypes.STRING(50),
      comment: "Standard test code (LOINC, CPT, etc.)",
    },
    urgency: {
      type: DataTypes.ENUM("ROUTINE", "URGENT", "STAT", "ASAP"),
      defaultValue: "ROUTINE",
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH", "CRITICAL"),
      defaultValue: "MEDIUM",
    },
    clinicalIndication: {
      type: DataTypes.TEXT,
      comment: "Reason for ordering the test",
    },
    specialInstructions: {
      type: DataTypes.TEXT,
      comment: "Special instructions for the test",
    },
    specimenType: {
      type: DataTypes.STRING(100),
      comment: "e.g., Blood, Urine, CSF, Tissue, etc.",
    },
    specimenCollectedAt: {
      type: DataTypes.DATE,
    },
    specimenCollectedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM(
        "ORDERED",
        "SPECIMEN_COLLECTED",
        "IN_PROGRESS",
        "COMPLETED",
        "RESULTED",
        "CANCELLED",
        "PENDING_REVIEW"
      ),
      defaultValue: "ORDERED",
      allowNull: false,
    },
    orderDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    scheduledDate: {
      type: DataTypes.DATE,
      comment: "Scheduled date for imaging/procedure",
    },
    completedDate: {
      type: DataTypes.DATE,
    },
    resultedDate: {
      type: DataTypes.DATE,
    },
    reportedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      comment: "Lab technician/radiologist who reported",
    },
    reviewedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      comment: "Clinician who reviewed the results",
    },
    reviewedAt: {
      type: DataTypes.DATE,
    },
    externalLabId: {
      type: DataTypes.STRING(100),
      comment: "External lab reference ID",
    },
    externalLabName: {
      type: DataTypes.STRING(200),
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    isCritical: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Whether results are critical",
    },
    criticalNotifiedAt: {
      type: DataTypes.DATE,
    },
    notes: {
      type: DataTypes.TEXT,
      comment: "Additional notes",
    },
    cancellationReason: {
      type: DataTypes.TEXT,
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {},
      comment: "Additional metadata",
    },
  },
  {
    tableName: "investigations",
    timestamps: true,
    indexes: [
      {
        fields: ["patientId"],
      },
      {
        fields: ["orderedBy"],
      },
      {
        fields: ["investigationType"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["urgency"],
      },
      {
        fields: ["orderDate"],
      },
      {
        fields: ["isCritical"],
      },
    ],
  }
);

export default Investigation;
