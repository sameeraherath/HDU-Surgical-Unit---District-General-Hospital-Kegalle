import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/system";
import HotelIcon from "@mui/icons-material/Hotel";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CriticalFactorsForm from "./CriticalFactorsForm";

const StyledCard = styled(Card)(({ occupied }) => ({
  width: "100%",
  height: "280px",
  backgroundColor: occupied ? "#ffd1d1" : "#d1ffd1",
  cursor: "pointer",
  borderRadius: "16px",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.12)",
  transition: "all 0.3s ease",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
  },
}));

const BedCard = ({ bed, assignBed, deassignBed }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [bedToDeassign, setBedToDeassign] = React.useState(null);
  const [openVitalsForm, setOpenVitalsForm] = React.useState(false);

  const isOccupied = bed.patientId !== null;

  const handleDeassignClick = (bed) => {
    setBedToDeassign(bed);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setBedToDeassign(null);
  };

  const handleConfirmDeassign = () => {
    if (bedToDeassign) {
      deassignBed(bedToDeassign.id);
    }
    handleCloseModal();
  };

  const handleRecordVitalsClick = () => {
    if (bed.patientId) {
      setOpenVitalsForm(true);
    } else {
      console.warn("No patient assigned to this bed to record vitals.");
    }
  };

  const handleCloseVitalsForm = () => {
    setOpenVitalsForm(false);
  };

  return (
    <>
      <StyledCard occupied={isOccupied.toString()}>
        <CardContent sx={{ 
          padding: "20px", 
          height: "100%", 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          {/* Header Section */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              color="textPrimary"
              fontWeight="700"
              sx={{ fontSize: "1.4rem" }}
            >
              Bed {bed.bedNumber}
            </Typography>
          </Box>

          {/* Content Section */}
          {isOccupied && bed.patientId ? (
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              {/* Patient Info */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ 
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}
                >
                  Patient ID: {bed.patientId}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    borderRadius: "12px",
                    backgroundColor: "error.main",
                    color: "white",
                    paddingY: 1.5,
                    boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.15)",
                    "&:hover": {
                      backgroundColor: "error.dark",
                      transform: "translateY(-1px)",
                      boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.2)",
                    },
                    transition: "all 0.2s ease",
                  }}
                  startIcon={<RemoveIcon />}
                  onClick={() => handleDeassignClick(bed)}
                >
                  Deassign Patient
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    borderRadius: "12px",
                    backgroundColor: "success.main",
                    color: "white",
                    paddingY: 1.5,
                    boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.15)",
                    "&:hover": {
                      backgroundColor: "success.dark",
                      transform: "translateY(-1px)",
                      boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.2)",
                    },
                    transition: "all 0.2s ease",
                    animation: bed.criticalStatus
                      ? "pulse 1.5s infinite"
                      : "none",
                    "@keyframes pulse": {
                      "0%": {
                        boxShadow: "0 0 0 0 rgba(0, 200, 0, 0.7)",
                      },
                      "70%": {
                        boxShadow: "0 0 0 10px rgba(0, 200, 0, 0)",
                      },
                      "100%": {
                        boxShadow: "0 0 0 0 rgba(0, 200, 0, 0)",
                      },
                    },
                  }}
                  startIcon={<AssignmentIcon />}
                  onClick={handleRecordVitalsClick}
                >
                  Record Vitals
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 3 }}>
              {/* Available Status */}
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ 
                    fontSize: "1rem",
                    fontWeight: "500",
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    border: "2px dashed rgba(0, 0, 0, 0.1)"
                  }}
                >
                  No patient assigned
                </Typography>
              </Box>

              {/* Assign Button */}
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: "600",
                  borderRadius: "12px",
                  backgroundColor: "success.main",
                  color: "white",
                  paddingX: 4,
                  paddingY: 2,
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                  "&:hover": {
                    backgroundColor: "success.dark",
                    transform: "translateY(-2px)",
                    boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
                  },
                  transition: "all 0.2s ease",
                  minWidth: "140px",
                }}
                startIcon={<HotelIcon />}
                onClick={() => assignBed(bed)}
              >
                Assign Patient
              </Button>
            </Box>
          )}
        </CardContent>

        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              bgcolor: "primary.light",
              color: "text.primary",
              textAlign: "center",
              padding: "16px",
            }}
          >
            <Typography variant="h6" component="div" fontWeight="600">
              Confirm Deassign
            </Typography>
          </DialogTitle>

          <DialogContent
            sx={{ textAlign: "center", padding: "24px", marginTop: "20px" }}
          >
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", fontWeight: "400" }}
            >
              Are you sure you want to deassign this bed from Patient ID{" "}
              <strong>{bedToDeassign?.patientId}</strong>?
            </Typography>
          </DialogContent>

          <DialogActions
            sx={{ justifyContent: "center", padding: "16px 24px" }}
          >
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              color="primary"
              sx={{
                marginRight: 2,
                padding: "8px 20px",
                fontWeight: "600",
                borderColor: "primary.main",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDeassign}
              variant="contained"
              color="error"
              sx={{
                padding: "8px 20px",
                fontWeight: "600",
                backgroundColor: "#ff6f61",
                "&:hover": {
                  backgroundColor: "#ff3d2d",
                },
              }}
            >
              Confirm Deassign
            </Button>
          </DialogActions>
        </Dialog>
      </StyledCard>

      {isOccupied && bed.patientId && (
        <CriticalFactorsForm
          open={openVitalsForm}
          onClose={handleCloseVitalsForm}
          patientId={bed.patientId}
          bedNumber={bed.bedNumber}
        />
      )}
    </>
  );
};

export default BedCard;
