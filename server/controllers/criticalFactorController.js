import {
  CriticalFactor,
  Patient,
  UserMySQLModel as User,
  AuditLog,
  sequelize,
} from "../config/mysqlDB.js";

const getChangedValues = (oldValues, newValues) => {
  const changes = {};
  for (const key in newValues) {
    if (oldValues[key] !== newValues[key]) {
      changes[key] = {
        old: oldValues[key],
        new: newValues[key],
      };
    }
  }
  return changes;
};

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
    const changes =
      action === "CREATE"
        ? { initialValues: newValues }
        : getChangedValues(oldValues, newValues);

    await AuditLog.create(
      {
        userId,
        action,
        tableName,
        recordId,
        oldValues: action === "CREATE" ? null : oldValues,
        newValues: action === "CREATE" ? newValues : changes,
        description,
        timestamp: new Date(),
      },
      { transaction }
    );
  } catch (error) {
    console.error("Audit log failed:", error);
    throw error;
  }
};

export const addCriticalFactors = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { patientId } = req.params;
    const criticalFactorsData = req.body;
    const userId = req.user.id;

    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      await t.rollback();
      return res.status(404).json({ message: "Patient not found" });
    }

    const createdFactors = [];

    const factorsToCreate = Array.isArray(criticalFactorsData)
      ? criticalFactorsData
      : [criticalFactorsData];

    for (const factorData of factorsToCreate) {
      const newFactor = await CriticalFactor.create(
        {
          ...factorData,
          patientId,
          recordedBy: userId,
          recordedAt: new Date(),
        },
        { transaction: t }
      );

      const createdFactor = await CriticalFactor.findByPk(newFactor.id, {
        transaction: t,
      });

      await logAudit(
        userId,
        "CREATE",
        "CriticalFactors",
        newFactor.id,
        null,
        createdFactor.toJSON(),
        `Added critical factors for patient ID: ${patientId}`,
        t
      );

      createdFactors.push(createdFactor);
    }

    await t.commit();
    res.status(201).json(createdFactors);
  } catch (error) {
    await t.rollback();
    console.error("Error adding critical factors:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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

export const updateCriticalFactors = async (req, res) => {
  console.log(
    "[DEBUG] updateCriticalFactors called for id:",
    req.params.criticalFactorId
  );
  const t = await sequelize.transaction();
  try {
    const { criticalFactorId } = req.params;
    console.log(
      "[DEBUG] Looking for CriticalFactor with id:",
      criticalFactorId
    );

    let factor = await CriticalFactor.findByPk(criticalFactorId, {
      transaction: t,
    });
    console.log("[DEBUG] factor found with transaction:", factor);

    if (!factor) {
      factor = await CriticalFactor.findByPk(criticalFactorId);
      console.log("[DEBUG] factor found without transaction:", factor);
    }
    const { amendmentReason, ...updatedData } = req.body;
    const userId = req.user.id;

    if (!amendmentReason) {
      await t.rollback();
      return res.status(400).json({
        message: "Amendment reason is required for updating critical factors",
      });
    }

    if (!factor) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Critical factor record not found" });
    }

    const oldValues = factor.toJSON();

    updatedData.isAmended = true;
    updatedData.amendedBy = userId;
    updatedData.amendedAt = new Date();
    updatedData.amendmentReason = amendmentReason;

    await factor.update(updatedData, { transaction: t });

    const newValues = factor.toJSON();

    await logAudit(
      userId,
      "UPDATE",
      "CriticalFactors",
      criticalFactorId,
      oldValues,
      newValues,
      `Updated critical factors for patient ID: ${factor.patientId}, record ID: ${criticalFactorId}. Amendment reason: ${amendmentReason}`,
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

export const getCriticalFactorAuditHistory = async (req, res) => {
  try {
    const { criticalFactorId } = req.params;

    const factor = await CriticalFactor.findByPk(criticalFactorId, {
      include: [
        {
          model: User,
          as: "recorder",
          attributes: ["id", "username", "nameWithInitials", "role"],
        },
        {
          model: User,
          as: "amender",
          attributes: ["id", "username", "nameWithInitials", "role"],
          foreignKey: "amendedBy",
        },
      ],
    });

    if (!factor) {
      return res
        .status(404)
        .json({ message: "Critical factor record not found" });
    }

    const auditLogs = await AuditLog.findAll({
      where: {
        tableName: "CriticalFactors",
        recordId: criticalFactorId,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "nameWithInitials", "role"],
        },
      ],
      order: [["timestamp", "DESC"]],
    });

    const response = {
      currentRecord: {
        ...factor.toJSON(),
        recorder: factor.recorder,
        amender: factor.amender,
      },
      auditHistory: auditLogs.map((log) => {
        const formattedLog = {
          id: log.id,
          action: log.action,
          timestamp: log.timestamp,
          user: log.user,
          description: log.description,
        };

        if (log.action === "CREATE") {
          formattedLog.changes = {
            initialValues: log.newValues,
          };
        } else if (log.action === "UPDATE") {
          formattedLog.changes = log.newValues;
        }

        return formattedLog;
      }),
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching critical factor audit history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
