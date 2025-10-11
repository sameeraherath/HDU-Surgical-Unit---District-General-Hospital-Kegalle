// Test data fixtures for consistent testing

export const testUsers = {
  nurse: {
    username: 'nurse_test',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    email: 'nurse@test.com',
    registrationNumber: 'N001',
    mobileNumber: '0771111111',
    sex: 'Female',
    role: 'Nurse',
    nameWithInitials: 'Sister Test Nurse',
    speciality: 'General Nursing',
    grade: 'Senior'
  },
  
  medicalOfficer: {
    username: 'mo_test',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    email: 'mo@test.com',
    registrationNumber: 'MO001',
    mobileNumber: '0772222222',
    sex: 'Male',
    role: 'Medical Officer',
    nameWithInitials: 'Dr. Test MO',
    speciality: 'General Medicine',
    grade: 'Senior'
  },
  
  consultant: {
    username: 'consultant_test',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    email: 'consultant@test.com',
    registrationNumber: 'C001',
    mobileNumber: '0773333333',
    sex: 'Male',
    role: 'Consultant',
    nameWithInitials: 'Prof. Test Consultant',
    speciality: 'Cardiology',
    grade: 'Professor'
  },
  
  houseOfficer: {
    username: 'ho_test',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    email: 'ho@test.com',
    registrationNumber: 'HO001',
    mobileNumber: '0774444444',
    sex: 'Female',
    role: 'House Officer',
    nameWithInitials: 'Dr. Test HO',
    speciality: 'General Medicine',
    grade: 'Junior'
  }
};

export const testPatients = {
  patient1: {
    patientNumber: 'P001',
    fullName: 'John Doe',
    nicPassport: '123456789V',
    dateOfBirth: '1990-01-01',
    age: 33,
    gender: 'Male',
    maritalStatus: 'Single',
    contactNumber: '0771234567',
    email: 'john.doe@test.com',
    address: '123 Main Street, Colombo 01'
  },
  
  patient2: {
    patientNumber: 'P002',
    fullName: 'Jane Smith',
    nicPassport: '987654321V',
    dateOfBirth: '1985-05-15',
    age: 38,
    gender: 'Female',
    maritalStatus: 'Married',
    contactNumber: '0779876543',
    email: 'jane.smith@test.com',
    address: '456 Oak Avenue, Kandy'
  },
  
  patient3: {
    patientNumber: 'P003',
    fullName: 'Robert Johnson',
    nicPassport: '456789123V',
    dateOfBirth: '1975-12-10',
    age: 48,
    gender: 'Male',
    maritalStatus: 'Divorced',
    contactNumber: '0774567890',
    email: 'robert.johnson@test.com',
    address: '789 Pine Road, Galle'
  }
};

export const testBeds = {
  bed1: {
    bedNumber: 'B1',
    patientId: null
  },
  
  bed2: {
    bedNumber: 'B2',
    patientId: null
  },
  
  bed3: {
    bedNumber: 'B3',
    patientId: null
  }
};

export const testProgressNotes = {
  admissionNote: {
    noteType: 'ADMISSION',
    subjective: 'Patient complains of chest pain for 2 hours',
    objective: 'Vital signs: BP 140/90, HR 85, Temp 37.2°C, SpO2 98%',
    assessment: 'Acute chest pain, likely musculoskeletal origin',
    plan: 'Monitor vital signs, pain management, ECG, chest X-ray',
    priority: 'HIGH',
    status: 'COMPLETED'
  },
  
  progressNote: {
    noteType: 'PROGRESS',
    subjective: 'Patient reports improvement in chest pain',
    objective: 'Vital signs stable: BP 130/80, HR 75, Temp 36.8°C',
    assessment: 'Chest pain resolving, no cardiac symptoms',
    plan: 'Continue current medications, discharge planning',
    priority: 'MEDIUM',
    status: 'COMPLETED'
  }
};

export const testInvestigations = {
  bloodTest: {
    investigationType: 'LABORATORY',
    testName: 'Complete Blood Count',
    urgency: 'ROUTINE',
    priority: 'MEDIUM',
    status: 'ORDERED',
    specimenType: 'Blood',
    instructions: 'Fasting not required'
  },
  
  xray: {
    investigationType: 'IMAGING',
    testName: 'Chest X-Ray',
    urgency: 'URGENT',
    priority: 'HIGH',
    status: 'ORDERED',
    specimenType: 'N/A',
    instructions: 'PA and lateral views'
  }
};

export const testPrescriptions = {
  painRelief: {
    medicationName: 'Paracetamol',
    dosage: '500mg',
    frequency: 'Every 6 hours',
    duration: '5 days',
    route: 'Oral',
    instructions: 'Take with food',
    status: 'ACTIVE'
  },
  
  antibiotic: {
    medicationName: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Three times daily',
    duration: '7 days',
    route: 'Oral',
    instructions: 'Take with meals',
    status: 'ACTIVE'
  }
};

export const testTasks = {
  vitalSigns: {
    title: 'Record vital signs',
    description: 'Check and record patient vital signs every 4 hours',
    priority: 'HIGH',
    status: 'PENDING',
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    category: 'PATIENT_CARE'
  },
  
  medication: {
    title: 'Administer medication',
    description: 'Give prescribed medication to patient',
    priority: 'MEDIUM',
    status: 'PENDING',
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    category: 'MEDICATION'
  }
};

export const testWardRounds = {
  morningRound: {
    roundDate: new Date(),
    roundType: 'MORNING',
    chiefComplaint: 'Chest pain',
    clinicalFindings: 'Patient stable, vital signs normal',
    assessment: 'Improving condition',
    plan: 'Continue current treatment',
    teachingPoints: 'Importance of early mobilization',
    attendees: ['Medical Officer', 'House Officer', 'Nurse'],
    status: 'COMPLETED'
  }
};

export const testDischargePlans = {
  standardDischarge: {
    dischargeDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    dischargeType: 'ROUTINE',
    medications: ['Paracetamol 500mg TDS x 5 days'],
    followUpInstructions: 'Follow up in 1 week',
    patientEducation: 'Rest and avoid heavy lifting',
    status: 'PENDING_APPROVAL'
  }
};

// Helper function to create complete test scenario
export const createTestScenario = async (models) => {
  const { UserMySQLModel, Patient, BedMySQL } = models;
  
  // Create test users
  const nurse = await UserMySQLModel.create(testUsers.nurse);
  const mo = await UserMySQLModel.create(testUsers.medicalOfficer);
  const consultant = await UserMySQLModel.create(testUsers.consultant);
  
  // Create test patients
  const patient1 = await Patient.create(testPatients.patient1);
  const patient2 = await Patient.create(testPatients.patient2);
  
  // Create test beds
  const bed1 = await BedMySQL.create(testBeds.bed1);
  const bed2 = await BedMySQL.create(testBeds.bed2);
  
  return {
    users: { nurse, mo, consultant },
    patients: { patient1, patient2 },
    beds: { bed1, bed2 }
  };
};
