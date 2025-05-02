import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from "@mui/material";
import { Formik, Form } from "formik";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Contacts as ContactsIcon,
  Medication as MedicationIcon,
  Hotel as HotelIcon,
  UploadFile as UploadFileIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveStep,
  updateFormData,
  resetForm,
  setDialogOpen,
} from "../../../features/patients/patientSlice";

import FormSection from "./components/FormSection";
import {
  patientDetailsFields,
  emergencyContactFields,
  medicalInfoFields,
  admissionFields,
  documentUploadFields,
} from "./config/formFields";
import { validationSchema } from "./validationSchema";

const steps = [
  "Patient Details",
  "Emergency Contact",
  "Medical Information",
  "Admission Details",
  "Documents",
];

const PatientDialog = ({ handleSubmit }) => {
  const dispatch = useDispatch();
  const { activeStep, dialogOpen, selectedBed, formData } = useSelector(
    (state) => state.patient
  );
  const [submissionError, setSubmissionError] = useState(null);

  const handleNext = async (validateForm, values, setErrors) => {
    const currentStepFields = (() => {
      switch (activeStep) {
        case 0:
          return patientDetailsFields.map((field) => field.name);
        case 1:
          return emergencyContactFields.map((field) => field.name);
        case 2:
          return medicalInfoFields.map((field) => field.name);
        case 3:
          return admissionFields.map((field) => field.name);
        case 4:
          return documentUploadFields.map((field) => field.name);
        default:
          return [];
      }
    })();

    values.bedNumber = selectedBed?.bedNumber || values.bedNumber || "";

    const currentStepValues = {};
    currentStepFields.forEach((fieldName) => {
      currentStepValues[fieldName] = values[fieldName];
    });

    try {
      const errors = {};
      const validation = await validateForm();

      Object.keys(validation).forEach((key) => {
        if (currentStepFields.includes(key)) {
          errors[key] = validation[key];
        }
      });

      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
      }

      dispatch(setActiveStep(activeStep + 1));
    } catch (err) {
      console.error("[PatientDialog] Validation error:", err);
    }
  };

  const handleBack = () => {
    dispatch(setActiveStep(activeStep - 1));
  };

  const handleDialogClose = () => {
    dispatch(setDialogOpen(false));
    dispatch(resetForm());
  };

  const renderStepContent = (step, formProps) => {
    switch (step) {
      case 0:
        return (
          <FormSection
            icon={<PersonIcon color="primary" fontSize="large" />}
            title="Patient Details"
            fields={patientDetailsFields}
            formProps={formProps}
          />
        );
      case 1:
        return (
          <FormSection
            icon={<ContactsIcon color="primary" fontSize="large" />}
            title="Emergency Contact Information"
            fields={emergencyContactFields}
            formProps={formProps}
          />
        );
      case 2:
        return (
          <FormSection
            icon={<MedicationIcon color="primary" fontSize="large" />}
            title="Medical Information"
            fields={medicalInfoFields}
            formProps={formProps}
          />
        );
      case 3:
        return (
          <FormSection
            icon={<HotelIcon color="primary" fontSize="large" />}
            title="Admission Details"
            fields={admissionFields}
            formProps={formProps}
          />
        );
      case 4:
        return (
          <FormSection
            icon={<UploadFileIcon color="primary" fontSize="large" />}
            title="Document Upload"
            fields={documentUploadFields}
            formProps={formProps}
          />
        );
      default:
        return null;
    }
  };

  const initialValues = {
    ...formData,
    bedNumber: selectedBed?.bedNumber || "",
  };

  // Function to normalize form data before submission
  const normalizeFormData = (values) => {
    // Make sure bedId is included (required for the backend)
    const normalizedData = {
      ...values,
      bedId: selectedBed?.id,
    };

    // Convert dateOfBirth to ISO format if it exists
    if (normalizedData.dateOfBirth) {
      try {
        normalizedData.dateOfBirth = new Date(normalizedData.dateOfBirth)
          .toISOString()
          .split("T")[0];
      } catch (e) {
        console.error("Error formatting date of birth:", e);
      }
    }

    // Convert admissionDateTime to ISO format if it exists
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

  return (
    <Dialog
      open={dialogOpen && !!selectedBed}
      onClose={handleDialogClose}
      maxWidth="md"
      fullWidth
      disableRestoreFocus
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
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
        <Typography component="span" variant="h6" fontWeight="bold">
          Assign Patient to {selectedBed?.bedNumber}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleDialogClose}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, bgcolor: "#f5f8fa" }}>
        <Box sx={{ pt: 4, pb: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {submissionError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submissionError}
          </Alert>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            setSubmissionError(null);
            try {
              const normalizedData = normalizeFormData(values);
              dispatch(updateFormData(values)); // Update Redux store with user's input
              await handleSubmit(normalizedData); // Send normalized data to the backend
            } catch (error) {
              console.error("[PatientDialog] Form submission error:", error);
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
                {renderStepContent(activeStep, formikProps)}

                <Box sx={{ mt: 3, textAlign: "right" }}>
                  <Typography variant="caption" color="text.secondary">
                    * Required fields
                  </Typography>
                </Box>

                <DialogActions sx={{ mt: 4, px: 1, pb: 3 }}>
                  {activeStep > 0 && (
                    <Button
                      onClick={handleBack}
                      variant="outlined"
                      startIcon={<ArrowBackIcon />}
                      sx={{ borderRadius: 2, px: 3.5, py: 1.2, mr: 2 }}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    onClick={handleDialogClose}
                    variant="outlined"
                    color="secondary"
                    sx={{ borderRadius: 2, px: 3.5, py: 1.2, mr: 2 }}
                  >
                    Cancel
                  </Button>
                  {activeStep === steps.length - 1 ? (
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
                    >
                      Assign Patient
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="contained"
                      onClick={() =>
                        handleNext(
                          formikProps.validateForm,
                          formikProps.values,
                          formikProps.setErrors
                        )
                      }
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.2,
                        fontWeight: "medium",
                      }}
                    >
                      Next
                    </Button>
                  )}
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDialog;
