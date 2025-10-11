import request from 'supertest';
import express from 'express';
import cors from 'cors';
import authRoutes from '../routes/authRoutes.js';
import bedRoutes from '../routes/bedRoutes.js';
import { UserMySQLModel, Patient, BedMySQL } from '../config/mysqlDB.js';
import { testUsers, testPatients, testBeds } from './fixtures/testData.js';

// Create test app with middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/beds', bedRoutes);

// Mock authentication middleware for testing
const mockAuth = (req, res, next) => {
  req.user = { id: 1, role: 'Medical Officer', username: 'testuser' };
  next();
};

// Apply mock auth to protected routes
app.use('/api/beds', mockAuth);

describe('Patient Management API', () => {
  let authToken;
  let testUser;
  let testPatient;

  beforeEach(async () => {
    // Create test user
    testUser = await UserMySQLModel.create(testUsers.medicalOfficer);
    
    // Create test patient
    testPatient = await Patient.create(testPatients.patient1);
    
    // Get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'mo_test',
        password: 'password'
      });
    
    authToken = loginResponse.body.token;
  });

  describe('Patient Creation', () => {
    it('should create a new patient successfully', async () => {
      const patientData = {
        patientNumber: 'P999',
        fullName: 'New Test Patient',
        nicPassport: '999999999V',
        dateOfBirth: '1980-06-15',
        age: 43,
        gender: 'Female',
        maritalStatus: 'Married',
        contactNumber: '0779999999',
        email: 'newpatient@test.com',
        address: '999 New Street, Test City'
      };

      // Note: This would need a patient creation endpoint
      // For now, we'll test the model directly
      const patient = await Patient.create(patientData);
      
      expect(patient.patientNumber).toBe('P999');
      expect(patient.fullName).toBe('New Test Patient');
      expect(patient.nicPassport).toBe('999999999V');
      expect(patient.age).toBe(43);
      expect(patient.gender).toBe('Female');
    });

    it('should reject patient with duplicate NIC/Passport', async () => {
      const patientData = {
        patientNumber: 'P888',
        fullName: 'Duplicate Patient',
        nicPassport: '123456789V', // Same as testPatients.patient1
        dateOfBirth: '1985-01-01',
        age: 38,
        gender: 'Male',
        contactNumber: '0778888888',
        address: '888 Duplicate Street'
      };

      await expect(Patient.create(patientData)).rejects.toThrow();
    });

    it('should reject patient with duplicate patient number', async () => {
      const patientData = {
        patientNumber: 'P001', // Same as testPatients.patient1
        fullName: 'Another Patient',
        nicPassport: '888888888V',
        dateOfBirth: '1985-01-01',
        age: 38,
        gender: 'Male',
        contactNumber: '0778888888',
        address: '888 Another Street'
      };

      await expect(Patient.create(patientData)).rejects.toThrow();
    });
  });

  describe('Bed Management', () => {
    let testBed;

    beforeEach(async () => {
      testBed = await BedMySQL.create(testBeds.bed1);
    });

    it('should get all beds', async () => {
      const response = await request(app)
        .get('/api/beds')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.beds)).toBe(true);
      expect(response.body.beds.length).toBeGreaterThan(0);
    });

    it('should get beds by status', async () => {
      const response = await request(app)
        .get('/api/beds?status=AVAILABLE')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.beds)).toBe(true);
    });

    it('should assign bed to patient', async () => {
      const response = await request(app)
        .post(`/api/beds/${testBed.id}/assign`)
        .send({
          patientId: testPatient.id,
          notes: 'Patient requires close monitoring'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.bed.patientId).toBe(testPatient.id);
      expect(response.body.bed.status).toBe('OCCUPIED');
    });

    it('should release bed from patient', async () => {
      // First assign the bed
      await request(app)
        .post(`/api/beds/${testBed.id}/assign`)
        .send({ patientId: testPatient.id });

      // Then release it
      const response = await request(app)
        .post(`/api/beds/${testBed.id}/release`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.bed.patientId).toBeNull();
      expect(response.body.bed.status).toBe('AVAILABLE');
    });

    it('should reject assignment to already occupied bed', async () => {
      // First assign the bed
      await request(app)
        .post(`/api/beds/${testBed.id}/assign`)
        .send({ patientId: testPatient.id });

      // Try to assign another patient to the same bed
      const anotherPatient = await Patient.create(testPatients.patient2);
      
      const response = await request(app)
        .post(`/api/beds/${testBed.id}/assign`)
        .send({ patientId: anotherPatient.id })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('occupied');
    });

    it('should reject assignment with invalid patient ID', async () => {
      const response = await request(app)
        .post(`/api/beds/${testBed.id}/assign`)
        .send({ patientId: 99999 }) // Non-existent patient
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject assignment with invalid bed ID', async () => {
      const response = await request(app)
        .post('/api/beds/99999/assign')
        .send({ patientId: testPatient.id })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Patient Data Validation', () => {
    it('should validate required fields', async () => {
      const invalidPatientData = {
        // Missing required fields
        patientNumber: 'P777',
        fullName: 'Incomplete Patient'
        // Missing nicPassport, dateOfBirth, age, gender, contactNumber, address
      };

      await expect(Patient.create(invalidPatientData)).rejects.toThrow();
    });

    it('should validate age calculation', async () => {
      const patientData = {
        patientNumber: 'P666',
        fullName: 'Age Test Patient',
        nicPassport: '666666666V',
        dateOfBirth: '1990-01-01',
        age: 50, // Incorrect age for 1990 birth
        gender: 'Male',
        contactNumber: '0776666666',
        address: '666 Age Street'
      };

      // This should work as we're not validating age calculation in the model
      // In a real system, you might want to add this validation
      const patient = await Patient.create(patientData);
      expect(patient.age).toBe(50);
    });

    it('should validate gender enum values', async () => {
      const patientData = {
        patientNumber: 'P555',
        fullName: 'Gender Test Patient',
        nicPassport: '555555555V',
        dateOfBirth: '1990-01-01',
        age: 33,
        gender: 'InvalidGender', // Invalid enum value
        contactNumber: '0775555555',
        address: '555 Gender Street'
      };

      await expect(Patient.create(patientData)).rejects.toThrow();
    });

    it('should validate marital status enum values', async () => {
      const patientData = {
        patientNumber: 'P444',
        fullName: 'Marital Test Patient',
        nicPassport: '444444444V',
        dateOfBirth: '1990-01-01',
        age: 33,
        gender: 'Male',
        maritalStatus: 'InvalidStatus', // Invalid enum value
        contactNumber: '0774444444',
        address: '444 Marital Street'
      };

      await expect(Patient.create(patientData)).rejects.toThrow();
    });
  });

  describe('Patient Search and Retrieval', () => {
    beforeEach(async () => {
      // Create multiple test patients
      await Patient.create(testPatients.patient2);
      await Patient.create(testPatients.patient3);
    });

    it('should find patient by patient number', async () => {
      const patient = await Patient.findOne({
        where: { patientNumber: 'P001' }
      });

      expect(patient).toBeTruthy();
      expect(patient.fullName).toBe('John Doe');
    });

    it('should find patient by NIC/Passport', async () => {
      const patient = await Patient.findOne({
        where: { nicPassport: '123456789V' }
      });

      expect(patient).toBeTruthy();
      expect(patient.fullName).toBe('John Doe');
    });

    it('should find patients by gender', async () => {
      const malePatients = await Patient.findAll({
        where: { gender: 'Male' }
      });

      expect(malePatients.length).toBeGreaterThan(0);
      malePatients.forEach(patient => {
        expect(patient.gender).toBe('Male');
      });
    });

    it('should find patients by age range', async () => {
      const youngPatients = await Patient.findAll({
        where: {
          age: {
            [require('sequelize').Op.between]: [30, 40]
          }
        }
      });

      expect(youngPatients.length).toBeGreaterThan(0);
      youngPatients.forEach(patient => {
        expect(patient.age).toBeGreaterThanOrEqual(30);
        expect(patient.age).toBeLessThanOrEqual(40);
      });
    });
  });
});
