import {
  CriticalFactor,
  Patient,
  UserMySQLModel as User,
  AuditLog,
  sequelize, // Add sequelize to the named imports
} from "../config/mysqlDB.js";

// Utility function to log audit trail
const logAudit = async (
  userId,
  action,
  tableName,
  recordId,
  oldValues,
  newValues,
  description,
  transaction
) => {
  try {
    await AuditLog.create(
      {
        userId,
        action,
        tableName,
        recordId,
        oldValues,
        newValues,
        description,
      },
      { transaction }
    );
  } catch (error) {
    console.error("Audit log failed:", error);
    // Decide if the main operation should fail if audit logging fails
  }
};

// Add critical factors for a patient
export const addCriticalFactors = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { patientId } = req.params;
    const criticalFactorsData = req.body; // Expect an array of factor objects or a single object
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      await t.rollback();
      return res.status(404).json({ message: "Patient not found" });
    }

    const createdFactors = [];

    // Handle both single object and array of objects
    const factorsToCreate = Array.isArray(criticalFactorsData)
      ? criticalFactorsData
      : [criticalFactorsData];

    for (const factorData of factorsToCreate) {
      const newFactor = await CriticalFactor.create(
        {
          ...factorData,
          patientId,
          recordedBy: userId,
          recordedAt: new Date(), // Ensure recordedAt is set
        },
        { transaction: t }
      );
      createdFactors.push(newFactor);

      // Log audit for each new factor
      await logAudit(
        userId,
        "CREATE",
        "CriticalFactors",
        newFactor.id,
        null,
        newFactor.toJSON(),
        `Added critical factors for patient ID: ${patientId}`,
        t
      );
    }

    await t.commit();
    res.status(201).json(createdFactors);
  } catch (error) {
    await t.rollback();
    console.error("Error adding critical factors:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get critical factors for a specific patient
export const getCriticalFactorsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const factors = await CriticalFactor.findAll({
      where: { patientId },
      include: [
        {
          model: User,
          as: "recorder",
          attributes: ["id", "username", "nameWithInitials"],
        },
      ],
      order: [["recordedAt", "DESC"]],
    });

    if (!factors) {
      return res
        .status(404)
        .json({ message: "No critical factors found for this patient" });
    }
    res.json(factors);
  } catch (error) {
    console.error("Error fetching critical factors:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update critical factors
export const updateCriticalFactors = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { criticalFactorId } = req.params;
    const updatedData = req.body;
    const userId = req.user.id;

    const factor = await CriticalFactor.findByPk(criticalFactorId, {
      transaction: t,
    });
    if (!factor) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Critical factor record not found" });
    }

    const oldValues = factor.toJSON();

    // Update only the fields provided in the request body
    await factor.update(updatedData, { transaction: t });

    await logAudit(
      userId,
      "UPDATE",
      "CriticalFactors",
      criticalFactorId,
      oldValues,
      factor.toJSON(), // factor now contains the updated values
      `Updated critical factors for record ID: ${criticalFactorId}`,
      t
    );

    await t.commit();
    res.json(factor);
  } catch (error) {
    await t.rollback();
    console.error("Error updating critical factors:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
