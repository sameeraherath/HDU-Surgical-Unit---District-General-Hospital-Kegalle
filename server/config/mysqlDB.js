import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import defineBed from "../models/BedMySQL.js";
import definePatient from "../models/normalized/Patient.js";
import defineEmergencyContact from "../models/normalized/EmergencyContact.js";
import defineMedicalRecord from "../models/normalized/MedicalRecord.js";
import defineAdmission from "../models/normalized/Admission.js";
import definePatientDocument from "../models/normalized/PatientDocument.js";
import defineUser from "../models/UserMySQL.js";

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: "mysql",
    logging: false,
  }
);

// Define models
const BedMySQL = defineBed(sequelize);
const Patient = definePatient(sequelize);
const EmergencyContact = defineEmergencyContact(sequelize);
const MedicalRecord = defineMedicalRecord(sequelize);
const Admission = defineAdmission(sequelize);
const PatientDocument = definePatientDocument(sequelize);
const UserMySQLModel = defineUser(sequelize);

// Define associations
Patient.hasMany(EmergencyContact, { foreignKey: "patientId" });
EmergencyContact.belongsTo(Patient, { foreignKey: "patientId" });

Patient.hasMany(MedicalRecord, { foreignKey: "patientId" });
MedicalRecord.belongsTo(Patient, { foreignKey: "patientId" });

Patient.hasMany(Admission, { foreignKey: "patientId" });
Admission.belongsTo(Patient, { foreignKey: "patientId" });

Patient.hasMany(PatientDocument, { foreignKey: "patientId" });
PatientDocument.belongsTo(Patient, { foreignKey: "patientId" });

// Legacy association for bed assignment
BedMySQL.belongsTo(Patient, { foreignKey: "patientId" });
Patient.hasMany(BedMySQL, { foreignKey: "patientId" });

const connectMySql = async () => {
  try {
    await sequelize.authenticate();
    // Database connection established successfully.

    // Sync all models - reordering to ensure dependencies are created first
    await UserMySQLModel.sync({ alter: true });
    await Patient.sync({ alter: true });
    await EmergencyContact.sync({ alter: true });
    await MedicalRecord.sync({ alter: true });
    await Admission.sync({ alter: true });
    await PatientDocument.sync({ alter: true });
    await BedMySQL.sync({ alter: true });

    const bedCount = await BedMySQL.count();
    if (bedCount === 0) {
      const initialBeds = Array.from({ length: 10 }, (_, i) => ({
        bedNumber: `B${i + 1}`,
        patientId: null,
      }));
      await BedMySQL.bulkCreate(initialBeds);
      // Initial beds seeded.
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
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
};
