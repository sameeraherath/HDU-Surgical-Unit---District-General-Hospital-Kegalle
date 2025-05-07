import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDialogOpen } from "../../../features/patients/patientSlice";

const PatientDialog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(setDialogOpen(true));
    navigate("/nurse-dashboard/patient-assignment");
  }, [dispatch, navigate]);

  return null;
};

export default PatientDialog;
