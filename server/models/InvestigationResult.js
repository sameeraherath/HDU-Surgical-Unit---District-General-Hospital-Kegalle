import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysqlDB.js";

const InvestigationResult = sequelize.define(
  "InvestigationResult",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    investigationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "investigations",
        key: "id",
      },
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "patients",
        key: "id",
      },
    },
    resultType: {
      type: DataTypes.ENUM("NUMERIC", "TEXT", "IMAGE", "DOCUMENT", "STRUCTURED"),
      defaultValue: "TEXT",
    },
    // Numeric results
    parameterName: {
      type: DataTypes.STRING(200),
      comment: "Name of the parameter being measured",
    },
    value: {
      type: DataTypes.STRING(100),
      comment: "Result value",
    },
    numericValue: {
      type: DataTypes.DECIMAL(15, 4),
      comment: "Numeric value for calculations",
    },
    unit: {
      type: DataTypes.STRING(50),
      comment: "Unit of measurement",
    },
    referenceRange: {
      type: DataTypes.STRING(100),
      comment: "Normal reference range",
    },
    referenceRangeLow: {
      type: DataTypes.DECIMAL(15, 4),
    },
    referenceRangeHigh: {
      type: DataTypes.DECIMAL(15, 4),
    },
    isAbnormal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    abnormalityType: {
      type: DataTypes.ENUM("NORMAL", "LOW", "HIGH", "CRITICAL_LOW", "CRITICAL_HIGH"),
      defaultValue: "NORMAL",
    },
    // Text results
    textResult: {
      type: DataTypes.TEXT,
      comment: "Textual result or report",
    },
    impression: {
      type: DataTypes.TEXT,
      comment: "Clinical impression from the report",
    },
    recommendations: {
      type: DataTypes.TEXT,
      comment: "Recommendations from the reporting physician",
    },
    // Document/Image results
    reportUrl: {
      type: DataTypes.STRING(500),
      comment: "URL to the report document",
    },
    imageUrls: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Array of image URLs",
    },
    // Structured results (for complex tests)
    structuredData: {
      type: DataTypes.JSON,
      defaultValue: {},
      comment: "Structured test results",
    },
    // Metadata
    resultDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    verifiedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      comment: "Lab professional who verified",
    },
    verifiedAt: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM("PRELIMINARY", "FINAL", "CORRECTED", "AMENDED"),
      defaultValue: "PRELIMINARY",
    },
    isCritical: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    criticalNotificationSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    notes: {
      type: DataTypes.TEXT,
    },
    technicalNotes: {
      type: DataTypes.TEXT,
      comment: "Technical notes from lab",
    },
    methodology: {
      type: DataTypes.STRING(200),
      comment: "Testing methodology used",
    },
  },
  {
    tableName: "investigation_results",
    timestamps: true,
    indexes: [
      {
        fields: ["investigationId"],
      },
      {
        fields: ["patientId"],
      },
      {
        fields: ["parameterName"],
      },
      {
        fields: ["isAbnormal"],
      },
      {
        fields: ["isCritical"],
      },
      {
        fields: ["resultDate"],
      },
      {
        fields: ["status"],
      },
    ],
  }
);

export default InvestigationResult;
