import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Prescription = sequelize.define(
  "Prescription",
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
    prescribedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    // Medication details
    medicationName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    genericName: {
      type: DataTypes.STRING(200),
    },
    brandName: {
      type: DataTypes.STRING(200),
    },
    medicationType: {
      type: DataTypes.ENUM(
        "TABLET",
        "CAPSULE",
        "SYRUP",
        "INJECTION",
        "OINTMENT",
        "DROPS",
        "INHALER",
        "PATCH",
        "OTHER"
      ),
      defaultValue: "TABLET",
    },
    // Dosage
    dosage: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "e.g., 500mg, 10ml, 2 puffs",
    },
    dosageValue: {
      type: DataTypes.DECIMAL(10, 2),
    },
    dosageUnit: {
      type: DataTypes.STRING(50),
      comment: "mg, ml, mcg, etc.",
    },
    // Frequency
    frequency: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "e.g., TDS, BD, QID, PRN",
    },
    frequencyCode: {
      type: DataTypes.ENUM(
        "OD",
        "BD",
        "TDS",
        "QID",
        "Q4H",
        "Q6H",
        "Q8H",
        "Q12H",
        "STAT",
        "PRN",
        "WEEKLY",
        "MONTHLY",
        "OTHER"
      ),
    },
    timesPerDay: {
      type: DataTypes.INTEGER,
      comment: "Number of times per day",
    },
    // Route
    route: {
      type: DataTypes.ENUM(
        "ORAL",
        "IV",
        "IM",
        "SC",
        "TOPICAL",
        "RECTAL",
        "INHALATION",
        "SUBLINGUAL",
        "OPHTHALMIC",
        "OTIC",
        "NASAL",
        "OTHER"
      ),
      defaultValue: "ORAL",
      allowNull: false,
    },
    // Duration
    duration: {
      type: DataTypes.STRING(100),
      comment: "e.g., 7 days, 2 weeks, 1 month",
    },
    durationValue: {
      type: DataTypes.INTEGER,
    },
    durationUnit: {
      type: DataTypes.ENUM("DAYS", "WEEKS", "MONTHS", "CONTINUOUS"),
    },
    // Timing
    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    administrationTimes: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: "Specific times for administration",
    },
    // Instructions
    instructions: {
      type: DataTypes.TEXT,
      comment: "Special instructions for patient",
    },
    foodRelation: {
      type: DataTypes.ENUM(
        "BEFORE_FOOD",
        "AFTER_FOOD",
        "WITH_FOOD",
        "EMPTY_STOMACH",
        "ANY_TIME"
      ),
    },
    // Quantity
    quantity: {
      type: DataTypes.INTEGER,
      comment: "Total quantity prescribed",
    },
    refillsAllowed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    refillsRemaining: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Clinical info
    indication: {
      type: DataTypes.STRING(500),
      comment: "Reason for prescription",
    },
    // Status
    status: {
      type: DataTypes.ENUM(
        "ACTIVE",
        "COMPLETED",
        "DISCONTINUED",
        "ON_HOLD",
        "CANCELLED",
        "REPLACED"
      ),
      defaultValue: "ACTIVE",
      allowNull: false,
    },
    discontinuedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    discontinuedAt: {
      type: DataTypes.DATE,
    },
    discontinuationReason: {
      type: DataTypes.TEXT,
    },
    // Safety
    isControlled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Controlled substance flag",
    },
    isNarcotic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    requiresMonitoring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Verification
    verifiedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      comment: "Pharmacist who verified",
    },
    verifiedAt: {
      type: DataTypes.DATE,
    },
    dispensedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    dispensedAt: {
      type: DataTypes.DATE,
    },
    // Notes
    pharmacistNotes: {
      type: DataTypes.TEXT,
    },
    clinicianNotes: {
      type: DataTypes.TEXT,
    },
    // Metadata
    priority: {
      type: DataTypes.ENUM("ROUTINE", "URGENT", "STAT"),
      defaultValue: "ROUTINE",
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
    },
  },
  {
    tableName: "prescriptions",
    timestamps: true,
    indexes: [
      {
        fields: ["patientId"],
      },
      {
        fields: ["prescribedBy"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["startDate"],
      },
      {
        fields: ["endDate"],
      },
      {
        fields: ["medicationName"],
      },
    ],
  }
);

export default Prescription;
