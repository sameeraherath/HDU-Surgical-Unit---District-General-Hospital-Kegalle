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
import { protect } from "../middleware/auth.js";

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
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/profile/picture", protect, upload.single("profilePicture"), uploadProfilePicture);
router.delete("/profile/picture", protect, deleteProfilePicture);

// Preferences routes
router.get("/preferences", protect, getUserPreferences);
router.put("/preferences", protect, updateUserPreferences);

// Password change route
router.put("/password", protect, changePassword);

export default router;
