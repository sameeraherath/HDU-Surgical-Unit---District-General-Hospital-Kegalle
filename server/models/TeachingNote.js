// server/models/TeachingNote.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TeachingNote = sequelize.define(
  "TeachingNote",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    consultantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Consultant providing teaching",
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Patient case being discussed (if applicable)",
    },
    sessionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "Date of teaching session",
    },
    sessionTime: {
      type: DataTypes.TIME,
      allowNull: false,
      comment: "Time of teaching session",
    },
    sessionType: {
      type: DataTypes.ENUM(
        "WARD_ROUND_TEACHING",
        "BEDSIDE_TEACHING",
        "CASE_DISCUSSION",
        "GRAND_ROUNDS",
        "JOURNAL_CLUB",
        "SKILLS_TRAINING",
        "CLINICAL_AUDIT",
        "MORBIDITY_MORTALITY",
        "OTHER"
      ),
      allowNull: false,
      defaultValue: "BEDSIDE_TEACHING",
    },
    topic: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "Teaching topic or title",
    },
    learningObjectives: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Learning objectives for the session",
    },
    clinicalScenario: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Clinical scenario or case presentation",
    },
    teachingContent: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Main teaching content and discussion points",
    },
    clinicalPearls: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Key clinical pearls and take-home messages",
    },
    references: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Literature references and evidence-based guidelines",
    },
    attendees: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "List of attendees (medical officers, house officers, students)",
      defaultValue: [],
    },
    attendeeCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Total number of attendees",
    },
    assessmentMethod: {
      type: DataTypes.ENUM(
        "OBSERVATION",
        "QUESTIONING",
        "PRACTICAL_DEMONSTRATION",
        "CASE_PRESENTATION",
        "WRITTEN_TEST",
        "NONE"
      ),
      allowNull: true,
      defaultValue: "NONE",
    },
    feedbackReceived: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Feedback from attendees",
    },
    followUpRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Whether follow-up teaching is required",
    },
    followUpNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Notes for follow-up sessions",
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Teaching materials, slides, documents",
      defaultValue: [],
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Tags for categorization (surgery, cardiology, etc.)",
      defaultValue: [],
    },
  },
  {
    tableName: "teaching_notes",
    timestamps: true,
    indexes: [
      { fields: ["consultantId"] },
      { fields: ["patientId"] },
      { fields: ["sessionDate"] },
      { fields: ["sessionType"] },
    ],
  }
);

module.exports = TeachingNote;
