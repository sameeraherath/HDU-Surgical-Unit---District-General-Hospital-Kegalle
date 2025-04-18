import * as Yup from "yup";

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  age: Yup.number().required("Age is required").positive().integer(),
  birthDate: Yup.date().required("Birth Date is required"),
  sex: Yup.string().required("Sex is required"),
  contactDetails: Yup.string().required("Contact Details are required"),
  condition: Yup.string().required("Condition is required"),
  admitDateTime: Yup.date().required("Admit Date & Time are required"),
  frequencyMeasure: Yup.string().required("Frequency Measure is required"),
});

export default validationSchema;
