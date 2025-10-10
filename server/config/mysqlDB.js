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
import defineNotification from "../models/Notification.js";
import defineNotificationSettings from "../models/NotificationSettings.js";
import ProgressNote from "../models/ProgressNote.js";
import Investigation from "../models/Investigation.js";
import InvestigationResult from "../models/InvestigationResult.js";
import Prescription from "../models/Prescription.js";
import Task from "../models/Task.js";
import FluidBalance from "../models/FluidBalance.js";
import WardRound from "../models/WardRound.js";
import DischargePlan from "../models/DischargePlan.js";
import TeachingNote from "../models/TeachingNote.js";
import Consultation from "../models/Consultation.js";
import ClinicalAudit from "../models/ClinicalAudit.js";

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
const Notification = defineNotification(sequelize);
const NotificationSettings = defineNotificationSettings(sequelize);

const defineAssociations = () => {
  // Disable automatic index creation for foreign keys to avoid "too many keys" error
  const associationOptions = { constraints: false };
  
  Patient.hasMany(Admission, { foreignKey: "patientId", as: "admissions", constraints: false });
  Admission.belongsTo(Patient, { foreignKey: "patientId", as: "patient", constraints: false });

  Patient.hasMany(EmergencyContact, {
    foreignKey: "patientId",
    as: "emergencyContacts",
    constraints: false,
  });
  EmergencyContact.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
    constraints: false,
  });

  Patient.hasMany(MedicalRecord, {
    foreignKey: "patientId",
    as: "medicalRecords",
    constraints: false,
  });
  MedicalRecord.belongsTo(Patient, { foreignKey: "patientId", as: "patient", constraints: false });

  Patient.hasMany(PatientDocument, {
    foreignKey: "patientId",
    as: "documents",
    constraints: false,
  });
  PatientDocument.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
    constraints: false,
  });

  Patient.hasMany(CriticalFactor, {
    foreignKey: "patientId",
    as: "criticalFactors",
    constraints: false,
  });
  CriticalFactor.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
    constraints: false,
  });

  UserMySQLModel.hasMany(CriticalFactor, {
    foreignKey: "recordedBy",
    as: "recordedCriticalFactors",
    constraints: false,
  });
  CriticalFactor.belongsTo(UserMySQLModel, {
    foreignKey: "recordedBy",
    as: "recorder",
    constraints: false,
  });

  UserMySQLModel.hasMany(CriticalFactor, {
    foreignKey: "amendedBy",
    as: "amendedCriticalFactors",
    constraints: false,
  });
  CriticalFactor.belongsTo(UserMySQLModel, {
    foreignKey: "amendedBy",
    as: "amender",
    constraints: false,
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
    constraints: false,
  });
  UserProfile.belongsTo(UserMySQLModel, {
    foreignKey: "userId",
    as: "user",
    constraints: false,
  });

  UserMySQLModel.hasOne(UserPreference, {
    foreignKey: "userId",
    as: "preferences",
    onDelete: "CASCADE",
    constraints: false,
  });
  UserPreference.belongsTo(UserMySQLModel, {
    foreignKey: "userId",
    as: "user",
    constraints: false,
  });

  // Notification associations
  UserMySQLModel.hasMany(Notification, {
    foreignKey: "userId",
    as: "notifications",
    onDelete: "CASCADE",
    constraints: false,
  });
  Notification.belongsTo(UserMySQLModel, {
    foreignKey: "userId",
    as: "user",
    constraints: false,
  });

  UserMySQLModel.hasOne(NotificationSettings, {
    foreignKey: "userId",
    as: "notificationSettings",
    onDelete: "CASCADE",
    constraints: false,
  });
  NotificationSettings.belongsTo(UserMySQLModel, {
    foreignKey: "userId",
    as: "user",
    constraints: false,
  });

  Patient.hasOne(BedMySQL, { foreignKey: "patientId", constraints: false });
  BedMySQL.belongsTo(Patient, { foreignKey: "patientId", constraints: false });

  // Phase 2: Medical Officer Dashboard associations
  // Progress Notes
  Patient.hasMany(ProgressNote, {
    foreignKey: "patientId",
    as: "progressNotes",
    constraints: false,
  });
  ProgressNote.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
    constraints: false,
  });

  UserMySQLModel.hasMany(ProgressNote, {
    foreignKey: "userId",
    as: "progressNotes",
    constraints: false,
  });
  ProgressNote.belongsTo(UserMySQLModel, {
    foreignKey: "userId",
    as: "author",
    constraints: false,
  });

  ProgressNote.belongsTo(UserMySQLModel, {
    foreignKey: "reviewedBy",
    as: "reviewer",
    constraints: false,
  });

  // Investigations
  Patient.hasMany(Investigation, {
    foreignKey: "patientId",
    as: "investigations",
    constraints: false,
  });
  Investigation.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
    constraints: false,
  });

  UserMySQLModel.hasMany(Investigation, {
    foreignKey: "orderedBy",
    as: "orderedInvestigations",
    constraints: false,
  });
  Investigation.belongsTo(UserMySQLModel, {
    foreignKey: "orderedBy",
    as: "orderedByUser",
    constraints: false,
  });

  Investigation.belongsTo(UserMySQLModel, {
    foreignKey: "specimenCollectedBy",
    as: "specimenCollector",
    constraints: false,
  });

  Investigation.belongsTo(UserMySQLModel, {
    foreignKey: "reportedBy",
    as: "reporter",
    constraints: false,
  });

  Investigation.belongsTo(UserMySQLModel, {
    foreignKey: "reviewedBy",
    as: "reviewer",
    constraints: false,
  });

  // Investigation Results
  Investigation.hasMany(InvestigationResult, {
    foreignKey: "investigationId",
    as: "results",
    constraints: false,
  });
  InvestigationResult.belongsTo(Investigation, {
    foreignKey: "investigationId",
    as: "investigation",
    constraints: false,
  });

  Patient.hasMany(InvestigationResult, {
    foreignKey: "patientId",
    as: "investigationResults",
    constraints: false,
  });
  InvestigationResult.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
    constraints: false,
  });

  InvestigationResult.belongsTo(UserMySQLModel, {
    foreignKey: "verifiedBy",
    as: "verifier",
    constraints: false,
  });

  // Prescriptions
  Patient.hasMany(Prescription, {
    foreignKey: "patientId",
    as: "prescriptions",
    constraints: false,
  });
  Prescription.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
    constraints: false,
  });

  UserMySQLModel.hasMany(Prescription, {
    foreignKey: "prescribedBy",
    as: "prescriptions",
    constraints: false,
  });
  Prescription.belongsTo(UserMySQLModel, {
    foreignKey: "prescribedBy",
    as: "prescribedByUser",
    constraints: false,
  });

  Prescription.belongsTo(UserMySQLModel, {
    foreignKey: "discontinuedBy",
    as: "discontinuer",
    constraints: false,
  });

  Prescription.belongsTo(UserMySQLModel, {
    foreignKey: "verifiedBy",
    as: "verifier",
    constraints: false,
  });

  Prescription.belongsTo(UserMySQLModel, {
    foreignKey: "dispensedBy",
    as: "dispenser",
    constraints: false,
  });

  // Tasks
  Patient.hasMany(Task, {
    foreignKey: "patientId",
    as: "tasks",
    constraints: false,
  });
  Task.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
    constraints: false,
  });

  UserMySQLModel.hasMany(Task, {
    foreignKey: "assignedTo",
    as: "assignedTasks",
    constraints: false,
  });
  Task.belongsTo(UserMySQLModel, {
    foreignKey: "assignedTo",
    as: "assignee",
    constraints: false,
  });

  UserMySQLModel.hasMany(Task, {
    foreignKey: "assignedBy",
    as: "createdTasks",
    constraints: false,
  });
  Task.belongsTo(UserMySQLModel, {
    foreignKey: "assignedBy",
    as: "assigner",
    constraints: false,
  });

  Task.belongsTo(UserMySQLModel, {
    foreignKey: "completedBy",
    as: "completer",
    constraints: false,
  });

  Task.belongsTo(UserMySQLModel, {
    foreignKey: "cancelledBy",
    as: "canceller",
    constraints: false,
  });

  Task.belongsTo(Task, {
    foreignKey: "parentTaskId",
    as: "parentTask",
    constraints: false,
  });

  // Fluid Balance
  Patient.hasMany(FluidBalance, {
    foreignKey: "patientId",
    as: "fluidBalanceRecords",
    constraints: false,
  });
  FluidBalance.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
    constraints: false,
  });

  UserMySQLModel.hasMany(FluidBalance, {
    foreignKey: "recordedBy",
    as: "fluidBalanceRecords",
    constraints: false,
  });
  FluidBalance.belongsTo(UserMySQLModel, {
    foreignKey: "recordedBy",
    as: "recorder",
    constraints: false,
  });

  FluidBalance.belongsTo(UserMySQLModel, {
    foreignKey: "verifiedBy",
    as: "verifier",
    constraints: false,
  });

  // Phase 3: Consultant Dashboard associations
  // Ward Rounds
  Patient.hasMany(WardRound, {
    foreignKey: "patientId",
    as: "wardRounds",
    constraints: false,
  });
  WardRound.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
    constraints: false,
  });

  UserMySQLModel.hasMany(WardRound, {
    foreignKey: "consultantId",
    as: "wardRounds",
    constraints: false,
  });
  WardRound.belongsTo(UserMySQLModel, {
    foreignKey: "consultantId",
    as: "consultant",
    constraints: false,
  });

  // Discharge Plans
  Patient.hasOne(DischargePlan, {
    foreignKey: "patientId",
    as: "dischargePlan",
    constraints: false,
  });
  DischargePlan.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
    constraints: false,
  });

  UserMySQLModel.hasMany(DischargePlan, {
    foreignKey: "consultantId",
    as: "dischargePlans",
    constraints: false,
  });
  DischargePlan.belongsTo(UserMySQLModel, {
    foreignKey: "consultantId",
    as: "consultant",
    constraints: false,
  });

  // Teaching Notes
  UserMySQLModel.hasMany(TeachingNote, {
    foreignKey: "consultantId",
    as: "teachingNotes",
    constraints: false,
  });
  TeachingNote.belongsTo(UserMySQLModel, {
    foreignKey: "consultantId",
    as: "consultant",
    constraints: false,
  });

  Patient.hasMany(TeachingNote, {
    foreignKey: "patientId",
    as: "teachingNotes",
    constraints: false,
  });
  TeachingNote.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
    constraints: false,
  });

  // Consultations
  Patient.hasMany(Consultation, {
    foreignKey: "patientId",
    as: "consultations",
    constraints: false,
  });
  Consultation.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
    constraints: false,
  });

  UserMySQLModel.hasMany(Consultation, {
    foreignKey: "requestedById",
    as: "requestedConsultations",
    constraints: false,
  });
  Consultation.belongsTo(UserMySQLModel, {
    foreignKey: "requestedById",
    as: "requestedBy",
    constraints: false,
  });

  UserMySQLModel.hasMany(Consultation, {
    foreignKey: "consultantId",
    as: "consultations",
    constraints: false,
  });
  Consultation.belongsTo(UserMySQLModel, {
    foreignKey: "consultantId",
    as: "consultant",
    constraints: false,
  });

  // Clinical Audits
  UserMySQLModel.hasMany(ClinicalAudit, {
    foreignKey: "consultantId",
    as: "clinicalAudits",
    constraints: false,
  });
  ClinicalAudit.belongsTo(UserMySQLModel, {
    foreignKey: "consultantId",
    as: "consultant",
    constraints: false,
  });
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
      await Notification.sync({ alter: true });
      await NotificationSettings.sync({ alter: true });
      await ProgressNote.sync({ alter: true });
      await Investigation.sync({ alter: true });
      await InvestigationResult.sync({ alter: true });
      await Prescription.sync({ alter: true });
      await Task.sync({ alter: true });
      await FluidBalance.sync({ alter: true });
      await WardRound.sync({ alter: true });
      await DischargePlan.sync({ alter: true });
      await TeachingNote.sync({ alter: true });
      await Consultation.sync({ alter: true });
      await ClinicalAudit.sync({ alter: true });
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
  Notification,
  NotificationSettings,
  ProgressNote,
  Investigation,
  InvestigationResult,
  Prescription,
  Task,
  FluidBalance,
  WardRound,
  DischargePlan,
  TeachingNote,
  Consultation,
  ClinicalAudit,
};
