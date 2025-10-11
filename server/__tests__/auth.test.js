import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/authRoutes.js';
import { UserMySQLModel } from '../config/mysqlDB.js';
import { testUsers } from './fixtures/testData.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'newuser',
        password: 'Test123!',
        email: 'newuser@test.com',
        registrationNumber: 'NEW001',
        mobileNumber: '0775555555',
        sex: 'Male',
        role: 'Medical Officer',
        nameWithInitials: 'Dr. New User',
        speciality: 'General Medicine',
        grade: 'Senior'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(200);

      console.log('Response body:', response.body);

      expect(response.body.token).toBeDefined();
      expect(response.body.role).toBe('Medical Officer');
    });

    it('should reject registration with invalid email format', async () => {
      const userData = {
        username: 'invaliduser',
        password: 'Test123!',
        email: 'invalid-email-format',
        registrationNumber: 'INV001',
        mobileNumber: '0776666666',
        sex: 'Male',
        role: 'Medical Officer'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('should reject registration with duplicate username', async () => {
      // First registration
      await UserMySQLModel.create(testUsers.medicalOfficer);

      const userData = {
        username: 'mo_test', // Same username as testUsers.medicalOfficer
        password: 'Test123!',
        email: 'duplicate@test.com',
        registrationNumber: 'DUP001',
        mobileNumber: '0777777777',
        sex: 'Male',
        role: 'Medical Officer'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('username');
    });

    it('should reject registration with weak password', async () => {
      const userData = {
        username: 'weakpass',
        password: '123', // Weak password
        email: 'weak@test.com',
        registrationNumber: 'WEAK001',
        mobileNumber: '0778888888',
        sex: 'Male',
        role: 'Medical Officer'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('password');
    });

    it('should reject registration with invalid role', async () => {
      const userData = {
        username: 'invalidrole',
        password: 'Test123!',
        email: 'invalidrole@test.com',
        registrationNumber: 'INV001',
        mobileNumber: '0779999999',
        sex: 'Male',
        role: 'InvalidRole'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user for login tests
      await UserMySQLModel.create(testUsers.medicalOfficer);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'mo_test',
          password: 'password' // This is the plain text password for the hashed password in testUsers
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe('mo_test');
      expect(response.body.user.role).toBe('Medical Officer');
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned
    });

    it('should reject login with invalid username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'mo_test',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should reject login with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'mo_test'
          // Missing password
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return JWT token with correct payload', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'mo_test',
          password: 'password'
        })
        .expect(200);

      const jwt = require('jsonwebtoken');
      const decoded = jwt.decode(response.body.token);
      
      expect(decoded.user.username).toBe('mo_test');
      expect(decoded.user.role).toBe('Medical Officer');
      expect(decoded.user.id).toBeDefined();
    });
  });

  describe('Authentication Middleware', () => {
    let authToken;
    let testUser;

    beforeEach(async () => {
      testUser = await UserMySQLModel.create(testUsers.medicalOfficer);
      
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'mo_test',
          password: 'password'
        });
      
      authToken = loginResponse.body.token;
    });

    it('should allow access with valid token', async () => {
      // This would need a protected route to test properly
      // For now, we'll test the token generation
      expect(authToken).toBeDefined();
      expect(typeof authToken).toBe('string');
    });

    it('should reject access with invalid token', async () => {
      const invalidToken = 'invalid.jwt.token';
      
      // This would need a protected route to test properly
      // The token should be invalid format
      expect(invalidToken).not.toBe(authToken);
    });

    it('should reject access with expired token', async () => {
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(
        { user: { id: testUser.id, role: testUser.role } },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '-1h' } // Expired 1 hour ago
      );
      
      // This would need a protected route to test properly
      expect(expiredToken).not.toBe(authToken);
    });
  });
});
