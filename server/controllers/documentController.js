import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, DOC, DOCX, JPEG, and PNG files are allowed."
      ),
      false
    );
  }
};
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

export const uploadPatientDocuments = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const documentResults = [];

    for (const file of req.files) {
      const documentType =
        file.fieldname === "medicalReports"
          ? "MedicalReport"
          : file.fieldname === "idProof"
          ? "IdProof"
          : file.fieldname === "consentForm"
          ? "ConsentForm"
          : "Other";

      const { PatientDocument } = req.db.models;

      const document = await PatientDocument.create({
        patientId,
        documentType,
        fileUrl: `/uploads/${file.filename}`,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        uploadedBy: req.user?.id || null,
      });

      documentResults.push({
        id: document.id,
        documentType,
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        fileSize: file.size,
      });
    }

    res.status(200).json({
      success: true,
      message: "Documents uploaded successfully",
      documents: documentResults,
    });
  } catch (error) {
    console.error("Error uploading documents:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload documents",
      error: error.message,
    });
  }
};

export const getPatientDocuments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { PatientDocument } = req.db.models;

    const documents = await PatientDocument.findAll({
      where: { patientId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("Error fetching patient documents:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient documents",
      error: error.message,
    });
  }
};
