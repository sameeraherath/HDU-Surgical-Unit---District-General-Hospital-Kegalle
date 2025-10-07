import {
  Prescription,
  Patient,
  UserMySQLModel,
} from "../config/mysqlDB.js";
import { Op } from "sequelize";
import { logMedication } from "../services/auditService.js";

// @desc    Create a new prescription
// @route   POST /api/medical-officer/prescriptions
// @access  Private (Medical Staff)
export const createPrescription = async (req, res) => {
  try {
    const {
      patientId,
      medicationName,
      genericName,
      brandName,
      medicationType,
      dosage,
      dosageValue,
      dosageUnit,
      frequency,
      frequencyCode,
      timesPerDay,
      route,
      duration,
      durationValue,
      durationUnit,
      startDate,
      administrationTimes,
      instructions,
      foodRelation,
      quantity,
      refillsAllowed,
      indication,
      priority,
      isControlled,
      isNarcotic,
      requiresMonitoring,
    } = req.body;

    // Verify patient exists
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Calculate end date
    let endDate = null;
    if (startDate && durationValue && durationUnit) {
      const start = new Date(startDate);
      switch (durationUnit) {
        case "DAYS":
          endDate = new Date(start.setDate(start.getDate() + durationValue));
          break;
        case "WEEKS":
          endDate = new Date(
            start.setDate(start.getDate() + durationValue * 7)
          );
          break;
        case "MONTHS":
          endDate = new Date(start.setMonth(start.getMonth() + durationValue));
          break;
        default:
          endDate = null;
      }
    }

    const prescription = await Prescription.create({
      patientId,
      prescribedBy: req.user.id,
      medicationName,
      genericName,
      brandName,
      medicationType: medicationType || "TABLET",
      dosage,
      dosageValue,
      dosageUnit,
      frequency,
      frequencyCode,
      timesPerDay,
      route: route || "ORAL",
      duration,
      durationValue,
      durationUnit,
      startDate: startDate || new Date(),
      endDate,
      administrationTimes: administrationTimes || [],
      instructions,
      foodRelation,
      quantity,
      refillsAllowed: refillsAllowed || 0,
      refillsRemaining: refillsAllowed || 0,
      indication,
      status: "ACTIVE",
      priority: priority || "ROUTINE",
      isControlled: isControlled || false,
      isNarcotic: isNarcotic || false,
      requiresMonitoring: requiresMonitoring || false,
    });

    // Audit log with HIGH severity
    await logMedication({
      userId: req.user.id,
      action: "PRESCRIPTION_CREATE",
      patientId,
      description: `Prescribed ${medicationName} - ${dosage} ${frequency}`,
      newValues: prescription.toJSON(),
      req,
    });

    // Send notification to nurses for administration
    const io = req.app.get("io");
    if (io) {
      io.to(`patient_${patientId}`).emit("prescription-added", {
        prescription,
        prescriber: {
          id: req.user.id,
          username: req.user.username,
          role: req.user.role,
        },
      });

      // Notify pharmacy for controlled substances
      if (isControlled || isNarcotic) {
        io.to("role_Pharmacist").emit("controlled-prescription", {
          prescription,
          patient,
        });
      }
    }

    res.status(201).json({
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get prescriptions for a patient
// @route   GET /api/medical-officer/prescriptions/:patientId
// @access  Private (Medical Staff)
export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status, active, limit = 50, page = 1 } = req.query;

    const where = { patientId: parseInt(patientId) };
    
    if (status) {
      where.status = status;
    } else if (active === "true") {
      where.status = "ACTIVE";
      where.endDate = {
        [Op.or]: [{ [Op.gte]: new Date() }, { [Op.is]: null }],
      };
    }

    const offset = (page - 1) * limit;

    const { count, rows: prescriptions } = await Prescription.findAndCountAll({
      where,
      include: [
        {
          model: UserMySQLModel,
          as: "prescriber",
          attributes: ["id", "username", "role"],
        },
        {
          model: UserMySQLModel,
          as: "verifier",
          attributes: ["id", "username", "role"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["startDate", "DESC"]],
    });

    res.json({
      prescriptions,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get active prescriptions
// @route   GET /api/medical-officer/prescriptions/active
// @access  Private (Medical Staff)
export const getActivePrescriptions = async (req, res) => {
  try {
    const { limit = 100, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: prescriptions } = await Prescription.findAndCountAll({
      where: {
        status: "ACTIVE",
        [Op.or]: [
          { endDate: { [Op.gte]: new Date() } },
          { endDate: { [Op.is]: null } },
        ],
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: ["id", "firstName", "lastName", "patientId"],
        },
        {
          model: UserMySQLModel,
          as: "prescriber",
          attributes: ["id", "username", "role"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["startDate", "DESC"]],
    });

    res.json({
      prescriptions,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching active prescriptions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a prescription
// @route   PUT /api/medical-officer/prescriptions/:id
// @access  Private (Medical Staff - Prescriber or Consultant)
export const updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const prescription = await Prescription.findByPk(id);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Check if user is the prescriber or a consultant
    if (
      prescription.prescribedBy !== req.user.id &&
      req.user.role !== "Consultant"
    ) {
      return res.status(403).json({
        message: "Access denied. Only the prescriber or consultant can update.",
      });
    }

    const oldValues = prescription.toJSON();
    await prescription.update(updateData);

    // Audit log
    await logMedication({
      userId: req.user.id,
      action: "PRESCRIPTION_UPDATE",
      patientId: prescription.patientId,
      description: `Updated prescription for ${prescription.medicationName}`,
      oldValues,
      newValues: prescription.toJSON(),
      req,
    });

    res.json({
      message: "Prescription updated successfully",
      prescription,
    });
  } catch (error) {
    console.error("Error updating prescription:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Discontinue a prescription
// @route   PUT /api/medical-officer/prescriptions/:id/discontinue
// @access  Private (Medical Staff - Prescriber or Consultant)
export const discontinuePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { discontinuationReason } = req.body;

    const prescription = await Prescription.findByPk(id);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Check if user is the prescriber or a consultant
    if (
      prescription.prescribedBy !== req.user.id &&
      req.user.role !== "Consultant"
    ) {
      return res.status(403).json({
        message:
          "Access denied. Only the prescriber or consultant can discontinue.",
      });
    }

    await prescription.update({
      status: "DISCONTINUED",
      discontinuedBy: req.user.id,
      discontinuedAt: new Date(),
      discontinuationReason,
    });

    // Audit log
    await logMedication({
      userId: req.user.id,
      action: "PRESCRIPTION_DISCONTINUE",
      patientId: prescription.patientId,
      description: `Discontinued ${prescription.medicationName}`,
      req,
    });

    // Send notification
    const io = req.app.get("io");
    if (io) {
      io.to(`patient_${prescription.patientId}`).emit(
        "prescription-discontinued",
        {
          prescription,
        }
      );
    }

    res.json({
      message: "Prescription discontinued successfully",
      prescription,
    });
  } catch (error) {
    console.error("Error discontinuing prescription:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Verify a prescription (Pharmacist)
// @route   PUT /api/medical-officer/prescriptions/:id/verify
// @access  Private (Pharmacist)
export const verifyPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { pharmacistNotes } = req.body;

    if (req.user.role !== "Pharmacist") {
      return res.status(403).json({
        message: "Access denied. Only pharmacists can verify prescriptions.",
      });
    }

    const prescription = await Prescription.findByPk(id);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    await prescription.update({
      verifiedBy: req.user.id,
      verifiedAt: new Date(),
      pharmacistNotes,
    });

    // Audit log
    await logMedication({
      userId: req.user.id,
      action: "PRESCRIPTION_VERIFY",
      patientId: prescription.patientId,
      description: `Verified prescription for ${prescription.medicationName}`,
      req,
    });

    res.json({
      message: "Prescription verified successfully",
      prescription,
    });
  } catch (error) {
    console.error("Error verifying prescription:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Dispense a prescription (Pharmacist)
// @route   PUT /api/medical-officer/prescriptions/:id/dispense
// @access  Private (Pharmacist)
export const dispensePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "Pharmacist") {
      return res.status(403).json({
        message: "Access denied. Only pharmacists can dispense prescriptions.",
      });
    }

    const prescription = await Prescription.findByPk(id);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    if (!prescription.verifiedBy) {
      return res.status(400).json({
        message: "Prescription must be verified before dispensing.",
      });
    }

    await prescription.update({
      dispensedBy: req.user.id,
      dispensedAt: new Date(),
    });

    // Audit log
    await logMedication({
      userId: req.user.id,
      action: "PRESCRIPTION_DISPENSE",
      patientId: prescription.patientId,
      description: `Dispensed ${prescription.medicationName}`,
      req,
    });

    res.json({
      message: "Prescription dispensed successfully",
      prescription,
    });
  } catch (error) {
    console.error("Error dispensing prescription:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get medication administration schedule
// @route   GET /api/medical-officer/prescriptions/schedule/:patientId
// @access  Private (Medical Staff)
export const getMedicationSchedule = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { date } = req.query;

    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const prescriptions = await Prescription.findAll({
      where: {
        patientId: parseInt(patientId),
        status: "ACTIVE",
        startDate: { [Op.lte]: endOfDay },
        [Op.or]: [
          { endDate: { [Op.gte]: startOfDay } },
          { endDate: { [Op.is]: null } },
        ],
      },
      include: [
        {
          model: UserMySQLModel,
          as: "prescriber",
          attributes: ["id", "username", "role"],
        },
      ],
      order: [["startDate", "DESC"]],
    });

    res.json({ prescriptions, date: targetDate });
  } catch (error) {
    console.error("Error fetching medication schedule:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get controlled substance prescriptions
// @route   GET /api/medical-officer/prescriptions/controlled
// @access  Private (Medical Staff)
export const getControlledPrescriptions = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: prescriptions } = await Prescription.findAndCountAll({
      where: {
        [Op.or]: [{ isControlled: true }, { isNarcotic: true }],
        status: "ACTIVE",
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: ["id", "firstName", "lastName", "patientId"],
        },
        {
          model: UserMySQLModel,
          as: "prescriber",
          attributes: ["id", "username", "role"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["startDate", "DESC"]],
    });

    res.json({
      prescriptions,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching controlled prescriptions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
