import express from "express";
import multer from "multer";
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  getUserPreferences,
  updateUserPreferences,
  changePassword,
} from "../controllers/userProfileController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Profile routes
router.get("/profile", authenticateJWT, getUserProfile);
router.put("/profile", authenticateJWT, updateUserProfile);
router.post("/profile/picture", authenticateJWT, upload.single("profilePicture"), uploadProfilePicture);
router.delete("/profile/picture", authenticateJWT, deleteProfilePicture);

// Preferences routes
router.get("/preferences", authenticateJWT, getUserPreferences);
router.put("/preferences", authenticateJWT, updateUserPreferences);

// Password change route
router.put("/password", authenticateJWT, changePassword);

export default router;
