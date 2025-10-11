import request from 'supertest';
import express from 'express';
import cors from 'cors';
import authRoutes from '../../routes/authRoutes.js';
import bedRoutes from '../../routes/bedRoutes.js';
import criticalFactorRoutes from '../../routes/criticalFactorRoutes.js';
import progressNoteRoutes from '../../routes/progressNoteRoutes.js';
import { 
  UserMySQLModel, 
  Patient, 
  BedMySQL, 
  CriticalFactor,
  ProgressNote 
} from '../../config/mysqlDB.js';
import { testUsers, testPatients, testBeds } from '../fixtures/testData.js';

// Create comprehensive test app
const app = express();
app.use(cors());
app.use(express.json());

// Mock authentication middleware
const mockAuth = (req, res, next) => {
  req.user = { id: 1, role: 'Medical Officer', username: 'testuser' };
  next();
};

// Apply routes
app.use('/api/auth', authRoutes);
app.use('/api/beds', mockAuth, bedRoutes);
app.use('/api/critical-factors', mockAuth, criticalFactorRoutes);
app.use('/api/medical-officer/progress-notes', mockAuth, progressNoteRoutes);

describe('Complete Patient Workflow Integration', () => {
  let authToken;
  let testUser;
  let testPatient;
  let testBed;

  beforeEach(async () => {
    // Create test user
    testUser = await UserMySQLModel.create(testUsers.medicalOfficer);
    
    // Create test patient
    testPatient = await Patient.create(testPatients.patient1);
    
    // Create test bed
    testBed = await BedMySQL.create(testBeds.bed1);
    
    // Get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'mo_test',
        password: 'password'
      });
    
    authToken = loginResponse.body.token;
  });

  describe('Complete Patient Admission Workflow', () => {
    it('should handle complete patient admission workflow', async () => {
      // Step 1: Assign bed to patient
      const bedAssignmentResponse = await request(app)
        .post(`/api/beds/${testBed.id}/assign`)
        .send({
          patientId: testPatient.id,
          notes: 'Patient requires close monitoring'
        })
        .expect(200);

      expect(bedAssignmentResponse.body.success).toBe(true);
      expect(bedAssignmentResponse.body.bed.patientId).toBe(testPatient.id);
      expect(bedAssignmentResponse.body.bed.status).toBe('OCCUPIED');

      // Step 2: Record vital signs (Critical Factors)
      const vitalSignsResponse = await request(app)
        .post('/api/critical-factors')
        .send({
          patientId: testPatient.id,
          heartRate: 75,
          bloodPressureSystolic: 120,
          bloodPressureDiastolic: 80,
          temperature: 36.5,
          oxygenSaturation: 98,
          respiratoryRate: 16,
          painScore: 3,
          consciousness: 'ALERT',
          notes: 'Patient stable'
        })
        .expect(201);

      expect(vitalSignsResponse.body.success).toBe(true);
      expect(vitalSignsResponse.body.criticalFactor.patientId).toBe(testPatient.id);
      expect(vitalSignsResponse.body.criticalFactor.heartRate).toBe(75);

      // Step 3: Create admission progress note
      const progressNoteResponse = await request(app)
        .post('/api/medical-officer/progress-notes')
        .send({
          patientId: testPatient.id,
          noteType: 'ADMISSION',
          subjective: 'Patient complains of chest pain for 2 hours',
          objective: 'Vital signs: BP 120/80, HR 75, Temp 36.5°C, SpO2 98%',
          assessment: 'Acute chest pain, likely musculoskeletal origin',
          plan: 'Monitor vital signs, pain management, ECG, chest X-ray',
          priority: 'HIGH',
          status: 'COMPLETED'
        })
        .expect(201);

      expect(progressNoteResponse.body.success).toBe(true);
      expect(progressNoteResponse.body.progressNote.patientId).toBe(testPatient.id);
      expect(progressNoteResponse.body.progressNote.noteType).toBe('ADMISSION');

      // Step 4: Verify all data is correctly linked
      const patientWithRelations = await Patient.findByPk(testPatient.id, {
        include: [
          { association: 'criticalFactors' },
          { association: 'progressNotes' }
        ]
      });

      expect(patientWithRelations.criticalFactors.length).toBeGreaterThan(0);
      expect(patientWithRelations.progressNotes.length).toBeGreaterThan(0);

      // Step 5: Verify bed assignment
      const updatedBed = await BedMySQL.findByPk(testBed.id);
      expect(updatedBed.patientId).toBe(testPatient.id);
      expect(updatedBed.status).toBe('OCCUPIED');
    });

    it('should handle patient monitoring workflow', async () => {
      // Pre-requisite: Patient already admitted (bed assigned)
      await request(app)
        .post(`/api/beds/${testBed.id}/assign`)
        .send({ patientId: testPatient.id });

      // Step 1: Record multiple vital signs over time
      const vitalSigns1 = await request(app)
        .post('/api/critical-factors')
        .send({
          patientId: testPatient.id,
          heartRate: 80,
          bloodPressureSystolic: 130,
          bloodPressureDiastolic: 85,
          temperature: 37.0,
          oxygenSaturation: 97,
          respiratoryRate: 18,
          painScore: 4,
          consciousness: 'ALERT',
          notes: 'Morning vitals'
        })
        .expect(201);

      const vitalSigns2 = await request(app)
        .post('/api/critical-factors')
        .send({
          patientId: testPatient.id,
          heartRate: 75,
          bloodPressureSystolic: 125,
          bloodPressureDiastolic: 80,
          temperature: 36.8,
          oxygenSaturation: 98,
          respiratoryRate: 16,
          painScore: 2,
          consciousness: 'ALERT',
          notes: 'Afternoon vitals - improving'
        })
        .expect(201);

      // Step 2: Create progress note documenting improvement
      const progressNote = await request(app)
        .post('/api/medical-officer/progress-notes')
        .send({
          patientId: testPatient.id,
          noteType: 'PROGRESS',
          subjective: 'Patient reports improvement in chest pain',
          objective: 'Vital signs improving: BP 125/80, HR 75, Temp 36.8°C',
          assessment: 'Chest pain resolving, no cardiac symptoms',
          plan: 'Continue current medications, consider discharge planning',
          priority: 'MEDIUM',
          status: 'COMPLETED'
        })
        .expect(201);

      // Step 3: Verify multiple vital signs records
      const patientVitals = await CriticalFactor.findAll({
        where: { patientId: testPatient.id },
        order: [['createdAt', 'ASC']]
      });

      expect(patientVitals.length).toBe(2);
      expect(patientVitals[0].heartRate).toBe(80);
      expect(patientVitals[1].heartRate).toBe(75);
      expect(patientVitals[1].painScore).toBeLessThan(patientVitals[0].painScore);
    });

    it('should handle patient discharge workflow', async () => {
      // Pre-requisite: Patient admitted and monitored
      await request(app)
        .post(`/api/beds/${testBed.id}/assign`)
        .send({ patientId: testPatient.id });

      await request(app)
        .post('/api/critical-factors')
        .send({
          patientId: testPatient.id,
          heartRate: 70,
          bloodPressureSystolic: 120,
          bloodPressureDiastolic: 80,
          temperature: 36.5,
          oxygenSaturation: 99,
          respiratoryRate: 14,
          painScore: 0,
          consciousness: 'ALERT',
          notes: 'Discharge vitals - stable'
        });

      // Step 1: Create discharge progress note
      const dischargeNote = await request(app)
        .post('/api/medical-officer/progress-notes')
        .send({
          patientId: testPatient.id,
          noteType: 'DISCHARGE',
          subjective: 'Patient reports no pain, feels well',
          objective: 'Vital signs stable, no acute findings',
          assessment: 'Patient ready for discharge',
          plan: 'Discharge home with follow-up instructions',
          priority: 'LOW',
          status: 'COMPLETED'
        })
        .expect(201);

      // Step 2: Release bed
      const bedReleaseResponse = await request(app)
        .post(`/api/beds/${testBed.id}/release`)
        .expect(200);

      expect(bedReleaseResponse.body.success).toBe(true);
      expect(bedReleaseResponse.body.bed.patientId).toBeNull();
      expect(bedReleaseResponse.body.bed.status).toBe('AVAILABLE');

      // Step 3: Verify discharge note
      expect(dischargeNote.body.progressNote.noteType).toBe('DISCHARGE');
      expect(dischargeNote.body.progressNote.status).toBe('COMPLETED');
    });
  });

  describe('Error Handling in Workflow', () => {
    it('should handle errors gracefully in admission workflow', async () => {
      // Try to assign non-existent patient to bed
      const invalidAssignment = await request(app)
        .post(`/api/beds/${testBed.id}/assign`)
        .send({ patientId: 99999 })
        .expect(400);

      expect(invalidAssignment.body.success).toBe(false);

      // Try to record vital signs for non-existent patient
      const invalidVitals = await request(app)
        .post('/api/critical-factors')
        .send({
          patientId: 99999,
          heartRate: 75,
          bloodPressureSystolic: 120,
          bloodPressureDiastolic: 80,
          temperature: 36.5,
          oxygenSaturation: 98
        })
        .expect(400);

      expect(invalidVitals.body.success).toBe(false);

      // Try to create progress note for non-existent patient
      const invalidNote = await request(app)
        .post('/api/medical-officer/progress-notes')
        .send({
          patientId: 99999,
          noteType: 'ADMISSION',
          subjective: 'Test',
          objective: 'Test',
          assessment: 'Test',
          plan: 'Test'
        })
        .expect(400);

      expect(invalidNote.body.success).toBe(false);
    });

    it('should maintain data consistency during workflow errors', async () => {
      // Assign bed successfully
      await request(app)
        .post(`/api/beds/${testBed.id}/assign`)
        .send({ patientId: testPatient.id });

      // Try to assign same bed to another patient (should fail)
      const anotherPatient = await Patient.create(testPatients.patient2);
      
      const duplicateAssignment = await request(app)
        .post(`/api/beds/${testBed.id}/assign`)
        .send({ patientId: anotherPatient.id })
        .expect(400);

      expect(duplicateAssignment.body.success).toBe(false);

      // Verify bed is still assigned to original patient
      const bedStatus = await BedMySQL.findByPk(testBed.id);
      expect(bedStatus.patientId).toBe(testPatient.id);
      expect(bedStatus.status).toBe('OCCUPIED');
    });
  });

  describe('Data Integrity Tests', () => {
    it('should maintain referential integrity', async () => {
      // Create patient and bed
      const patient = await Patient.create(testPatients.patient2);
      const bed = await BedMySQL.create(testBeds.bed2);

      // Assign bed to patient
      await request(app)
        .post(`/api/beds/${bed.id}/assign`)
        .send({ patientId: patient.id });

      // Record vital signs
      await request(app)
        .post('/api/critical-factors')
        .send({
          patientId: patient.id,
          heartRate: 75,
          bloodPressureSystolic: 120,
          bloodPressureDiastolic: 80,
          temperature: 36.5,
          oxygenSaturation: 98
        });

      // Create progress note
      await request(app)
        .post('/api/medical-officer/progress-notes')
        .send({
          patientId: patient.id,
          noteType: 'ADMISSION',
          subjective: 'Test',
          objective: 'Test',
          assessment: 'Test',
          plan: 'Test'
        });

      // Verify all relationships exist
      const patientWithRelations = await Patient.findByPk(patient.id, {
        include: [
          { association: 'criticalFactors' },
          { association: 'progressNotes' }
        ]
      });

      expect(patientWithRelations.criticalFactors.length).toBe(1);
      expect(patientWithRelations.progressNotes.length).toBe(1);

      // Verify bed assignment
      const bedWithPatient = await BedMySQL.findByPk(bed.id);
      expect(bedWithPatient.patientId).toBe(patient.id);
    });
  });
});
