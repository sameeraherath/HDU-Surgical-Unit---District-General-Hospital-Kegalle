import { Patient } from "../config/mysqlDB.js";
import { Op } from "sequelize";

/**
 * Generates a unique patient number in the format "PT-YYYY-XXXX"
 * where YYYY is the current year and XXXX is a sequential number
 */
export const generatePatientNumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `PT-${currentYear}-`;

  // Find the highest existing patient number for the current year
  const latestPatient = await Patient.findOne({
    where: {
      patientNumber: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [["patientNumber", "DESC"]],
  });

  let nextNumber = 1;

  if (latestPatient) {
    // Extract the numeric part of the latest patient number
    const latestNumber = latestPatient.patientNumber.split("-")[2];
    nextNumber = parseInt(latestNumber, 10) + 1;
  }

  // Format the next number with leading zeros
  const paddedNumber = nextNumber.toString().padStart(4, "0");
  return `${prefix}${paddedNumber}`;
};
