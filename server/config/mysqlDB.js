import { Sequelize } from "sequelize";
import { sequelize, testConnection } from "./database.js";
import defineBed from "../models/BedMySQL.js";
import definePatient from "../models/patients/Patient.js";
import defineEmergencyContact from "../models/patients/EmergencyContact.js";
import defineMedicalRecord from "../models/patients/MedicalRecord.js";
import defineAdmission from "../models/patients/Admission.js";
import definePatientDocument from "../models/patients/PatientDocument.js";
import defineUser from "../models/UserMySQL.js";
import defineCriticalFactor from "../models/patients/CriticalFactor.js";
import defineAuditLog from "../models/AuditLog.js";
import defineUserProfile from "../models/UserProfile.js";
import defineUserPreference from "../models/UserPreference.js";

const BedMySQL = defineBed(sequelize);
const Patient = definePatient(sequelize);
const EmergencyContact = defineEmergencyContact(sequelize);
const MedicalRecord = defineMedicalRecord(sequelize);
const Admission = defineAdmission(sequelize);
const PatientDocument = definePatientDocument(sequelize);
const UserMySQLModel = defineUser(sequelize);
const CriticalFactor = defineCriticalFactor(sequelize);
const AuditLog = defineAuditLog(sequelize);
const UserProfile = defineUserProfile(sequelize);
const UserPreference = defineUserPreference(sequelize);

const defineAssociations = () => {
  Patient.hasMany(Admission, { foreignKey: "patientId", as: "admissions" });
  Admission.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });

  Patient.hasMany(EmergencyContact, {
    foreignKey: "patientId",
    as: "emergencyContacts",
  });
  EmergencyContact.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
  });

  Patient.hasMany(MedicalRecord, {
    foreignKey: "patientId",
    as: "medicalRecords",
  });
  MedicalRecord.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });

  Patient.hasMany(PatientDocument, {
    foreignKey: "patientId",
    as: "documents",
  });
  PatientDocument.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
  });

  Patient.hasMany(CriticalFactor, {
    foreignKey: "patientId",
    as: "criticalFactors",
  });
  CriticalFactor.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
  });

  UserMySQLModel.hasMany(CriticalFactor, {
    foreignKey: "recordedBy",
    as: "recordedCriticalFactors",
  });
  CriticalFactor.belongsTo(UserMySQLModel, {
    foreignKey: "recordedBy",
    as: "recorder",
  });

  UserMySQLModel.hasMany(CriticalFactor, {
    foreignKey: "amendedBy",
    as: "amendedCriticalFactors",
  });
  CriticalFactor.belongsTo(UserMySQLModel, {
    foreignKey: "amendedBy",
    as: "amender",
  });

  UserMySQLModel.hasMany(PatientDocument, {
    foreignKey: "uploadedBy",
    as: "uploadedDocuments",
    constraints: false,
  });
  PatientDocument.belongsTo(UserMySQLModel, {
    foreignKey: "uploadedBy",
    as: "uploader",
    constraints: false,
  });

  UserMySQLModel.hasMany(AuditLog, {
    foreignKey: "userId",
    as: "auditLogs",
    constraints: false,
  });
  AuditLog.belongsTo(UserMySQLModel, {
    foreignKey: "userId",
    as: "user",
    constraints: false,
  });

  // User Profile and Preferences associations
  UserMySQLModel.hasOne(UserProfile, {
    foreignKey: "userId",
    as: "profile",
    onDelete: "CASCADE",
  });
  UserProfile.belongsTo(UserMySQLModel, {
    foreignKey: "userId",
    as: "user",
  });

  UserMySQLModel.hasOne(UserPreference, {
    foreignKey: "userId",
    as: "preferences",
    onDelete: "CASCADE",
  });
  UserPreference.belongsTo(UserMySQLModel, {
    foreignKey: "userId",
    as: "user",
  });

  Patient.hasOne(BedMySQL, { foreignKey: "patientId" });
  BedMySQL.belongsTo(Patient, { foreignKey: "patientId" });
};

defineAssociations();

const connectMySql = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connection has been established successfully.");

    await UserMySQLModel.sync({ alter: true });
    console.log("User model synchronized");

    await sequelize.transaction(async (t) => {
      await Patient.sync({ alter: true });
      await EmergencyContact.sync({ alter: true });
      await MedicalRecord.sync({ alter: true });
      await Admission.sync({ alter: true });
      await PatientDocument.sync({ alter: true });
      await BedMySQL.sync({ alter: true });
      await CriticalFactor.sync({ alter: true });
      await AuditLog.sync({ alter: true });
      await UserProfile.sync({ alter: true });
      await UserPreference.sync({ alter: true });
    });

    console.log("All models synchronized successfully");

    const bedCount = await BedMySQL.count();
    if (bedCount === 0) {
      const initialBeds = Array.from({ length: 10 }, (_, i) => ({
        bedNumber: `B${i + 1}`,
        patientId: null,
      }));
      await BedMySQL.bulkCreate(initialBeds);
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};

export {
  sequelize,
  connectMySql,
  BedMySQL,
  Patient,
  EmergencyContact,
  MedicalRecord,
  Admission,
  PatientDocument,
  UserMySQLModel,
  CriticalFactor,
  AuditLog,
  UserProfile,
  UserPreference,
};
