import React from "react";
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

  console.log("[PatientDialog] Dialog rendered with state:", {
    activeStep,
    dialogOpen,
    selectedBedId: selectedBed?.id,
    selectedBedNumber: selectedBed?.bedNumber,
  });

  const handleNext = async (validateForm, values, setErrors) => {
    console.log(
      "[PatientDialog] Attempting to move to next step:",
      activeStep + 1
    );
    console.log("[PatientDialog] Current form values:", values);

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

    console.log(
      "[PatientDialog] Fields to validate in this step:",
      currentStepFields
    );

    values.bedNumber = selectedBed?.bedNumber || values.bedNumber || "";

    const currentStepValues = {};
    currentStepFields.forEach((fieldName) => {
      currentStepValues[fieldName] = values[fieldName];
    });

    console.log(
      "[PatientDialog] currentStepValues to be validated:",
      currentStepValues
    );

    try {
      const errors = {};
      const validation = await validateForm();
      console.log("[PatientDialog] Validation result:", validation);

      Object.keys(validation).forEach((key) => {
        if (currentStepFields.includes(key)) {
          errors[key] = validation[key];
        }
      });

      if (Object.keys(errors).length > 0) {
        console.error("[PatientDialog] Validation errors found:", errors);
        setErrors(errors);
        return;
      }

      console.log(
        "[PatientDialog] Step validation successful, moving to step:",
        activeStep + 1
      );
      dispatch(setActiveStep(activeStep + 1));
    } catch (err) {
      console.error("[PatientDialog] Validation error:", err);
    }
  };

  const handleBack = () => {
    console.log(
      "[PatientDialog] Moving back from step:",
      activeStep,
      "to step:",
      activeStep - 1
    );
    dispatch(setActiveStep(activeStep - 1));
  };

  const handleDialogClose = () => {
    console.log("[PatientDialog] Closing dialog and resetting form");
    dispatch(setDialogOpen(false));
    dispatch(resetForm());
  };

  const renderStepContent = (step, formProps) => {
    console.log("[PatientDialog] Rendering content for step:", step);
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

  console.log("[PatientDialog] Initial form values:", initialValues);

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

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            console.log("[PatientDialog] Submitting form with values:", values);
            setSubmitting(true);
            try {
              dispatch(updateFormData(values)); // Only update Redux on submit
              await handleSubmit(values);
              console.log("[PatientDialog] Form submission successful");
            } catch (error) {
              console.error("[PatientDialog] Form submission error:", error);
            } finally {
              setSubmitting(false);
            }
          }}
          enableReinitialize
        >
          {(formikProps) => {
            console.log("[PatientDialog] Formik props:", {
              dirty: formikProps.dirty,
              isValid: formikProps.isValid,
              errorCount: Object.keys(formikProps.errors).length,
            });
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
