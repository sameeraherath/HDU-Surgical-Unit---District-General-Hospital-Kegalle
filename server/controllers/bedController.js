import { BedMySQL, Admission } from "../config/mysqlDB.js";
import patientRepository from "../repositories/patientRepository.js";

export async function getBeds(req, res) {
  try {
    const beds = await BedMySQL.findAll({
      include: {
        association: "Patient",
        attributes: [
          "id",
          "patientNumber",
          "fullName",
          "gender",
          "contactNumber",
        ],
      },
    });
    res.json(beds);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

export async function assignBed(req, res) {
  try {
    // Incoming patient assignment request logic

    const { patientData } = req.body;
    const { bedId } = patientData;

    if (!bedId) {
      console.error("Bed ID is missing in request:", req.body);
      return res.status(400).json({ msg: "Bed ID is required" });
    }

    if (!patientData || Object.keys(patientData).length === 0) {
      console.error("Patient data is missing or empty");
      return res.status(400).json({ msg: "Patient data is required" });
    }

    // Check if bed exists and is available
    const bed = await BedMySQL.findOne({ where: { id: bedId } });
    if (!bed) {
      console.error("Bed not found:", bedId);
      return res.status(404).json({ msg: "Bed not found" });
    }

    if (bed.patientId !== null) {
      console.error("Bed is already occupied by another patient:", bedId);
      return res.status(400).json({ msg: "Bed is already occupied" });
    }

    // Create patient with normalized data structure
    try {
      const result = await patientRepository.createPatient(patientData);

      // Update bed with new patient ID
      const [updatedCount] = await BedMySQL.update(
        { patientId: result.patient.id },
        { where: { id: bedId, patientId: null } }
      );

      if (updatedCount > 0) {
        return res.json({
          msg: "Bed assigned successfully",
          patientId: result.patient.id,
          patientNumber: result.patient.patientNumber,
          admissionId: result.admission.id,
        });
      } else {
        console.error("Failed to update the bed:", bedId);
        return res.status(400).json({ msg: "Failed to assign bed" });
      }
    } catch (error) {
      console.error("Error creating patient:", error);
      return res.status(500).json({
        msg: "Failed to create patient record",
        error: error.message,
      });
    }
  } catch (err) {
    console.error("assignBed Error:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
}

export async function deAssignBed(req, res) {
  try {
    const { bedId } = req.params;

    if (!bedId) {
      console.error("Bed ID is missing in request");
      return res.status(400).json({ msg: "Bed ID is required" });
    }

    const bed = await BedMySQL.findOne({ where: { id: bedId } });
    if (!bed) {
      console.error("Bed not found:", bedId);
      return res.status(404).json({ msg: "Bed not found" });
    }

    if (bed.patientId === null) {
      console.error("Bed is already unoccupied:", bedId);
      return res.status(400).json({ msg: "Bed is already unoccupied" });
    }

    // If we have an admission record for this patient, update its status
    if (bed.patientId) {
      try {
        const admissions = await Admission.findAll({
          where: {
            patientId: bed.patientId,
            status: "Active",
          },
          order: [["createdAt", "DESC"]],
        });

        if (admissions && admissions.length > 0) {
          const currentAdmission = admissions[0];
          await currentAdmission.update({
            status: "Discharged",
            dischargeDateTime: new Date(),
          });
        }
      } catch (error) {
        console.warn("Could not update admission status:", error.message);
        // Continue with bed deassignment even if admission update fails
      }
    }

    const [updatedCount] = await BedMySQL.update(
      { patientId: null },
      { where: { id: bedId } }
    );

    if (updatedCount > 0) {
      return res.json({ msg: "Bed deassigned successfully" });
    } else {
      console.error("Failed to update the bed:", bedId);
      return res.status(400).json({ msg: "Failed to deassign bed" });
    }
  } catch (err) {
    console.error("deAssignBed Error:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
}
