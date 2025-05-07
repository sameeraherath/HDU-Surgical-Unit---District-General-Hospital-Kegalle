import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../config/cloudinary.js";
import { PatientDocument, sequelize } from "../config/mysqlDB.js";

const storage = multer.memoryStorage();

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

const uploadToCloudinary = async (file, folder) => {
  return new Promise((resolve, reject) => {
    const fileStr = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;

    cloudinary.uploader.upload(
      fileStr,
      {
        folder: `patient-documents/${folder}`,
        resource_type: "auto",
        public_id: `${uuidv4()}-${path.parse(file.originalname).name}`,
      },
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      }
    );
  });
};

export const uploadPatientDocuments = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const patientExists = await sequelize.query(
      "SELECT id FROM patients WHERE id = ?",
      {
        replacements: [patientId],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!patientExists || patientExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${patientId} not found. Please ensure the patient exists before uploading documents.`,
      });
    }

    const documentResults = [];

    for (const [fieldName, files] of Object.entries(req.files)) {
      const documentType =
        fieldName === "medicalReports"
          ? "MedicalReport"
          : fieldName === "idProof"
          ? "IdProof"
          : fieldName === "consentForm"
          ? "ConsentForm"
          : "Other";

      const fileList = Array.isArray(files) ? files : [files];

      for (const file of fileList) {
        try {
          const cloudinaryResult = await uploadToCloudinary(
            file,
            documentType.toLowerCase()
          );

          const document = await PatientDocument.create({
            patientId,
            documentType,
            fileUrl: cloudinaryResult.secure_url,
            fileName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            uploadedBy: req.user?.id || null,
          });

          documentResults.push({
            id: document.id,
            documentType,
            fileName: file.originalname,
            fileUrl: cloudinaryResult.secure_url,
            fileSize: file.size,
          });
        } catch (uploadError) {
          console.error(
            `Error uploading file ${file.originalname} to Cloudinary: ${uploadError.message}`
          );
          return res.status(500).json({
            success: false,
            message: `Failed to upload file ${file.originalname}`,
            error: uploadError.message,
          });
        }
      }
    }

    if (documentResults.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload any documents",
      });
    }

    res.status(200).json({
      success: true,
      message: "Documents uploaded successfully",
      documents: documentResults,
    });
  } catch (error) {
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

    const documents = await PatientDocument.findAll({
      where: { patientId },
      order: [["createdAt", "DESC"]],
    });

    if (!documents || documents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No documents found for this patient",
      });
    }

    res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve patient documents",
      error: error.message,
    });
  }
};
