import express from "express";
import {
  upload,
  uploadPatientDocuments,
} from "../controllers/documentController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateJWT);

router.post(
  "/patients/:patientId/documents",
  upload.fields([
    { name: "medicalReports", maxCount: 5 },
    { name: "idProof", maxCount: 1 },
    { name: "consentForm", maxCount: 1 },
  ]),
  uploadPatientDocuments
);

export default router;
