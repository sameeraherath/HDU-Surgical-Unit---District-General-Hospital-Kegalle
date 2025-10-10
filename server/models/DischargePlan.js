// server/models/DischargePlan.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const DischargePlan = sequelize.define(
  "DischargePlan",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      comment: "Patient for discharge planning",
    },
    consultantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Consultant preparing discharge plan",
    },
    status: {
      type: DataTypes.ENUM(
        "PLANNED",
        "PENDING_APPROVAL",
        "APPROVED",
        "COMPLETED",
        "CANCELLED"
      ),
      allowNull: false,
      defaultValue: "PLANNED",
    },
    proposedDischargeDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "Proposed date for patient discharge",
    },
    actualDischargeDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "Actual discharge date",
    },
    dischargeDestination: {
      type: DataTypes.ENUM(
        "HOME",
        "TRANSFER_WARD",
        "TRANSFER_HOSPITAL",
        "NURSING_HOME",
        "REHABILITATION_CENTER",
        "DECEASED"
      ),
      allowNull: false,
      defaultValue: "HOME",
    },
    dischargeDiagnosis: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Final diagnosis at discharge",
    },
    dischargeSummary: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Summary of hospital stay and treatment",
    },
    dischargeMedications: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "List of medications to continue at home",
      defaultValue: [],
    },
    followUpInstructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Post-discharge care instructions",
    },
    followUpAppointment: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Details of follow-up appointment (date, clinic, doctor)",
    },
    dietaryInstructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Dietary recommendations",
    },
    activityRestrictions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Activity limitations or restrictions",
    },
    woundCareInstructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Wound care if applicable",
    },
    warningSignsToWatch: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Symptoms requiring immediate medical attention",
    },
    socialSupportNeeded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Whether social services are needed",
    },
    socialWorkerNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Notes from social worker assessment",
    },
    transportationArranged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Whether transportation home is arranged",
    },
    equipmentNeeded: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Medical equipment needed at home",
      defaultValue: [],
    },
    referrals: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Referrals to other specialists or services",
      defaultValue: [],
    },
    dischargeChecklist: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Checklist items completed before discharge",
      defaultValue: {
        vitalSignsStable: false,
        medicationsReconciled: false,
        followUpScheduled: false,
        patientEducationCompleted: false,
        dischargeSummaryProvided: false,
        transportationArranged: false,
      },
    },
    approvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Senior consultant who approved discharge",
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    approvalComments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancelledReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Reason if discharge plan was cancelled",
    },
  },
  {
    tableName: "discharge_plans",
    timestamps: true,
    indexes: [
      { fields: ["patientId"] },
      { fields: ["consultantId"] },
      { fields: ["status"] },
      { fields: ["proposedDischargeDate"] },
    ],
  }
);

export default DischargePlan;
