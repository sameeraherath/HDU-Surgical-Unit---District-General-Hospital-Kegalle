import { sequelize } from '../config/database.js';
import { 
  UserMySQLModel, 
  Patient, 
  BedMySQL, 
  CriticalFactor,
  ProgressNote,
  Investigation,
  Prescription,
  Task,
  FluidBalance,
  WardRound,
  DischargePlan,
  TeachingNote,
  Consultation,
  ClinicalAudit,
  AuditLog,
  Notification,
  UserProfile,
  UserPreference,
  NotificationSettings
} from '../config/mysqlDB.js';

// Test database configuration
const TEST_DB_NAME = process.env.TEST_DB_NAME || 'hdu_test_db';

// Global test setup
beforeAll(async () => {
  try {
    // Connect to test database
    await sequelize.authenticate();
    console.log('✅ Test database connected successfully');
    
    // Sync all models for testing
    await sequelize.sync({ force: true });
    console.log('✅ Test database synchronized');
    
  } catch (error) {
    console.error('❌ Test database setup failed:', error);
    throw error;
  }
});

// Clean up after all tests
afterAll(async () => {
  try {
    await sequelize.close();
    console.log('✅ Test database connection closed');
  } catch (error) {
    console.error('❌ Error closing test database:', error);
  }
});

// Clean database before each test
beforeEach(async () => {
  try {
    // Clear all tables in reverse dependency order
    await AuditLog.destroy({ where: {}, force: true });
    await Notification.destroy({ where: {}, force: true });
    await NotificationSettings.destroy({ where: {}, force: true });
    await UserPreference.destroy({ where: {}, force: true });
    await UserProfile.destroy({ where: {}, force: true });
    await ClinicalAudit.destroy({ where: {}, force: true });
    await Consultation.destroy({ where: {}, force: true });
    await TeachingNote.destroy({ where: {}, force: true });
    await DischargePlan.destroy({ where: {}, force: true });
    await WardRound.destroy({ where: {}, force: true });
    await FluidBalance.destroy({ where: {}, force: true });
    await Task.destroy({ where: {}, force: true });
    await Prescription.destroy({ where: {}, force: true });
    await Investigation.destroy({ where: {}, force: true });
    await ProgressNote.destroy({ where: {}, force: true });
    await CriticalFactor.destroy({ where: {}, force: true });
    await BedMySQL.destroy({ where: {}, force: true });
    await Patient.destroy({ where: {}, force: true });
    await UserMySQLModel.destroy({ where: {}, force: true });
    
    // Reset auto-increment counters
    await sequelize.query('ALTER TABLE users AUTO_INCREMENT = 1');
    await sequelize.query('ALTER TABLE patients AUTO_INCREMENT = 1');
    await sequelize.query('ALTER TABLE beds AUTO_INCREMENT = 1');
    
    console.log('🧹 Test database cleaned');
  } catch (error) {
    console.error('❌ Error cleaning test database:', error);
  }
});

// Global test utilities
global.testUtils = {
  // Create test user
  createTestUser: async (userData = {}) => {
    const defaultUser = {
      username: 'testuser',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      email: 'test@example.com',
      registrationNumber: 'TEST001',
      mobileNumber: '0771234567',
      sex: 'Male',
      role: 'Medical Officer',
      nameWithInitials: 'Dr. Test User',
      speciality: 'General Medicine',
      grade: 'Senior'
    };
    
    return await UserMySQLModel.create({ ...defaultUser, ...userData });
  },
  
  // Create test patient
  createTestPatient: async (patientData = {}) => {
    const defaultPatient = {
      patientNumber: 'P001',
      fullName: 'Test Patient',
      nicPassport: '123456789V',
      dateOfBirth: '1990-01-01',
      age: 33,
      gender: 'Male',
      maritalStatus: 'Single',
      contactNumber: '0771234567',
      email: 'patient@test.com',
      address: '123 Test Street, Test City'
    };
    
    return await Patient.create({ ...defaultPatient, ...patientData });
  },
  
  // Create test bed
  createTestBed: async (bedData = {}) => {
    const defaultBed = {
      bedNumber: 'B1',
      patientId: null
    };
    
    return await BedMySQL.create({ ...defaultBed, ...bedData });
  },
  
  // Generate JWT token for testing
  generateTestToken: (user) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign(
      { 
        user: { 
          id: user.id, 
          role: user.role, 
          username: user.username 
        } 
      },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  }
};

// Increase timeout for database operations
jest.setTimeout(30000);
