import { useAuth } from "../../context/useAuth";
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
import { toast } from "material-react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const showToast = (message, type) => {
    if (type === "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    if (type === "error") {
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
    nameWithInitials: Yup.string().when("role", {
      is: (role) =>
        role === "House Officer" ||
        role === "Medical Officer" ||
        role === "Consultant",
      then: Yup.string().required("Name with initials is required"),
    }),
    speciality: Yup.string().when("role", {
      is: (role) =>
        role === "House Officer" ||
        role === "Medical Officer" ||
        role === "Consultant",
      then: Yup.string().required("Speciality is required"),
    }),
    grade: Yup.string().when("role", {
      is: "Nurse",
      then: Yup.string().required("Grade is required"),
    }),
  });

  const handleSubmit = async (values) => {
    try {
      await register(values);
      showToast("Registration successful", "success");
      navigate("/login");
    } catch (err) {
      console.log("🚀 ~ handleSubmit ~ err:", err);
      showToast("Registration failed. Please try again.", "error");
    }
  };

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
          {({ values, handleChange, setFieldValue }) => (
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
                variant="outlined"
                fullWidth
                margin="normal"
                name="username"
                required
                sx={{ borderRadius: 3 }}
                helperText={<ErrorMessage name="username" />}
                error={Boolean(<ErrorMessage name="username" />)}
              />

              <Field
                as={TextField}
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                name="password"
                required
                sx={{ borderRadius: 3 }}
                helperText={<ErrorMessage name="password" />}
                error={Boolean(<ErrorMessage name="password" />)}
              />

              <Field
                as={TextField}
                label="Registration Number"
                variant="outlined"
                fullWidth
                margin="normal"
                name="registrationNumber"
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
                variant="outlined"
                fullWidth
                margin="normal"
                name="email"
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

              {values.role === "House Officer" ||
              values.role === "Medical Officer" ||
              values.role === "Consultant" ? (
                <>
                  <Field
                    as={TextField}
                    label="Name With Initials"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="nameWithInitials"
                    required
                    sx={{ borderRadius: 3 }}
                    helperText={<ErrorMessage name="nameWithInitials" />}
                    error={Boolean(<ErrorMessage name="nameWithInitials" />)}
                  />

                  <Field
                    as={TextField}
                    label="Speciality"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="speciality"
                    required
                    sx={{ borderRadius: 3 }}
                    helperText={<ErrorMessage name="speciality" />}
                    error={Boolean(<ErrorMessage name="speciality" />)}
                  />
                </>
              ) : null}

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
                    <MenuItem value="Student Nurse (Trainee Nurse)">
                      Student Nurse (Trainee Nurse)
                    </MenuItem>
                    <MenuItem value="Registered Nurse (RN)">
                      Registered Nurse (RN)
                    </MenuItem>
                    <MenuItem value="Grade II Nursing Officer (Staff Nurse)">
                      Grade II Nursing Officer (Staff Nurse)
                    </MenuItem>
                    <MenuItem value="Grade I Nursing Officer (Senior Staff Nurse)">
                      Grade I Nursing Officer (Senior Staff Nurse)
                    </MenuItem>
                    <MenuItem value="Supra Grade Nursing Officer (Supervisory Nurse)">
                      Supra Grade Nursing Officer (Supervisory Nurse)
                    </MenuItem>
                    <MenuItem value="Nursing Sister (Ward Sister / In-Charge Nurse)">
                      Nursing Sister (Ward Sister / In-Charge Nurse)
                    </MenuItem>
                    <MenuItem value="Matron / Chief Nursing Officer (CNO)">
                      Matron / Chief Nursing Officer (CNO)
                    </MenuItem>
                    <MenuItem value="Director of Nursing Services">
                      Director of Nursing Services
                    </MenuItem>
                    <MenuItem value="Public Health Nursing Officer (PHNO)">
                      Public Health Nursing Officer (PHNO)
                    </MenuItem>
                    <MenuItem value="Midwife / Nurse Midwife">
                      Midwife / Nurse Midwife
                    </MenuItem>
                    <MenuItem value="School Health Nurse">
                      School Health Nurse
                    </MenuItem>
                    <MenuItem value="Occupational Health Nurse">
                      Occupational Health Nurse
                    </MenuItem>
                    <MenuItem value="ICU / Critical Care Nurse">
                      ICU / Critical Care Nurse
                    </MenuItem>
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
              >
                Register
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
