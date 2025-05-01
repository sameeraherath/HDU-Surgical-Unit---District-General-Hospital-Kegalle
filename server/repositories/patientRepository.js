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
    // Start a transaction to ensure data consistency
    const transaction = await sequelize.transaction();

    try {
      // Generate a unique patient number
      const patientNumber = await generatePatientNumber();

      // Extract data for different tables
      const {
        // Patient details
        fullName,
        nicPassport,
        dateOfBirth,
        age,
        gender,
        maritalStatus,
        contactNumber,
        email,
        address,

        // Emergency contact details
        emergencyContactName,
        emergencyContactRelationship,
        emergencyContactNumber,

        // Medical record details
        knownAllergies,
        medicalHistory,
        currentMedications,
        pregnancyStatus,
        bloodType,
        initialDiagnosis,

        // Admission details
        admissionDateTime,
        department,
        consultantInCharge,
        bedId,

        // Documents
        medicalReports,
        idProof,
        consentForm,
      } = patientData;

      // 1. Create patient record
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

      // 2. Create emergency contact
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

      // 3. Create medical record
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

      // 4. Create admission record
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

      // 5. Handle document uploads if they exist
      const documentPromises = [];

      if (medicalReports) {
        const files = Array.isArray(medicalReports)
          ? medicalReports
          : [medicalReports];
        files.forEach((file) => {
          if (file && file.name) {
            documentPromises.push(
              PatientDocument.create(
                {
                  patientId: patient.id,
                  documentType: "MedicalReport",
                  fileUrl: `/uploads/patients/${patient.id}/${file.name}`, // This would need actual file upload logic
                  fileName: file.name,
                  fileType: file.type,
                  fileSize: file.size || 0,
                },
                { transaction }
              )
            );
          }
        });
      }

      if (idProof && idProof.name) {
        documentPromises.push(
          PatientDocument.create(
            {
              patientId: patient.id,
              documentType: "IdProof",
              fileUrl: `/uploads/patients/${patient.id}/${idProof.name}`,
              fileName: idProof.name,
              fileType: idProof.type,
              fileSize: idProof.size || 0,
            },
            { transaction }
          )
        );
      }

      if (consentForm && consentForm.name) {
        documentPromises.push(
          PatientDocument.create(
            {
              patientId: patient.id,
              documentType: "ConsentForm",
              fileUrl: `/uploads/patients/${patient.id}/${consentForm.name}`,
              fileName: consentForm.name,
              fileType: consentForm.type,
              fileSize: consentForm.size || 0,
            },
            { transaction }
          )
        );
      }

      if (documentPromises.length > 0) {
        await Promise.all(documentPromises);
      }

      // Commit the transaction
      await transaction.commit();

      return {
        patient,
        admission,
      };
    } catch (error) {
      // Rollback transaction in case of error
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

      // Update patient core data
      if (patientData.fullName) patient.fullName = patientData.fullName;
      if (patientData.contactNumber)
        patient.contactNumber = patientData.contactNumber;
      if (patientData.email) patient.email = patientData.email;
      if (patientData.maritalStatus)
        patient.maritalStatus = patientData.maritalStatus;
      if (patientData.address) patient.address = patientData.address;

      await patient.save({ transaction });

      // Update or create emergency contact
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

      // Handle other updates as needed (medical records, documents, etc.)

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
