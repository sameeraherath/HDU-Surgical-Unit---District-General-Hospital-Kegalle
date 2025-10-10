// server/models/ClinicalAudit.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const ClinicalAudit = sequelize.define(
  "ClinicalAudit",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    consultantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Consultant conducting the audit",
    },
    auditType: {
      type: DataTypes.ENUM(
        "MORTALITY_REVIEW",
        "MORBIDITY_REVIEW",
        "SURGICAL_OUTCOMES",
        "READMISSION_REVIEW",
        "COMPLICATION_REVIEW",
        "DRUG_CHART_AUDIT",
        "DOCUMENTATION_AUDIT",
        "INFECTION_CONTROL",
        "COMPLIANCE_AUDIT",
        "OTHER"
      ),
      allowNull: false,
      comment: "Type of clinical audit",
    },
    auditTitle: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "Title of the audit",
    },
    auditPeriod: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: "Date range for audit (startDate, endDate)",
    },
    objectives: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Objectives of the audit",
    },
    methodology: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Audit methodology and criteria",
    },
    standardsCriteria: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Standards or criteria being audited against",
    },
    casesReviewed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Number of cases reviewed",
    },
    patientIds: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "List of patient IDs included in audit",
      defaultValue: [],
    },
    findings: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Key findings from the audit",
    },
    dataAnalysis: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Analysis of collected data",
    },
    complianceRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: "Compliance rate percentage",
    },
    areasOfExcellence: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Areas where standards were exceeded",
    },
    areasForImprovement: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Areas requiring improvement",
    },
    recommendations: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Recommendations for improvement",
    },
    actionPlan: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Action items with responsible persons and deadlines",
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM(
        "PLANNING",
        "DATA_COLLECTION",
        "ANALYSIS",
        "COMPLETED",
        "PRESENTED"
      ),
      allowNull: false,
      defaultValue: "PLANNING",
    },
    presentedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Date audit was presented",
    },
    presentationVenue: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Where audit was presented (e.g., M&M meeting)",
    },
    attendees: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Attendees at presentation",
      defaultValue: [],
    },
    followUpAuditRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Whether follow-up audit is planned",
    },
    followUpAuditDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "Planned date for follow-up audit",
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Supporting documents, charts, presentations",
      defaultValue: [],
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Tags for categorization",
      defaultValue: [],
    },
  },
  {
    tableName: "clinical_audits",
    timestamps: true,
    indexes: [
      { fields: ["consultantId"] },
      { fields: ["auditType"] },
      { fields: ["status"] },
    ],
  }
);

export default ClinicalAudit;
