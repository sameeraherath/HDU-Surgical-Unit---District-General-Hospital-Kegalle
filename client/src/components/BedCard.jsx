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

const StyledCard = styled(Card)(({ theme, occupied }) => ({
  width: "250px",
  height: "200px",
  margin: theme.spacing(2),
  backgroundColor: occupied ? "#ffd1d1" : "#d1ffd1",
  cursor: "pointer",
  borderRadius: "12px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const BedCard = ({ bed, assignBed, deassignBed }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [bedToDeassign, setBedToDeassign] = React.useState(null);

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
      deassignBed(bedToDeassign);
    }
    setOpenModal(false);
    setBedToDeassign(null);
  };

  return (
    <StyledCard occupied={isOccupied.toString()}>
      <CardContent>
        <Box mb={2}>
          <Typography
            variant="h6"
            color="textPrimary"
            fontWeight="bold"
            gutterBottom
          >
            Bed Number: {bed.bedNumber}
          </Typography>
          <Chip
            label={isOccupied ? "Occupied" : "Available"}
            color={isOccupied ? "error" : "success"}
            size="medium"
            sx={{
              fontWeight: "bold",
              borderRadius: "16px",
              paddingX: 2,
              paddingY: 1,
              display: "inline-flex",
              alignItems: "center",
              transition: "none",
            }}
            icon={
              isOccupied ? (
                <CancelIcon fontSize="small" />
              ) : (
                <CheckCircleIcon fontSize="small" />
              )
            }
          />
        </Box>

        {isOccupied && bed.patientId ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="space-between"
            height="100%"
          >
            <Typography variant="body1" color="textSecondary" marginBottom={1}>
              Patient ID: {bed.patientId}
            </Typography>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                marginTop: "auto",
                fontSize: "14px",
                borderRadius: "30px",
                backgroundColor: "error.main",
                color: "white",
                paddingX: 3,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.15)",
                "&:hover": {
                  backgroundColor: "error.dark",
                  transform: "scale(1.05)",
                },
              }}
              startIcon={<RemoveIcon />}
              onClick={() => handleDeassignClick(bed)}
            >
              Deassign
            </Button>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="space-between"
            height="100%"
          >
            <Typography variant="body1" color="textSecondary" marginBottom={1}>
              No patient assigned
            </Typography>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                marginTop: "auto",
                fontSize: "14px",
                borderRadius: "30px",
                backgroundColor: "success.main",
                color: "white",
                paddingX: 3,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.15)",
                "&:hover": {
                  backgroundColor: "success.dark",
                  transform: "scale(1.05)",
                },
              }}
              startIcon={<HotelIcon />}
              onClick={() => assignBed(bed)}
            >
              Assign
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
          <Typography variant="h6" fontWeight="600">
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

        <DialogActions sx={{ justifyContent: "center", padding: "16px 24px" }}>
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
  );
};

export default BedCard;
