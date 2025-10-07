# HDU Surgical Unit - Development Roadmap

**District General Hospital Kegalle**

_Last Updated: October 7, 2025_

---

## 🎯 Executive Summary

This document outlines the pending features, enhancements, and improvements required to complete the HDU Surgical Unit Management System. The system currently has a fully functional **Nurse Dashboard** with patient admission, bed management, and vital signs tracking. However, three major role-based dashboards and several critical features remain to be developed.

---

## 📊 Current Development Status

### ✅ Completed Features (Phase 1)

- ✔️ Authentication & Authorization System
- ✔️ User Registration & Login
- ✔️ Role-Based Access Control (4 roles)
- ✔️ Nurse Dashboard (Fully Functional)
- ✔️ Bed Management System
- ✔️ Patient Admission Workflow
- ✔️ Critical Factors (Vital Signs) Recording & Updates
- ✔️ Document Upload with Cloudinary Integration
- ✔️ Audit Trail for Vital Signs
- ✔️ Global UI Components (Spinner, Toast, AppBar, Alerts)
- ✔️ Redux State Management
- ✔️ MySQL Database with Sequelize ORM
- ✔️ RESTful API Architecture

### 🚧 In Progress / Placeholder

- 🔨 Consultant Dashboard (Placeholder)
- 🔨 Medical Officer Dashboard (Placeholder)
- 🔨 House Officer Dashboard (Placeholder)

### ❌ Not Started

- Multiple critical features listed below

---

## 🏗️ Major Features to Develop

## 1. 👨‍⚕️ Consultant Dashboard (HIGH PRIORITY)

**Status**: Placeholder only - "Coming Soon" message  
**File**: `client/src/pages/ConsultantDashboard.jsx`

### Features to Implement:

#### 1.1 Overview & Analytics

- [ ] **Ward Overview Dashboard**

  - Real-time bed occupancy statistics
  - Patient count by severity level
  - Average length of stay metrics
  - Discharge predictions and planning
  - Bed turnover rate analytics

- [ ] **Critical Patient Alerts**

  - Dashboard widget showing patients with abnormal vital signs
  - Color-coded severity indicators (Critical/Warning/Stable)
  - Quick access to patient records from alerts
  - Alert history and trends

- [ ] **Patient List Management**
  - Filterable patient list (by status, severity, admission date)
  - Search functionality (by name, patient ID, NIC)
  - Sorting options (admission date, severity, bed number)
  - Quick view of patient summary cards

#### 1.2 Clinical Decision Support

- [ ] **Patient Medical Reviews**

  - Comprehensive patient medical history view
  - Timeline of vital signs with graphical trends
  - Treatment history and medication overview
  - Investigation results integration
  - Progress notes from medical team

- [ ] **Treatment Plans**

  - Create and modify treatment plans
  - Assign tasks to medical officers and house officers
  - Set follow-up schedules
  - Document clinical decisions with timestamps

- [ ] **Discharge Planning**
  - Discharge criteria checklist
  - Discharge summary generation
  - Post-discharge care instructions
  - Referral management system
  - Discharge approval workflow

#### 1.3 Medical Team Coordination

- [ ] **Staff Activity Monitor**

  - View actions performed by medical officers and house officers
  - Task assignment and tracking
  - Workload distribution visualization
  - Staff performance metrics

- [ ] **Consultation Requests**
  - Receive and respond to consultation requests
  - Inter-departmental referrals
  - Second opinion system
  - Consultation notes documentation

#### 1.4 Reports & Analytics

- [ ] **Clinical Reports Generation**

  - Patient outcome reports
  - Mortality and morbidity statistics
  - Complication tracking
  - Length of stay analysis
  - Readmission rate tracking

- [ ] **Export Functionality**
  - PDF report generation
  - Excel data export for research
  - Custom date range selection
  - Graphical data visualization

### Backend Requirements:

```javascript
// New API Endpoints Needed
GET    /api/consultant/dashboard/overview
GET    /api/consultant/patients/list
GET    /api/consultant/patients/:patientId/comprehensive-view
POST   /api/consultant/treatment-plans
PUT    /api/consultant/treatment-plans/:planId
POST   /api/consultant/discharge-plans
GET    /api/consultant/staff-activities
POST   /api/consultant/consultations
GET    /api/consultant/reports/analytics
POST   /api/consultant/reports/generate
```

### Database Models Needed:

- `TreatmentPlan` - Treatment plans and modifications
- `DischargePlan` - Discharge planning and criteria
- `Consultation` - Consultation requests and responses
- `StaffActivity` - Audit trail for staff actions
- `ClinicalReport` - Generated reports metadata

---

## 2. 👩‍⚕️ Medical Officer Dashboard (HIGH PRIORITY)

**Status**: Placeholder only - "Coming Soon" message  
**File**: `client/src/pages/MedicalOfficerDashboard.jsx`

### Features to Implement:

#### 2.1 Patient Care Management

- [ ] **My Assigned Patients**

  - List of patients assigned to the medical officer
  - Patient status overview (stable, critical, improving)
  - Quick access to patient records
  - Task list for each patient

- [ ] **Daily Ward Rounds**
  - Structured ward round checklist
  - Progress notes documentation
  - Vital signs review with trend analysis
  - Treatment adjustment recommendations
  - Investigation ordering interface

#### 2.2 Medical Documentation

- [ ] **Progress Notes System**

  - SOAP (Subjective, Objective, Assessment, Plan) note format
  - Rich text editor for clinical notes
  - Template-based note creation
  - Search and filter previous notes
  - Automatic timestamp and user attribution

- [ ] **Investigation Management**

  - Order laboratory tests (CBC, biochemistry, culture, etc.)
  - Order imaging studies (X-ray, CT, MRI, ultrasound)
  - View pending investigations
  - Track investigation results
  - Results notification system

- [ ] **Prescription System**
  - Electronic prescription creation
  - Drug database integration
  - Dosage calculation support
  - Drug interaction checking
  - Allergy alerts
  - Prescription history tracking

#### 2.3 Treatment Monitoring

- [ ] **Vital Signs Trend Analysis**

  - Graphical representation of vital signs over time
  - Multi-parameter comparison charts
  - Abnormal value highlighting
  - Export charts for reporting

- [ ] **Fluid Balance Monitoring**

  - Input/output recording
  - Cumulative balance calculations
  - Fluid prescription management
  - Electrolyte tracking

- [ ] **Investigation Results Tracking**
  - Lab results dashboard
  - Imaging report viewing
  - Critical result alerts
  - Historical comparison

#### 2.4 Task & Communication

- [ ] **Task Management**

  - Receive tasks from consultants
  - Assign tasks to house officers
  - Mark tasks as completed
  - Task priority management
  - Due date tracking

- [ ] **Consultation Management**

  - Request consultations from specialists
  - View consultation responses
  - Inter-departmental communication
  - Consultation history

- [ ] **Handover System**
  - Shift handover notes
  - Outstanding tasks list
  - Patient concerns to highlight
  - Structured handover format

### Backend Requirements:

```javascript
// New API Endpoints Needed
GET    /api/medical-officer/my-patients
POST   /api/medical-officer/progress-notes
GET    /api/medical-officer/progress-notes/:patientId
POST   /api/medical-officer/investigations/order
GET    /api/medical-officer/investigations/pending
POST   /api/medical-officer/investigations/results
POST   /api/medical-officer/prescriptions
GET    /api/medical-officer/prescriptions/:patientId
GET    /api/medical-officer/vital-trends/:patientId
POST   /api/medical-officer/fluid-balance
GET    /api/medical-officer/tasks
PUT    /api/medical-officer/tasks/:taskId/complete
POST   /api/medical-officer/consultations/request
POST   /api/medical-officer/handover
```

### Database Models Needed:

- `ProgressNote` - Clinical progress notes
- `Investigation` - Lab and imaging orders
- `InvestigationResult` - Test results
- `Prescription` - Medication prescriptions
- `FluidBalance` - Fluid intake/output records
- `Task` - Task assignments and status
- `Handover` - Shift handover documentation

---

## 3. 🧑‍⚕️ House Officer Dashboard (MEDIUM PRIORITY)

**Status**: Placeholder only - "Coming Soon" message  
**File**: `client/src/pages/HouseOfficerDashboard.jsx`

### Features to Implement:

#### 3.1 Daily Tasks & Assignments

- [ ] **Task Dashboard**

  - View assigned tasks from medical officers
  - Task priority indicators
  - Due date and urgency tracking
  - Task completion workflow
  - Task notes and updates

- [ ] **Patient List**
  - List of patients under care
  - Quick patient information cards
  - Navigation to detailed patient view
  - Search and filter functionality

#### 3.2 Clinical Data Entry

- [ ] **Vital Signs Recording** (Enhanced)

  - Quick entry interface for multiple patients
  - Mobile-optimized input forms
  - Barcode scanner integration for patient ID
  - Voice input support (future enhancement)
  - Offline mode with sync capability

- [ ] **Fluid Balance Recording**

  - Input/output data entry
  - Running balance display
  - Multiple entries per shift
  - Fluid type categorization

- [ ] **Basic Progress Notes**
  - Simplified note-taking interface
  - Template-based entries
  - Review and submission to medical officer
  - Draft saving capability

#### 3.3 Investigation Support

- [ ] **Sample Collection Tracking**

  - Mark samples as collected
  - Barcode labeling support
  - Collection time recording
  - Sample tracking status

- [ ] **Result Viewing**
  - View investigation results
  - Result notification system
  - Critical result flagging
  - Result comparison with previous values

#### 3.4 Learning & Documentation

- [ ] **Patient History Taking**

  - Structured history taking forms
  - Chief complaint documentation
  - History of presenting illness
  - Past medical/surgical history
  - System review checklist

- [ ] **Clinical Notes Review**
  - Access to senior doctors' notes
  - Learning resource library
  - Case discussion forum
  - Educational materials

### Backend Requirements:

```javascript
// New API Endpoints Needed
GET    /api/house-officer/tasks
PUT    /api/house-officer/tasks/:taskId/update
GET    /api/house-officer/patients
POST   /api/house-officer/vital-signs/quick-entry
POST   /api/house-officer/fluid-balance
POST   /api/house-officer/progress-notes/draft
GET    /api/house-officer/investigations/:patientId/results
PUT    /api/house-officer/investigations/:investigationId/collected
POST   /api/house-officer/patient-history
```

### Database Models Needed:

- `TaskUpdate` - Task progress updates
- `FluidBalanceEntry` - Individual fluid I/O entries
- `ProgressNoteDraft` - Draft clinical notes
- `PatientHistory` - Detailed patient history

---

## 4. 🔐 Authentication & User Management Enhancements

### 4.1 User Profile Management

- [ ] **Profile Page**

  - View and edit user profile information
  - Change password functionality
  - Profile picture upload
  - Contact information management
  - Professional credentials display

- [ ] **User Preferences**
  - Dashboard layout customization
  - Notification preferences
  - Language selection (future: Sinhala/Tamil support)
  - Theme selection (light/dark mode)
  - Timezone settings

### 4.2 Advanced Authentication

- [ ] **Password Recovery**

  - Forgot password workflow
  - Email-based password reset
  - Security questions
  - Password reset token management

- [ ] **Session Management**

  - Active sessions display
  - Device tracking
  - Remote logout functionality
  - Session timeout warnings
  - Remember me functionality

- [ ] **Two-Factor Authentication (2FA)**
  - SMS-based OTP
  - Email-based OTP
  - Authenticator app support
  - Backup codes generation

### 4.3 Admin User Management

- [ ] **Admin Dashboard**

  - User list with roles
  - Add/edit/deactivate users
  - Password reset for users
  - Role assignment and modification
  - User activity logs

- [ ] **Permission Management**
  - Fine-grained permissions system
  - Custom role creation
  - Permission inheritance
  - Permission audit trail

### Backend Requirements:

```javascript
// New API Endpoints Needed
GET    /api/users/profile
PUT    /api/users/profile
PUT    /api/users/password
POST   /api/users/forgot-password
POST   /api/users/reset-password
GET    /api/users/sessions
DELETE /api/users/sessions/:sessionId
POST   /api/users/2fa/enable
POST   /api/users/2fa/verify
GET    /api/admin/users
POST   /api/admin/users
PUT    /api/admin/users/:userId
DELETE /api/admin/users/:userId
POST   /api/admin/users/:userId/reset-password
```

### Database Models Needed:

- `UserProfile` - Extended user information
- `UserPreference` - User settings and preferences
- `PasswordResetToken` - Password reset tokens
- `UserSession` - Active user sessions
- `TwoFactorAuth` - 2FA configuration
- `Permission` - Permission definitions
- `RolePermission` - Role-permission mapping

---

## 5. 📊 Reporting & Analytics System

### 5.1 Patient Reports

- [ ] **Admission/Discharge Summary**

  - Patient admission details
  - Clinical course summary
  - Final diagnosis
  - Treatment provided
  - Discharge medications
  - Follow-up instructions
  - PDF generation

- [ ] **Medical Certificate Generation**

  - Medical leave certificates
  - Fitness certificates
  - Custom certificate templates
  - Digital signature support

- [ ] **Investigation Reports**
  - Lab results compilation
  - Imaging reports summary
  - Trend analysis reports
  - Downloadable PDF format

### 5.2 Administrative Reports

- [ ] **Bed Occupancy Reports**

  - Daily/weekly/monthly occupancy rates
  - Average length of stay
  - Bed turnover statistics
  - Peak occupancy times
  - Graphical representation

- [ ] **Patient Statistics**

  - Admission trends
  - Demographics breakdown
  - Diagnosis distribution
  - Outcome statistics
  - Mortality/morbidity rates

- [ ] **Workload Analysis**
  - Staff workload distribution
  - Patient-to-staff ratio
  - Task completion rates
  - Performance metrics

### 5.3 Clinical Audit Reports

- [ ] **Quality Indicators**

  - Complication rates
  - Infection surveillance
  - Medication errors tracking
  - Adverse event reporting
  - Clinical protocol compliance

- [ ] **Research Data Export**
  - Anonymized data export
  - Custom query builder
  - CSV/Excel export
  - Statistical summaries
  - Data visualization tools

### Backend Requirements:

```javascript
// New API Endpoints Needed
POST   /api/reports/admission-summary/:patientId
POST   /api/reports/medical-certificate
GET    /api/reports/bed-occupancy
GET    /api/reports/patient-statistics
GET    /api/reports/workload-analysis
GET    /api/reports/quality-indicators
POST   /api/reports/research-export
GET    /api/reports/clinical-audit
```

### Database Models Needed:

- `Report` - Generated reports metadata
- `ReportTemplate` - Report templates
- `QualityIndicator` - Quality metrics tracking
- `AdverseEvent` - Adverse event documentation

---

## 6. 🔔 Notification System

### 6.1 Real-Time Notifications

- [ ] **Critical Alerts**

  - Abnormal vital signs notifications
  - Critical lab results
  - Patient deterioration alerts
  - Emergency calls
  - System alerts

- [ ] **Task Notifications**

  - New task assignments
  - Task due date reminders
  - Task completion confirmations
  - Overdue task warnings

- [ ] **Communication Notifications**
  - New consultation requests
  - Consultation responses
  - Handover reminders
  - Message notifications

### 6.2 Notification Delivery

- [ ] **In-App Notifications**

  - Notification bell icon with count
  - Notification panel/dropdown
  - Read/unread status
  - Notification history
  - Mark as read/delete functionality

- [ ] **Email Notifications**

  - Configurable email alerts
  - Daily digest emails
  - Critical alerts via email
  - Email templates

- [ ] **SMS Notifications** (Optional)
  - Critical patient alerts
  - Emergency notifications
  - Integration with SMS gateway

### 6.3 Notification Management

- [ ] **Notification Preferences**
  - Enable/disable notification types
  - Notification frequency settings
  - Quiet hours configuration
  - Channel preferences (in-app, email)

### Backend Requirements:

```javascript
// New API Endpoints Needed
GET    /api/notifications
POST   /api/notifications/send
PUT    /api/notifications/:notificationId/read
DELETE /api/notifications/:notificationId
GET    /api/notifications/preferences
PUT    /api/notifications/preferences
POST   /api/notifications/test
```

### Technologies Needed:

- WebSocket for real-time notifications (Socket.io)
- Email service (Nodemailer)

### Database Models Needed:

- `Notification` - Notification records
- `NotificationPreference` - User notification settings
- `NotificationTemplate` - Notification templates

---

## 7. 🔍 Search & Advanced Filtering

### 7.1 Global Search

- [ ] **Universal Search Bar**
  - Search patients by name, ID, NIC
  - Search medical records
  - Search prescriptions
  - Search investigation results
  - Search documentation
  - Type-ahead suggestions
  - Recent searches history

### 7.2 Advanced Filters

- [ ] **Patient Filters**

  - Filter by admission date range
  - Filter by age group
  - Filter by gender
  - Filter by diagnosis
  - Filter by bed status
  - Filter by severity level
  - Multi-filter combination

- [ ] **Medical Record Filters**
  - Filter by date range
  - Filter by record type
  - Filter by author
  - Filter by keyword
  - Filter by vital sign ranges

### 7.3 Saved Searches & Views

- [ ] **Custom Views**
  - Save filter combinations
  - Quick access to saved views
  - Share views with team members
  - Default view settings

### Backend Requirements:

```javascript
// New API Endpoints Needed
GET    /api/search/global?q=:query
GET    /api/search/patients?filters=:filters
GET    /api/search/records?filters=:filters
POST   /api/search/views/save
GET    /api/search/views
DELETE /api/search/views/:viewId
```

---



## 9. 🔬 Clinical Features Enhancements

### 9.1 Medication Management

- [ ] **Drug Database**

  - Comprehensive drug information
  - Generic and brand names
  - Dosage forms and strengths
  - Contraindications
  - Side effects
  - Drug interactions

- [ ] **Prescription Module**

  - Electronic prescription creation
  - Dosage calculators
  - Drug interaction checker
  - Allergy cross-checking
  - Prescription templates
  - Automatic refill suggestions

- [ ] **Medication Administration Record (MAR)**
  - Scheduled medication tracking
  - Administration confirmation
  - Missed dose alerts
  - PRN medication tracking
  - Signature/witness requirements

### 9.2 Investigation Management

- [ ] **Investigation Ordering**

  - Laboratory tests ordering
  - Imaging studies ordering
  - Special investigations
  - Urgent/routine flagging
  - Clinical indication documentation

- [ ] **Result Management**
  - Result entry interface
  - Critical value alerts
  - Result interpretation guidelines
  - Historical result comparison
  - Graphical trend display

### 9.3 Surgical Management

- [ ] **Operation Theatre Scheduling**

  - OT booking system
  - Surgeon availability
  - Equipment requirements
  - Anesthesia planning
  - Pre-op checklist

- [ ] **Surgical Notes**
  - Pre-operative assessment
  - Intra-operative notes
  - Post-operative orders
  - Surgical templates
  - Complication documentation

### Backend Requirements:

```javascript
// New API Endpoints Needed
GET    /api/drugs
GET    /api/drugs/:drugId
POST   /api/prescriptions
GET    /api/prescriptions/patient/:patientId
POST   /api/prescriptions/interactions/check
POST   /api/medication-administration
GET    /api/medication-administration/due
POST   /api/investigations/order
GET    /api/investigations/:investigationId
POST   /api/investigations/results
GET    /api/ot/schedule
POST   /api/ot/booking
POST   /api/surgical-notes
```

### Database Models Needed:

- `Drug` - Drug information database
- `Prescription` - Medication prescriptions
- `MedicationAdministration` - Medication administration records
- `Investigation` - Investigation orders
- `InvestigationResult` - Test results
- `OTSchedule` - Operation theatre bookings
- `SurgicalNote` - Surgical documentation

---

## 10. 🔒 Security & Compliance

### 10.1 Data Security

- [ ] **Encryption**

  - End-to-end encryption for sensitive data
  - Database encryption at rest
  - SSL/TLS for data in transit
  - Encrypted file storage

- [ ] **Access Logs**

  - Comprehensive audit logging
  - User action tracking
  - Data access logs
  - Failed login attempts
  - Suspicious activity detection

- [ ] **Data Backup**
  - Automated daily backups
  - Incremental backups
  - Backup verification
  - Disaster recovery plan
  - HIPAA compliance measures

### 10.2 Privacy Compliance

- [ ] **Patient Privacy**

  - Anonymization features
  - Consent management
  - Data access restrictions
  - Patient data export (GDPR compliance)
  - Right to be forgotten implementation

- [ ] **Audit Trail**
  - Complete activity tracking
  - Data modification history
  - User access logs
  - Report generation for audits

### 10.3 Security Policies

- [ ] **Password Policies**

  - Minimum complexity requirements
  - Regular password expiration
  - Password history enforcement
  - Brute force protection
  - Account lockout policies

- [ ] **Session Security**
  - Automatic session timeout
  - Concurrent session limits
  - IP-based access restrictions
  - Geographic restrictions (if needed)

### Backend Requirements:

```javascript
// New API Endpoints Needed
GET    /api/audit/logs
GET    /api/audit/user/:userId
GET    /api/audit/patient/:patientId
POST   /api/backups/create
GET    /api/backups/list
POST   /api/backups/restore
GET    /api/compliance/report
POST   /api/data-export/patient/:patientId
```

### Database Models Needed:

- `AuditLog` (enhance existing)
- `DataAccessLog` - Data access tracking
- `Backup` - Backup metadata
- `ConsentRecord` - Patient consent tracking

---


## 14. 📋 Documentation

### 14.1 Technical Documentation

- [ ] **API Documentation**

  - Complete API reference (Swagger/OpenAPI)
  - Request/response examples
  - Authentication documentation
  - Error code documentation
  - Rate limiting information

- [ ] **Database Documentation**

  - ER diagrams
  - Table relationships
  - Index documentation
  - Migration guides
  - Backup/restore procedures

- [ ] **Code Documentation**
  - JSDoc comments for functions
  - Component prop documentation
  - Architecture decision records
  - Code style guide
  - Contributing guidelines


### 16.3 Data Visualization

- [ ] **Charts & Graphs**
  - Vital signs trend charts
  - Bed occupancy charts
  - Patient statistics graphs
  - Interactive dashboards
  - Real-time data updates

### Technologies Needed:

- Chart.js or Recharts for visualizations
- Framer Motion for animations
- react-aria for accessibility

---

## 17. 🔄 Data Import/Export

### 17.1 Import Features

- [ ] **Patient Data Import**

  - CSV import for bulk patient data
  - Excel import support
  - Data validation during import
  - Import preview
  - Error handling and reporting
