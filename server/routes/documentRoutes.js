import express from "express";
import {
  upload,
  uploadPatientDocuments,
  getPatientDocuments,
} from "../controllers/documentController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateJWT);

router.post(
  "/patients/:patientId/documents",
  upload.fields([
    { name: "medicalReports" },
    { name: "idProof", maxCount: 1 },
    { name: "consentForm", maxCount: 1 },
  ]),
  uploadPatientDocuments
);

router.get("/patients/:patientId/documents", getPatientDocuments);

export default router;
