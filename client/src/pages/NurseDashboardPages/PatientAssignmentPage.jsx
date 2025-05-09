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
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFormData,
  resetForm,
} from "../../features/patients/patientSlice";
import { setLoading } from "../../features/loaderSlice";
import { uploadPatientDocuments } from "../../api/documentApi";

import FormSection from "../../components/NurseDashboardForms/PatientDialog/components/FormSection";
import DocumentUpload from "../../components/NurseDashboardForms/PatientDialog/components/DocumentUpload";
import {
  patientDetailsFields,
  emergencyContactFields,
  medicalInfoFields,
  admissionFields,
} from "../../components/NurseDashboardForms/PatientDialog/config/formFields";
import { validationSchema } from "../../components/NurseDashboardForms/PatientDialog/validationSchema";

const PatientAssignmentPage = ({ handleSubmit, onClose }) => {
  const dispatch = useDispatch();
  const { selectedBed, formData } = useSelector((state) => state.patient);
  const [submissionError, setSubmissionError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const handleCancel = () => {
    dispatch(resetForm());
    dispatch(setLoading(false));
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

    setUploadStatus("uploading");
    dispatch(setLoading(true));
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
        dispatch(setLoading(false));
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
    } finally {
      dispatch(setLoading(false));
    }
  };

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
              dispatch(setLoading(true));
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
                dispatch(setLoading(false));
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
                  />{" "}
                  <FormSection
                    icon={<HotelIcon color="primary" fontSize="large" />}
                    title="Admission Details"
                    fields={admissionFields}
                    formProps={formikProps}
                  />
                  <DocumentUpload
                    formProps={formikProps}
                    uploadStatus={uploadStatus}
                  />
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
                      sx={{
                        borderRadius: 2,
                        px: 3.5,
                        py: 1.2,
                        mr: 2,
                        textTransform: "none",
                      }}
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
                        textTransform: "none",
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
