import {
  UserMySQLModel,
  UserProfile,
  UserPreference,
} from "../config/mysqlDB.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await UserMySQLModel.findByPk(userId, {
      attributes: ["id", "username", "email", "role", "createdAt"],
      include: [
        {
          model: UserProfile,
          as: "profile",
        },
        {
          model: UserPreference,
          as: "preferences",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        profile: user.profile,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      bio,
      phoneNumber,
      alternateEmail,
      address,
      emergencyContactName,
      emergencyContactNumber,
      dateOfBirth,
      professionalTitle,
      licenseNumber,
      department,
      specialty,
    } = req.body;

    // Find or create user profile
    let [profile, created] = await UserProfile.findOrCreate({
      where: { userId },
      defaults: {
        userId,
        bio,
        phoneNumber,
        alternateEmail,
        address,
        emergencyContactName,
        emergencyContactNumber,
        dateOfBirth,
        professionalTitle,
        licenseNumber,
        department,
        specialty,
      },
    });

    // If profile exists, update it
    if (!created) {
      await profile.update({
        bio,
        phoneNumber,
        alternateEmail,
        address,
        emergencyContactName,
        emergencyContactNumber,
        dateOfBirth,
        professionalTitle,
        licenseNumber,
        department,
        specialty,
      });
    }

    // Fetch updated user with profile
    const user = await UserMySQLModel.findByPk(userId, {
      attributes: ["id", "username", "email", "role"],
      include: [
        {
          model: UserProfile,
          as: "profile",
        },
      ],
    });

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/profile/picture
// @access  Private
export const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "hdu/profile-pictures",
          public_id: `user_${userId}_${Date.now()}`,
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
            { quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Find or create user profile
    let [profile] = await UserProfile.findOrCreate({
      where: { userId },
      defaults: {
        userId,
        profilePictureUrl: result.secure_url,
      },
    });

    // Delete old profile picture from Cloudinary if exists
    if (profile.profilePictureUrl && profile.profilePictureUrl !== result.secure_url) {
      try {
        const publicId = profile.profilePictureUrl
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.error("Error deleting old profile picture:", deleteError);
      }
    }

    // Update profile with new picture URL
    await profile.update({
      profilePictureUrl: result.secure_url,
    });

    res.json({
      message: "Profile picture uploaded successfully",
      profilePictureUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete profile picture
// @route   DELETE /api/users/profile/picture
// @access  Private
export const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await UserProfile.findOne({ where: { userId } });

    if (!profile || !profile.profilePictureUrl) {
      return res.status(404).json({ message: "No profile picture found" });
    }

    // Delete from Cloudinary
    try {
      const publicId = profile.profilePictureUrl
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (deleteError) {
      console.error("Error deleting from Cloudinary:", deleteError);
    }

    // Update profile
    await profile.update({
      profilePictureUrl: null,
    });

    res.json({ message: "Profile picture deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get user preferences
// @route   GET /api/users/preferences
// @access  Private
export const getUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id;

    let [preferences] = await UserPreference.findOrCreate({
      where: { userId },
      defaults: { userId },
    });

    res.json({ preferences });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updateUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      theme,
      language,
      timezone,
      dateFormat,
      timeFormat,
      dashboardLayout,
      notificationsEnabled,
      emailNotifications,
      soundEnabled,
      autoRefresh,
      refreshInterval,
    } = req.body;

    let [preferences] = await UserPreference.findOrCreate({
      where: { userId },
      defaults: { userId },
    });

    await preferences.update({
      theme,
      language,
      timezone,
      dateFormat,
      timeFormat,
      dashboardLayout,
      notificationsEnabled,
      emailNotifications,
      soundEnabled,
      autoRefresh,
      refreshInterval,
    });

    res.json({
      message: "Preferences updated successfully",
      preferences,
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Please provide both current and new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await UserMySQLModel.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
