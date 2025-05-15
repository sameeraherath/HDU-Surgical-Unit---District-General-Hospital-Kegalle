import { DataTypes } from "sequelize";

const defineCriticalFactor = (sequelize) => {
  const CriticalFactor = sequelize.define(
    "CriticalFactor",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "patients", // Referencing the 'patients' table (lowercase)
          key: "id",
        },
        onDelete: "CASCADE",
      },
      recordedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      heartRate: {
        // 60–100 bpm
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      respiratoryRate: {
        // 12–20 breaths/min
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bloodPressureSystolic: {
        // 90-120 mmHg
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bloodPressureDiastolic: {
        // 60-80 mmHg
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      spO2: {
        // 95–100%
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      temperature: {
        // 36.1–37.2 °C
        type: DataTypes.DECIMAL(4, 1), // e.g., 37.2
        allowNull: true,
      },
      glasgowComaScale: {
        // 13–15 (normal)
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      painScale: {
        // 0–10
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bloodGlucose: {
        // 70–140 mg/dL
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      urineOutput: {
        // ≥0.5 mL/kg/hr - Storing the direct value for now
        type: DataTypes.DECIMAL(6, 2), // Assuming mL/hr, can be adjusted
        allowNull: true,
      },
      recordedBy: {
        type: DataTypes.INTEGER,
        allowNull: true, // Or false if always required
        references: {
          model: "users", // Assumes a 'users' table
          key: "id",
        },
        onDelete: "SET NULL",
      },
      // Add any other relevant fields here
    },
    {
      timestamps: true, // createdAt and updatedAt
      tableName: "critical_factors",
    }
  );

  return CriticalFactor;
};

export default defineCriticalFactor;
