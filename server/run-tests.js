#!/usr/bin/env node

/**
 * Test Runner Script for HDU Hospital Management System
 * 
 * This script helps run tests with proper environment setup
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test configuration
const testConfig = {
  // Set test environment
  NODE_ENV: 'test',
  JWT_SECRET: 'test-secret-key-for-testing-only',
  DB_NAME: 'hdu_test_db',
  LOG_LEVEL: 'error'
};

// Available test commands
const commands = {
  'auth': 'jest auth.test.js',
  'patients': 'jest patients.test.js',
  'integration': 'jest --testPathPattern=integration',
  'all': 'jest',
  'watch': 'jest --watch',
  'coverage': 'jest --coverage'
};

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'all';
const testCommand = commands[command];

if (!testCommand) {
  console.log('❌ Invalid test command');
  console.log('Available commands:', Object.keys(commands).join(', '));
  process.exit(1);
}

console.log('🧪 Running tests:', command);
console.log('📋 Command:', testCommand);
console.log('🔧 Environment:', testConfig.NODE_ENV);

// Set environment variables
Object.assign(process.env, testConfig);

// Run the test command
const child = spawn('npm', ['test', '--', testCommand.replace('jest ', '')], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Tests completed successfully');
  } else {
    console.log('❌ Tests failed with exit code:', code);
  }
  process.exit(code);
});

child.on('error', (error) => {
  console.error('❌ Error running tests:', error);
  process.exit(1);
});
