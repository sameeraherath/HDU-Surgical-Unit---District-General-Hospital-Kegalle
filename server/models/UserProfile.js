import { DataTypes } from "sequelize";

const defineUserProfile = (sequelize) => {
  const UserProfile = sequelize.define(
    "UserProfile",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      profilePictureUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Cloudinary URL for profile picture",
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Brief professional biography",
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          is: /^[0-9+\-() ]*$/i,
        },
      },
      alternateEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      emergencyContactName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emergencyContactNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          is: /^[0-9+\-() ]*$/i,
        },
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      professionalTitle: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "e.g., MBBS, MD, RN, BSc Nursing",
      },
      licenseNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Medical/nursing license number",
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "HDU Surgical Unit",
      },
      specialty: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Medical specialty or area of focus",
      },
    },
    {
      timestamps: true,
      tableName: "user_profiles",
      indexes: [
        {
          unique: true,
          fields: ["userId"],
        },
      ],
    }
  );

  return UserProfile;
};

export default defineUserProfile;
