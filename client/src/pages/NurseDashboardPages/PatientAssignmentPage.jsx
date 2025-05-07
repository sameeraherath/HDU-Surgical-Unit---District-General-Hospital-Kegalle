import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  IconButton,
  Alert,
  Paper,
  Container,
  Divider,
} from "@mui/material";
import { Formik, Form } from "formik";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Contacts as ContactsIcon,
  Medication as MedicationIcon,
  Hotel as HotelIcon,
  UploadFile as UploadFileIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFormData,
  resetForm,
} from "../../features/patients/patientSlice";
import { uploadPatientDocuments } from "../../api/documentApi";

import FormSection from "../../components/NurseDashboardForms/PatientDialog/components/FormSection";
import {
  patientDetailsFields,
  emergencyContactFields,
  medicalInfoFields,
  admissionFields,
  documentUploadFields,
} from "../../components/NurseDashboardForms/PatientDialog/config/formFields";
import { validationSchema } from "../../components/NurseDashboardForms/PatientDialog/validationSchema";

const PatientAssignmentPage = ({ handleSubmit, onClose }) => {
  const dispatch = useDispatch();
  const { selectedBed, formData } = useSelector((state) => state.patient);
  const [submissionError, setSubmissionError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleCancel = () => {
    dispatch(resetForm());
    if (onClose) onClose();
  };

  const initialValues = {
    ...formData,
    bedNumber: selectedBed?.bedNumber || "",
  };

  const normalizeFormData = (values) => {
    const normalizedData = {
      ...values,
      bedId: selectedBed?.id,
    };

    if (normalizedData.dateOfBirth) {
      try {
        normalizedData.dateOfBirth = new Date(normalizedData.dateOfBirth)
          .toISOString()
          .split("T")[0];
      } catch (e) {
        console.error("Error formatting date of birth:", e);
      }
    }

    if (normalizedData.admissionDateTime) {
      try {
        normalizedData.admissionDateTime = new Date(
          normalizedData.admissionDateTime
        ).toISOString();
      } catch (e) {
        console.error("Error formatting admission date time:", e);
      }
    }

    return normalizedData;
  };

  const hasDocuments = (fileData) => {
    return (
      (fileData.medicalReports && fileData.medicalReports.length > 0) ||
      fileData.idProof ||
      fileData.consentForm
    );
  };

  const processDocumentUploads = async (patientId, fileData) => {
    if (!hasDocuments(fileData)) return;

    console.log("Starting document upload process for patient ID:", patientId);
    console.log("Documents to upload:", {
      medicalReports: fileData.medicalReports?.length || 0,
      idProof: fileData.idProof ? "Yes" : "No",
      consentForm: fileData.consentForm ? "Yes" : "No",
    });

    setUploadStatus("uploading");
    try {
      const documentsToUpload = {};

      if (fileData.medicalReports && fileData.medicalReports.length > 0) {
        documentsToUpload.medicalReports = fileData.medicalReports;
      }

      if (fileData.idProof) {
        documentsToUpload.idProof = fileData.idProof;
      }

      if (fileData.consentForm) {
        documentsToUpload.consentForm = fileData.consentForm;
      }

      console.log("Sending documents to server:", documentsToUpload);

      if (Object.keys(documentsToUpload).length === 0) {
        console.log("No documents to upload, skipping API call");
        setUploadStatus("success");
        return;
      }

      const response = await uploadPatientDocuments(
        patientId,
        documentsToUpload
      );
      console.log("Document upload response:", response);
      setUploadStatus("success");
    } catch (error) {
      console.error("Document upload error:", error);
      setUploadStatus("error");
    }
  };

  if (!selectedBed) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, mt: 4, borderRadius: 2 }}>
          <Typography variant="h6" align="center">
            No bed selected. Please select a bed first.
          </Typography>
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button variant="contained" onClick={handleCancel}>
              Return to Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ borderRadius: 2, overflow: "hidden", mb: 4 }}>
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            py: 2.5,
            px: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography component="h1" variant="h6" fontWeight="bold">
            Assign Patient to {selectedBed?.bedNumber}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCancel}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 4, bgcolor: "#f5f8fa" }}>
          {submissionError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submissionError}
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Patient was created successfully, but there was an issue uploading
              documents. You can upload documents later from the patient details
              page.
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              setSubmissionError(null);
              try {
                const {
                  medicalReports,
                  idProof,
                  consentForm,
                  ...serializableValues
                } = values;

                const fileData = {
                  medicalReports,
                  idProof,
                  consentForm,
                };

                dispatch(updateFormData(serializableValues));

                const normalizedData = normalizeFormData(values);
                const patientResponse = await handleSubmit(normalizedData);

                if (
                  patientResponse &&
                  patientResponse.patientId &&
                  hasDocuments(fileData)
                ) {
                  console.log(
                    "Patient created with ID:",
                    patientResponse.patientId
                  );
                  await processDocumentUploads(
                    patientResponse.patientId,
                    fileData
                  );
                } else {
                  console.log(
                    "Patient created, but no documents to upload or invalid response:",
                    patientResponse
                  );
                  if (!patientResponse?.patientId) {
                    console.error(
                      "Missing patient ID in response:",
                      patientResponse
                    );
                  }
                }
              } catch (error) {
                console.error(
                  "[PatientAssignmentPage] Form submission error:",
                  error
                );
                setSubmissionError(
                  "An error occurred while submitting the form. Please try again."
                );
              } finally {
                setSubmitting(false);
              }
            }}
            enableReinitialize
          >
            {(formikProps) => {
              return (
                <Form>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ mb: 3, fontWeight: "bold" }}
                  >
                    Patient Information Form
                  </Typography>

                  <Divider sx={{ mb: 4 }} />

                  <FormSection
                    icon={<PersonIcon color="primary" fontSize="large" />}
                    title="Patient Details"
                    fields={patientDetailsFields}
                    formProps={formikProps}
                  />

                  <FormSection
                    icon={<ContactsIcon color="primary" fontSize="large" />}
                    title="Emergency Contact Information"
                    fields={emergencyContactFields}
                    formProps={formikProps}
                  />

                  <FormSection
                    icon={<MedicationIcon color="primary" fontSize="large" />}
                    title="Medical Information"
                    fields={medicalInfoFields}
                    formProps={formikProps}
                  />

                  <FormSection
                    icon={<HotelIcon color="primary" fontSize="large" />}
                    title="Admission Details"
                    fields={admissionFields}
                    formProps={formikProps}
                  />

                  <FormSection
                    icon={<UploadFileIcon color="primary" fontSize="large" />}
                    title="Document Upload"
                    fields={documentUploadFields}
                    formProps={formikProps}
                  />

                  {uploadStatus === "uploading" && (
                    <Alert severity="info" sx={{ mt: 2, mb: 1 }}>
                      Uploading patient documents to server...
                    </Alert>
                  )}

                  {uploadStatus === "success" && (
                    <Alert severity="success" sx={{ mt: 2, mb: 1 }}>
                      Documents uploaded successfully!
                    </Alert>
                  )}

                  <Box sx={{ mt: 3, textAlign: "right" }}>
                    <Typography variant="caption" color="text.secondary">
                      * Required fields
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 4,
                      px: 1,
                      pb: 3,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      onClick={handleCancel}
                      variant="outlined"
                      color="secondary"
                      sx={{ borderRadius: 2, px: 3.5, py: 1.2, mr: 2 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.2,
                        fontWeight: "medium",
                      }}
                      disabled={formikProps.isSubmitting}
                    >
                      Assign Patient
                    </Button>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Paper>
    </Container>
  );
};

export default PatientAssignmentPage;
