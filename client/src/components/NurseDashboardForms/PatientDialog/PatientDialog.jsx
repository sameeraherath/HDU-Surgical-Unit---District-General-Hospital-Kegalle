import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import { Formik, Form } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

import { useDispatch } from "react-redux";
import { setAlert } from "../../../features/alerts/alertsSlice";

import FormField from "./FormField";
import SectionHeader from "./SectionHeader";
import validationSchema from "./validationSchema";

const PatientDialog = ({ open, handleClose, handleSubmit, selectedBed }) => {
  const dispatch = useDispatch();

  const initialValues = {
    fullName: "",
    age: "",
    birthDate: "",
    sex: "",
    contactDetails: "",
    condition: "",
    admitDateTime: "",
    frequencyMeasure: "",
  };

  return (
    <Dialog
      open={open && !!selectedBed}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 2,
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
          onClick={handleClose}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: "#f5f8fa" }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            await handleSubmit(values);
            dispatch(
              setAlert({
                message: "Patient assigned successfully!",
                type: "success",
              })
            );
            alert;
            actions.resetForm();
            handleClose();
          }}
        >
          {({ errors, touched, handleChange, handleBlur }) => (
            <Form>
              <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <SectionHeader
                  icon={<PersonIcon color="primary" />}
                  title="Patient Information"
                />
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormField
                      name="fullName"
                      label="Full Name"
                      touched={touched}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormField
                      name="age"
                      label="Age"
                      type="number"
                      touched={touched}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormField
                      name="birthDate"
                      label="Birth Date"
                      type="date"
                      touched={touched}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormField
                      name="sex"
                      label="Sex"
                      select
                      options={["Male", "Female", "Other"]}
                      touched={touched}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormField
                      name="contactDetails"
                      label="Contact Details"
                      touched={touched}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <SectionHeader
                  icon={<LocalHospitalIcon color="primary" />}
                  title="Medical Details"
                />
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormField
                      name="condition"
                      label="Condition"
                      multiline
                      rows={3}
                      touched={touched}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormField
                      name="admitDateTime"
                      label="Admit Date & Time"
                      type="datetime-local"
                      touched={touched}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormField
                      name="frequencyMeasure"
                      label="Frequency Measure"
                      select
                      options={["Red", "Green", "Blue", "Yellow", "Brown"]}
                      touched={touched}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Box sx={{ mt: 2, textAlign: "right" }}>
                <Typography variant="caption" color="text.secondary">
                  * Required fields
                </Typography>
              </Box>

              <DialogActions sx={{ mt: 3, px: 0 }}>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  color="secondary"
                  sx={{ borderRadius: 2, px: 3, py: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 2, px: 4, py: 1, fontWeight: "medium" }}
                >
                  Assign Patient
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDialog;
