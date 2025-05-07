import {
  Patient,
  EmergencyContact,
  MedicalRecord,
  Admission,
  PatientDocument,
  sequelize,
} from "../config/mysqlDB.js";
import { generatePatientNumber } from "../utils/generators.js";

class PatientRepository {
  async createPatient(patientData) {
    const transaction = await sequelize.transaction();

    try {
      const patientNumber = await generatePatientNumber();
      const {
        fullName,
        nicPassport,
        dateOfBirth,
        age,
        gender,
        maritalStatus,
        contactNumber,
        email,
        address,

        emergencyContactName,
        emergencyContactRelationship,
        emergencyContactNumber,

        knownAllergies,
        medicalHistory,
        currentMedications,
        pregnancyStatus,
        bloodType,
        initialDiagnosis,

        admissionDateTime,
        department,
        consultantInCharge,
      } = patientData;

      const patient = await Patient.create(
        {
          patientNumber,
          fullName,
          nicPassport,
          dateOfBirth,
          age,
          gender,
          maritalStatus: maritalStatus || "Unknown",
          contactNumber,
          email,
          address,
        },
        { transaction }
      );

      if (emergencyContactName && emergencyContactNumber) {
        await EmergencyContact.create(
          {
            patientId: patient.id,
            name: emergencyContactName,
            relationship: emergencyContactRelationship,
            contactNumber: emergencyContactNumber,
            isPrimary: true,
          },
          { transaction }
        );
      }

      await MedicalRecord.create(
        {
          patientId: patient.id,
          knownAllergies: knownAllergies || null,
          medicalHistory: medicalHistory || null,
          currentMedications: currentMedications || null,
          pregnancyStatus: pregnancyStatus || "Not Applicable",
          bloodType: bloodType || "Unknown",
          initialDiagnosis,
        },
        { transaction }
      );

      const admission = await Admission.create(
        {
          patientId: patient.id,
          admissionDateTime: admissionDateTime || new Date(),
          department,
          consultantInCharge,
          status: "Active",
        },
        { transaction }
      );

      await transaction.commit();

      return {
        patient,
        admission,
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Error creating patient records:", error);
      throw error;
    }
  }

  async getPatientById(patientId, includeAll = false) {
    const options = {
      where: { id: patientId },
    };

    if (includeAll) {
      options.include = [
        { model: EmergencyContact },
        { model: MedicalRecord },
        { model: Admission },
        { model: PatientDocument },
      ];
    }

    return await Patient.findOne(options);
  }

  async updatePatient(patientId, patientData) {
    const transaction = await sequelize.transaction();

    try {
      const patient = await Patient.findByPk(patientId, { transaction });

      if (!patient) {
        throw new Error("Patient not found");
      }

      if (patientData.fullName) patient.fullName = patientData.fullName;
      if (patientData.contactNumber)
        patient.contactNumber = patientData.contactNumber;
      if (patientData.email) patient.email = patientData.email;
      if (patientData.maritalStatus)
        patient.maritalStatus = patientData.maritalStatus;
      if (patientData.address) patient.address = patientData.address;

      await patient.save({ transaction });
      if (
        patientData.emergencyContactName ||
        patientData.emergencyContactNumber
      ) {
        const [emergencyContact] = await EmergencyContact.findOrCreate({
          where: { patientId, isPrimary: true },
          defaults: {
            patientId,
            name: patientData.emergencyContactName,
            relationship: patientData.emergencyContactRelationship || "Other",
            contactNumber: patientData.emergencyContactNumber,
            isPrimary: true,
          },
          transaction,
        });

        if (emergencyContact) {
          if (patientData.emergencyContactName)
            emergencyContact.name = patientData.emergencyContactName;
          if (patientData.emergencyContactRelationship)
            emergencyContact.relationship =
              patientData.emergencyContactRelationship;
          if (patientData.emergencyContactNumber)
            emergencyContact.contactNumber = patientData.emergencyContactNumber;

          await emergencyContact.save({ transaction });
        }
      }
      await transaction.commit();
      return patient;
    } catch (error) {
      await transaction.rollback();
      console.error("Error updating patient:", error);
      throw error;
    }
  }

  async getAllPatients(options = {}) {
    const queryOptions = {
      include: [
        {
          model: EmergencyContact,
          where: { isPrimary: true },
          required: false,
        },
        { model: MedicalRecord, required: false },
        { model: Admission, where: { status: "Active" }, required: false },
      ],
      order: [["createdAt", "DESC"]],
    };

    if (options.limit) {
      queryOptions.limit = options.limit;
    }

    if (options.offset) {
      queryOptions.offset = options.offset;
    }

    return await Patient.findAll(queryOptions);
  }
}

export default new PatientRepository();
