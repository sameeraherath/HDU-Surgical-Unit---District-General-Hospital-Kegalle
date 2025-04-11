import React from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { MuiTelInput } from "mui-tel-input";
import { CircularProgress } from "@mui/material";
import { toast } from "material-react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";

const nurseGrades = [
  "Student Nurse (Trainee Nurse)",
  "Registered Nurse (RN)",
  "Grade II Nursing Officer (Staff Nurse)",
  "Grade I Nursing Officer (Senior Staff Nurse)",
  "Supra Grade Nursing Officer (Supervisory Nurse)",
  "Nursing Sister (Ward Sister / In-Charge Nurse)",
  "Matron / Chief Nursing Officer (CNO)",
  "Director of Nursing Services",
  "Public Health Nursing Officer (PHNO)",
  "Midwife / Nurse Midwife",
  "School Health Nurse",
  "Occupational Health Nurse",
  "ICU / Critical Care Nurse",
];

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await dispatch(registerUser(values)).unwrap();
      toast.success("Registration successful");
      navigate("/login");
    } catch (err) {
      toast.error("Registration failed. Please try again.");
      console.error(err);
    }
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    registrationNumber: Yup.string().required(
      "Registration Number is required"
    ),
    ward: Yup.string().required("Ward is required"),
    mobileNumber: Yup.string().required("Mobile number is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    sex: Yup.string().required("Sex is required"),
    role: Yup.string().required("Role is required"),
    nameWithInitials: Yup.string().when("role", {
      is: (role) =>
        ["House Officer", "Medical Officer", "Consultant"].includes(role),
      then: (schema) => schema.required("Name with initials is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    speciality: Yup.string().when("role", {
      is: (role) =>
        ["House Officer", "Medical Officer", "Consultant"].includes(role),
      then: (schema) => schema.required("Speciality is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    grade: Yup.string().when("role", {
      is: "Nurse",
      then: (schema) => schema.required("Grade is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>

        <Formik
          initialValues={{
            username: "",
            password: "",
            nameWithInitials: "",
            registrationNumber: "",
            speciality: "",
            ward: "",
            mobileNumber: "",
            email: "",
            sex: "",
            grade: "",
            role: "Consultant",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, setFieldValue, isSubmitting }) => (
            <Form>
              <FormControl fullWidth margin="normal" sx={{ borderRadius: 3 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={values.role}
                  onChange={(e) => setFieldValue("role", e.target.value)}
                  label="Role"
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="Consultant">Consultant</MenuItem>
                  <MenuItem value="Medical Officer">Medical Officer</MenuItem>
                  <MenuItem value="House Officer">House Officer</MenuItem>
                  <MenuItem value="Nurse">Nurse</MenuItem>
                </Select>
              </FormControl>

              <Field
                as={TextField}
                label="Username"
                name="username"
                fullWidth
                margin="normal"
                required
                sx={{ borderRadius: 3 }}
                helperText={<ErrorMessage name="username" />}
                error={Boolean(<ErrorMessage name="username" />)}
              />

              <Field
                as={TextField}
                label="Password"
                type="password"
                name="password"
                fullWidth
                margin="normal"
                required
                sx={{ borderRadius: 3 }}
                helperText={<ErrorMessage name="password" />}
                error={Boolean(<ErrorMessage name="password" />)}
              />

              <Field
                as={TextField}
                label="Registration Number"
                name="registrationNumber"
                fullWidth
                margin="normal"
                required
                sx={{ borderRadius: 3 }}
                helperText={<ErrorMessage name="registrationNumber" />}
                error={Boolean(<ErrorMessage name="registrationNumber" />)}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Ward</InputLabel>
                <Select
                  name="ward"
                  value={values.ward}
                  onChange={handleChange}
                  label="Ward"
                  required
                >
                  <MenuItem value="Side A">Side A</MenuItem>
                  <MenuItem value="Side B">Side B</MenuItem>
                </Select>
              </FormControl>

              <Box className="pt-4 pb-4">
                <MuiTelInput
                  value={values.mobileNumber}
                  onChange={(value) => setFieldValue("mobileNumber", value)}
                  label="Mobile Number"
                  defaultCountry="LK"
                  forceCallingCode
                  fullWidth
                  required
                />
              </Box>

              <Field
                as={TextField}
                label="Email"
                name="email"
                fullWidth
                margin="normal"
                required
                sx={{ borderRadius: 3 }}
                helperText={<ErrorMessage name="email" />}
                error={Boolean(<ErrorMessage name="email" />)}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Sex</InputLabel>
                <Select
                  name="sex"
                  value={values.sex}
                  onChange={handleChange}
                  label="Sex"
                  required
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>

              {(values.role === "House Officer" ||
                values.role === "Medical Officer" ||
                values.role === "Consultant") && (
                <>
                  <Field
                    as={TextField}
                    label="Name With Initials"
                    name="nameWithInitials"
                    fullWidth
                    margin="normal"
                    required
                    sx={{ borderRadius: 3 }}
                    helperText={<ErrorMessage name="nameWithInitials" />}
                    error={Boolean(<ErrorMessage name="nameWithInitials" />)}
                  />

                  <Field
                    as={TextField}
                    label="Speciality"
                    name="speciality"
                    fullWidth
                    margin="normal"
                    required
                    sx={{ borderRadius: 3 }}
                    helperText={<ErrorMessage name="speciality" />}
                    error={Boolean(<ErrorMessage name="speciality" />)}
                  />
                </>
              )}

              {values.role === "Nurse" && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Grade</InputLabel>
                  <Select
                    name="grade"
                    value={values.grade}
                    onChange={handleChange}
                    label="Grade"
                    required
                  >
                    {nurseGrades.map((grade) => (
                      <MenuItem key={grade} value={grade}>
                        {grade}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  mt: 2,
                  borderRadius: 3,
                  boxShadow: 2,
                  ":hover": { boxShadow: 4 },
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Register"}
              </Button>
            </Form>
          )}
        </Formik>

        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <MuiLink component={Link} to="/login" underline="hover">
            Login here
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
