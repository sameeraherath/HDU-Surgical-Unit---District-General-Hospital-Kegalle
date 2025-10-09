# API Quick Reference Guide

## 🚀 Getting Started

### Base URL

```
http://localhost:5000/api
```

### Authentication

All endpoints (except `/auth/register` and `/auth/login`) require JWT authentication.

Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🔐 Authentication Endpoints

### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!",
  "role": "Medical Officer",
  "fullName": "Dr. John Doe",
  "email": "john.doe@hospital.lk",
  "contactNumber": "+94771234567"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "id": 1,
  "role": "Medical Officer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🛏️ Bed Management

### Get All Beds

```http
GET /api/beds?status=AVAILABLE
Authorization: Bearer <token>
```

### Assign Bed to Patient

```http
POST /api/beds/{id}/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "notes": "Patient requires close monitoring"
}
```

### Release Bed

```http
POST /api/beds/{id}/release
Authorization: Bearer <token>
```

## 📝 Progress Notes

### Create Progress Note

```http
POST /api/medical-officer/progress-notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "noteType": "DAILY_NOTE",
  "subjective": "Patient complains of mild chest pain",
  "objective": "Vital signs stable, BP 120/80, HR 75",
  "assessment": "Angina pectoris, stable condition",
  "plan": "Continue current medications, monitor closely"
}
```

### Get Progress Notes for Patient

```http
GET /api/medical-officer/progress-notes/{patientId}?page=1&limit=20
Authorization: Bearer <token>
```

### Update Progress Note

```http
PUT /api/medical-officer/progress-notes/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "subjective": "Updated information",
  "objective": "Updated observations",
  "assessment": "Updated assessment",
  "plan": "Updated plan"
}
```

### Delete Progress Note

```http
DELETE /api/medical-officer/progress-notes/{id}
Authorization: Bearer <token>
```

### Review Progress Note (Consultant)

```http
PUT /api/medical-officer/progress-notes/{id}/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "reviewComments": "Reviewed and approved"
}
```

## 🔬 Investigations

### Order Investigation

```http
POST /api/medical-officer/investigations
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "investigationType": "LABORATORY",
  "testName": "Complete Blood Count",
  "testDetails": "CBC with differential",
  "urgency": "ROUTINE",
  "priority": "MEDIUM",
  "clinicalIndication": "Fever and elevated WBC count"
}
```

### Get Pending Investigations

```http
GET /api/medical-officer/investigations/pending?page=1&limit=20
Authorization: Bearer <token>
```

### Get Patient Investigations

```http
GET /api/medical-officer/investigations/{patientId}
Authorization: Bearer <token>
```

### Add Investigation Result

```http
POST /api/medical-officer/investigations/{id}/result
Authorization: Bearer <token>
Content-Type: application/json

{
  "resultValue": "WBC: 7500/µL, RBC: 4.5M/µL",
  "resultNotes": "All values within normal range",
  "interpretedBy": 5
}
```

## 💊 Prescriptions

### Create Prescription

```http
POST /api/medical-officer/prescriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "medicationName": "Aspirin",
  "genericName": "Acetylsalicylic acid",
  "medicationType": "TABLET",
  "dosage": "100mg",
  "route": "ORAL",
  "frequency": "Once daily",
  "duration": "7 days",
  "indication": "Post-operative pain management",
  "specialInstructions": "Take with food"
}
```

### Get Active Prescriptions

```http
GET /api/medical-officer/prescriptions/active?page=1&limit=20
Authorization: Bearer <token>
```

### Get Patient Prescriptions

```http
GET /api/medical-officer/prescriptions/{patientId}
Authorization: Bearer <token>
```

### Update Prescription

```http
PUT /api/medical-officer/prescriptions/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "dosage": "150mg",
  "frequency": "Twice daily"
}
```

### Discontinue Prescription

```http
PUT /api/medical-officer/prescriptions/{id}/discontinue
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Completed course of treatment"
}
```

## ✅ Tasks

### Create Task

```http
POST /api/medical-officer/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "assignedTo": 6,
  "taskType": "PATIENT_REVIEW",
  "title": "Review patient vitals",
  "description": "Check BP and HR every 4 hours",
  "priority": "MEDIUM",
  "dueDate": "2024-01-20T14:00:00Z"
}
```

### Get My Tasks

```http
GET /api/medical-officer/tasks/my-tasks?status=PENDING&priority=HIGH
Authorization: Bearer <token>
```

### Get Patient Tasks

```http
GET /api/medical-officer/tasks/{patientId}
Authorization: Bearer <token>
```

### Update Task

```http
PUT /api/medical-officer/tasks/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated task title",
  "priority": "HIGH"
}
```

### Update Task Status

```http
PUT /api/medical-officer/tasks/{id}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "COMPLETED",
  "completionNotes": "Task completed successfully"
}
```

## 💧 Fluid Balance

### Create Fluid Balance Record

```http
POST /api/medical-officer/fluid-balance
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "entryType": "INTAKE",
  "fluidType": "IV Normal Saline",
  "amount": 1000,
  "unit": "ml",
  "notes": "Given over 8 hours"
}
```

### Get Patient Fluid Balance

```http
GET /api/medical-officer/fluid-balance/{patientId}?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

## 🏥 Ward Rounds (Consultant)

### Create Ward Round

```http
POST /api/consultant/ward-rounds
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "roundDate": "2024-01-15",
  "patientStatus": "Stable, improving",
  "clinicalFindings": "Patient alert and oriented, wound healing well",
  "assessment": "Post-operative recovery on track",
  "plan": "Continue antibiotics, remove drain tomorrow",
  "teachingPoints": "Discussed surgical technique"
}
```

### Get All Ward Rounds

```http
GET /api/consultant/ward-rounds?page=1&limit=20&patientId=1
Authorization: Bearer <token>
```

### Get Today's Ward Rounds

```http
GET /api/consultant/ward-rounds/today
Authorization: Bearer <token>
```

### Update Ward Round

```http
PUT /api/consultant/ward-rounds/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientStatus": "Improved significantly",
  "plan": "Ready for discharge tomorrow"
}
```

## 🚪 Discharge Plans (Consultant)

### Create Discharge Plan

```http
POST /api/consultant/discharge-plans
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "plannedDischargeDate": "2024-01-20",
  "dischargeDiagnosis": "Post-operative appendectomy, recovered",
  "dischargeInstructions": "Continue oral antibiotics for 5 days",
  "followUpRequired": true,
  "followUpDate": "2024-01-27"
}
```

### Get Pending Discharge Plans

```http
GET /api/consultant/discharge-plans/pending
Authorization: Bearer <token>
```

### Approve Discharge Plan

```http
PUT /api/consultant/discharge-plans/{id}/approve
Authorization: Bearer <token>
```

## 📚 Teaching Notes (Consultant)

### Create Teaching Note

```http
POST /api/consultant/teaching-notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "topic": "Post-operative complications",
  "content": "Discussion on early identification and management",
  "sessionDate": "2024-01-15T10:00:00Z",
  "attendees": [5, 6, 7]
}
```

### Get All Teaching Notes

```http
GET /api/consultant/teaching-notes?page=1&limit=20
Authorization: Bearer <token>
```

## 🏥 Consultations

### Request Consultation

```http
POST /api/consultations
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "consultingDepartment": "Cardiology",
  "reason": "Chest pain evaluation",
  "urgency": "URGENT",
  "clinicalSummary": "55yo male with post-op chest pain"
}
```

### Get All Consultations

```http
GET /api/consultations?status=REQUESTED
Authorization: Bearer <token>
```

## 📊 Clinical Audits

### Create Clinical Audit

```http
POST /api/clinical-audits
Authorization: Bearer <token>
Content-Type: application/json

{
  "auditTitle": "Surgical Site Infection Rates",
  "auditType": "QUALITY_IMPROVEMENT",
  "startDate": "2024-01-01",
  "endDate": "2024-03-31",
  "description": "Quarterly review of SSI rates"
}
```

### Get All Clinical Audits

```http
GET /api/clinical-audits
Authorization: Bearer <token>
```

## 🔔 Notifications

### Get My Notifications

```http
GET /api/notifications?page=1&limit=20&isRead=false
Authorization: Bearer <token>
```

### Mark Notification as Read

```http
PUT /api/notifications/{id}/read
Authorization: Bearer <token>
```

### Mark All Notifications as Read

```http
PUT /api/notifications/mark-all-read
Authorization: Bearer <token>
```

## 👤 User Profile

### Get My Profile

```http
GET /api/users/profile
Authorization: Bearer <token>
```

### Update My Profile

```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Dr. John Doe Updated",
  "email": "john.new@hospital.lk",
  "contactNumber": "+94771234567"
}
```

## 📋 Audit Logs (Admin)

### Get Audit Logs

```http
GET /api/audit-logs?page=1&limit=50&action=LOGIN&userId=1
Authorization: Bearer <token>
```

## 🎯 Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

## 📝 Data Types

### Note Types

- `DAILY_NOTE`
- `ADMISSION_NOTE`
- `CONSULTATION_NOTE`
- `OPERATIVE_NOTE`
- `PROCEDURE_NOTE`
- `DISCHARGE_SUMMARY`

### Investigation Types

- `LABORATORY`
- `IMAGING`
- `CARDIOLOGY`
- `ENDOSCOPY`
- `OTHER`

### Urgency Levels

- `ROUTINE`
- `URGENT`
- `STAT`
- `EMERGENCY`

### Priority Levels

- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`
- `URGENT`

### Task Types

- `PATIENT_REVIEW`
- `INVESTIGATION_FOLLOW_UP`
- `MEDICATION_REVIEW`
- `WOUND_CARE`
- `PROCEDURE`
- `CONSULTATION`
- `DISCHARGE_PLANNING`
- `OTHER`

### Task/Investigation Status

- `PENDING`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`

### Medication Routes

- `ORAL`
- `IV` (Intravenous)
- `IM` (Intramuscular)
- `SC` (Subcutaneous)
- `TOPICAL`
- `INHALATION`
- `RECTAL`
- `OTHER`

### User Roles

- `Nurse`
- `House Officer`
- `Medical Officer`
- `Consultant`
- `Admin`

## 🔗 Interactive Documentation

For interactive API testing and detailed schemas, visit:

```
http://localhost:5000/api-docs
```

## 📞 Support

For issues or questions, contact the HDU Development Team.
