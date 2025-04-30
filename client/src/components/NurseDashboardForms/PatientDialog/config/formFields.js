export const patientDetailsFields = [
  {
    name: "patientId",
    label: "Patient ID",
    type: "text",
    disabled: true,
    gridProps: { xs: 12, sm: 6 },
  },
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    required: true,
    gridProps: { xs: 12, sm: 6 },
    validation: {
      required: "Full name is required",
    },
  },
  {
    name: "nicPassport",
    label: "NIC / Passport Number",
    type: "text",
    required: true,
    gridProps: { xs: 12, sm: 6 },
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    type: "date",
    required: true,
    gridProps: { xs: 12, sm: 6 },
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    required: true,
    gridProps: { xs: 12, sm: 3 },
    validation: {
      min: { value: 0, message: "Age must be positive" },
      max: { value: 150, message: "Invalid age" },
    },
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["Male", "Female", "Other"],
    required: true,
    gridProps: { xs: 12, sm: 3 },
  },
  {
    name: "maritalStatus",
    label: "Marital Status",
    type: "select",
    options: ["Single", "Married", "Divorced", "Widowed"],
    gridProps: { xs: 12, sm: 6 },
  },
  {
    name: "contactNumber",
    label: "Contact Number",
    type: "tel",
    required: true,
    gridProps: { xs: 12, sm: 6 },
  },
  {
    name: "email",
    label: "Email (if available)",
    type: "email",
    gridProps: { xs: 12, sm: 6 },
  },
];

export const emergencyContactFields = [
  {
    name: "emergencyContactName",
    label: "Emergency Contact Name",
    type: "text",
    required: true,
    gridProps: { xs: 12, sm: 6 },
  },
  {
    name: "emergencyContactRelationship",
    label: "Emergency Contact Relationship",
    type: "select",
    options: ["Spouse", "Parent", "Child", "Friend", "Other"],
    required: true,
    gridProps: { xs: 12, sm: 6 },
  },
  {
    name: "emergencyContactNumber",
    label: "Emergency Contact Number",
    type: "tel",
    required: true,
    gridProps: { xs: 12, sm: 6 },
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    multiline: true,
    rows: 3,
    required: true,
    gridProps: { xs: 12 },
  },
];

export const medicalInfoFields = [
  {
    name: "knownAllergies",
    label: "Known Allergies",
    type: "text",
    multiline: true,
    rows: 2,
    gridProps: { xs: 12 },
  },
  {
    name: "medicalHistory",
    label: "Medical History",
    type: "text",
    multiline: true,
    rows: 3,
    gridProps: { xs: 12 },
  },
  {
    name: "currentMedications",
    label: "Current Medications",
    type: "text",
    multiline: true,
    rows: 2,
    gridProps: { xs: 12 },
  },
  {
    name: "pregnancyStatus",
    label: "Pregnancy Status (if applicable)",
    type: "select",
    options: ["Not Applicable", "Pregnant", "Not Pregnant"],
    gridProps: { xs: 12, sm: 6 },
  },
  {
    name: "bloodType",
    label: "Blood Type",
    type: "select",
    options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    gridProps: { xs: 12, sm: 6 },
  },
];

export const admissionFields = [
  {
    name: "admissionDateTime",
    label: "Admission Date & Time",
    type: "datetime-local",
    required: true,
    gridProps: { xs: 12, sm: 6 },
  },
  {
    name: "department",
    label: "Department / Ward",
    type: "select",
    options: ["ICU", "Surgery", "Medical"],
    required: true,
    gridProps: { xs: 12, sm: 6 },
  },
  {
    name: "bedNumber",
    label: "Bed Number",
    type: "text",
    disabled: true,
    required: true,
    gridProps: { xs: 12, sm: 6 },
  },
  {
    name: "initialDiagnosis",
    label: "Initial Diagnosis",
    type: "text",
    multiline: true,
    rows: 3,
    required: true,
    gridProps: { xs: 12 },
  },
  {
    name: "consultantInCharge",
    label: "Consultant In Charge",
    type: "text",
    required: true,
    gridProps: { xs: 12, sm: 6 },
  },
];

export const documentUploadFields = [
  {
    name: "medicalReports",
    label: "Upload Medical Reports",
    type: "file",
    accept: ".pdf,.doc,.docx",
    multiple: true,
    gridProps: { xs: 12 },
  },
  {
    name: "idProof",
    label: "Upload ID Proof",
    type: "file",
    accept: ".pdf,.jpg,.jpeg,.png",
    gridProps: { xs: 12 },
  },
  {
    name: "consentForm",
    label: "Upload Consent Form",
    type: "file",
    accept: ".pdf",
    gridProps: { xs: 12 },
  },
];
