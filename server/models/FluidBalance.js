import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysqlDB.js";

const FluidBalance = sequelize.define(
  "FluidBalance",
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
    recordedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    recordType: {
      type: DataTypes.ENUM("INPUT", "OUTPUT"),
      allowNull: false,
    },
    // Input details
    inputType: {
      type: DataTypes.ENUM(
        "ORAL",
        "IV_FLUIDS",
        "BLOOD_PRODUCTS",
        "TPN",
        "ENTERAL_FEEDING",
        "MEDICATION",
        "OTHER"
      ),
      comment: "Type of fluid input",
    },
    inputRoute: {
      type: DataTypes.ENUM(
        "ORAL",
        "IV",
        "NG_TUBE",
        "PEG",
        "CENTRAL_LINE",
        "OTHER"
      ),
    },
    // Output details
    outputType: {
      type: DataTypes.ENUM(
        "URINE",
        "STOOL",
        "VOMIT",
        "DRAIN",
        "WOUND",
        "NG_ASPIRATE",
        "PERSPIRATION",
        "INSENSIBLE_LOSS",
        "BLOOD_LOSS",
        "OTHER"
      ),
      comment: "Type of fluid output",
    },
    // Volume
    volume: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Volume in ml",
    },
    unit: {
      type: DataTypes.STRING(20),
      defaultValue: "ml",
    },
    // Fluid details
    fluidType: {
      type: DataTypes.STRING(200),
      comment: "Specific fluid name (e.g., Normal Saline, Orange Juice, etc.)",
    },
    fluidDescription: {
      type: DataTypes.TEXT,
      comment: "Additional description of the fluid",
    },
    // For IV fluids
    ivFluidType: {
      type: DataTypes.STRING(200),
      comment: "Type of IV fluid (NS, RL, D5W, etc.)",
    },
    ivRate: {
      type: DataTypes.DECIMAL(10, 2),
      comment: "IV rate in ml/hr",
    },
    ivStartTime: {
      type: DataTypes.DATE,
    },
    ivEndTime: {
      type: DataTypes.DATE,
    },
    // Characteristics
    color: {
      type: DataTypes.STRING(100),
      comment: "Color of output (for urine, drainage, etc.)",
    },
    consistency: {
      type: DataTypes.STRING(100),
      comment: "Consistency of output",
    },
    odor: {
      type: DataTypes.STRING(100),
    },
    // Timing
    recordedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    shiftTime: {
      type: DataTypes.ENUM("MORNING", "AFTERNOON", "EVENING", "NIGHT"),
      comment: "Shift during which recorded",
    },
    // Cumulative tracking
    cumulativeInput24h: {
      type: DataTypes.DECIMAL(10, 2),
      comment: "Cumulative input in last 24 hours",
    },
    cumulativeOutput24h: {
      type: DataTypes.DECIMAL(10, 2),
      comment: "Cumulative output in last 24 hours",
    },
    balance24h: {
      type: DataTypes.DECIMAL(10, 2),
      comment: "Net fluid balance in last 24 hours",
    },
    // Additional info
    notes: {
      type: DataTypes.TEXT,
    },
    isEstimated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Whether volume is estimated",
    },
    isAbnormal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verifiedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    verifiedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "fluid_balance",
    timestamps: true,
    indexes: [
      {
        fields: ["patientId"],
      },
      {
        fields: ["recordType"],
      },
      {
        fields: ["recordedAt"],
      },
      {
        fields: ["recordedBy"],
      },
    ],
  }
);

export default FluidBalance;
