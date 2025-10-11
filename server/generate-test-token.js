import jwt from 'jsonwebtoken';

const payload = {
  user: {
    id: 1,
    role: 'consultant',
    name: 'Test Consultant'
  }
};

const token = jwt.sign(payload, 'your-secret-key-for-testing', { expiresIn: '1h' });
console.log('Test Token:', token);
