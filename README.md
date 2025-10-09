# Hospital Management System - HDU Surgical Unit

## District General Hospital, Kegalle

[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.21.2-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)

A comprehensive web-based Hospital Management System designed specifically for the High Dependency Unit (HDU) Surgical Unit at District General Hospital, Kegalle. This system streamlines healthcare workflows, enabling healthcare professionals to efficiently manage patient care, medical documentation, investigations, prescriptions, and clinical audits.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [User Roles & Permissions](#-user-roles--permissions)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Project Overview

The HDU Hospital Management System is a full-stack web application that digitizes and streamlines healthcare operations in a High Dependency Unit. It provides role-based dashboards and specialized workflows for:

- **Nurses**: Bed management, patient admissions, vital signs recording
- **House Officers**: Patient monitoring, task execution
- **Medical Officers**: Progress notes, investigations, prescriptions, fluid balance
- **Consultants**: Ward rounds, discharge planning, teaching notes, clinical audits

### Objectives

✅ Digitalize patient admission and management workflows  
✅ Enable real-time patient monitoring and vital signs tracking  
✅ Facilitate comprehensive medical documentation (SOAP format)  
✅ Manage investigations, prescriptions, and fluid balance records  
✅ Provide comprehensive audit logging for compliance  
✅ Enable inter-departmental consultations and discharge planning  
✅ Support teaching and clinical audit activities

---

## ✨ Key Features

### 1. **Authentication & Authorization**

- Secure JWT-based authentication
- Role-based access control (RBAC)
- Protected routes based on user roles
- Session management with token refresh

### 2. **Nurse Dashboard**

- 🛏️ **Bed Management**: Visual bed assignment system with real-time status
- 📋 **Patient Admission**: Multi-step comprehensive patient registration
  - Personal information
  - Emergency contacts
  - Medical history
  - Admission details
  - Document upload (medical reports, ID proof, consent forms)
- 💓 **Vital Signs Recording**: Monitor critical factors (HR, BP, Temp, SpO2)
- 👥 **Patient Assignment**: Assign patients to beds with full workflow

### 3. **Medical Officer Dashboard**

- 📊 **Dashboard Overview**:
  - Active patients count
  - Today's tasks and overdue tasks
  - Pending and critical investigations
  - Active prescriptions
  - Recent progress notes
- 📝 **Progress Notes**: SOAP format documentation
  - Daily, Admission, Discharge, Consultation, Operative, Procedure notes
  - Review and co-signing workflow
  - Template support
- 🔬 **Investigations Management**:
  - Order laboratory and imaging investigations
  - Track pending investigations with status updates
  - Add and review results with critical flags
  - Priority and urgency levels
- 💊 **Prescription Management**:
  - Detailed prescriptions with dosage, frequency, duration
  - Medication scheduling and tracking
  - Controlled substances tracking
  - Verification and dispensing workflow
- ✅ **Task Management**:
  - Create and assign tasks with priorities
  - Due date tracking with overdue alerts
  - Task status management (Pending, In Progress, Completed)
- 💧 **Fluid Balance Monitoring**:
  - Record input/output with shift tracking
  - Real-time balance calculation
  - Summary and chart visualization

### 4. **Consultant Dashboard**

- 🏥 **Ward Rounds**:
  - Document consultant rounds in SOAP format
  - Patient status tracking
  - Teaching points and attendee management
  - Follow-up planning
- 📤 **Discharge Planning**:
  - Comprehensive discharge plans
  - Medication reconciliation
  - Follow-up appointments
  - Patient education documentation
  - Approval workflow with checklist
- 📚 **Teaching Notes**:
  - Academic teaching sessions
  - Case-based and bedside teaching
  - Attendee tracking
  - Learning objectives documentation
- 🤝 **Consultations**:
  - Inter-departmental consultation requests
  - Assignment and tracking
  - Response documentation
- 📈 **Clinical Audits**:
  - Audit planning and execution
  - Data collection and analysis
  - Recommendations and action plans

### 5. **Audit & Compliance**

- 📜 **Comprehensive Audit Logging**:
  - All system actions logged with user, timestamp, IP
  - Action categorization (authentication, patient care, medication)
  - Severity levels (Low, Medium, High, Critical)
  - Before/after values for modifications
- 📊 **Audit Dashboard**:
  - Filter and search audit logs
  - Statistics and analytics
  - Critical events tracking
  - Export functionality (JSON/CSV)

### 6. **Notifications System**

- 🔔 Real-time notifications via Socket.IO
- Notification categories (Patient care, Tasks, Investigations, System)
- Mark as read/archive functionality
- Priority levels and user preferences

### 7. **Document Management**

- 📎 Upload patient documents (PDF, DOC, DOCX, images)
- ☁️ Cloudinary cloud storage integration
- Document categorization
- View and download documents

### 8. **User Profile Management**

- 👤 Profile information editing
- 🖼️ Profile picture upload
- 🔒 Password change
- ⚙️ User preferences

---

## 🛠️ Tech Stack

### **Frontend**

| Technology        | Version | Purpose                 |
| ----------------- | ------- | ----------------------- |
| React             | 18.2.0  | UI Framework            |
| Vite              | 6.2.0   | Build Tool & Dev Server |
| Redux Toolkit     | 2.7.0   | State Management        |
| Material-UI (MUI) | 6.4.7   | UI Component Library    |
| React Router      | 7.3.0   | Client-side Routing     |
| Formik            | 2.4.6   | Form Management         |
| Yup               | 1.6.1   | Form Validation         |
| Axios             | 1.8.2   | HTTP Client             |
| Socket.IO Client  | 4.8.1   | Real-time Communication |
| date-fns          | 4.1.0   | Date Utilities          |
| Tailwind CSS      | 3.4.17  | Utility-first CSS       |

### **Backend**

| Technology | Version     | Purpose                         |
| ---------- | ----------- | ------------------------------- |
| Node.js    | 16+         | Runtime Environment             |
| Express    | 4.21.2      | Web Framework                   |
| MySQL      | 8.0+        | Relational Database             |
| Sequelize  | 6.37.6      | ORM (Object-Relational Mapping) |
| JWT        | 9.0.2       | Authentication                  |
| bcryptjs   | 3.0.2       | Password Hashing                |
| Socket.IO  | 4.8.1       | Real-time Communication         |
| Multer     | 1.4.5-lts.2 | File Upload                     |
| Cloudinary | 2.6.1       | Cloud Storage                   |
| dotenv     | 16.4.7      | Environment Variables           |
| cors       | 2.8.5       | Cross-Origin Resource Sharing   |

### **Development Tools**

- **Linting**: ESLint
- **Dev Server**: Vite (frontend), Nodemon (backend)
- **Version Control**: Git
- **Package Manager**: npm

---

## 🏗️ System Architecture

### **High-Level Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   React UI  │  │ Redux Store  │  │  Socket.IO Client│   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/WSS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       API GATEWAY                            │
│                    (Express Middleware)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ CORS Handler │  │ JWT Auth     │  │ Audit Middleware │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Routes   │  │Controllers│  │ Services │  │Repositories│  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ MySQL DB     │  │ Sequelize ORM│  │ Cloudinary       │  │
│  │ (Patient Data│  │ (Models)     │  │ (File Storage)   │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   REAL-TIME LAYER                            │
│                  Socket.IO Server                            │
│         (Notifications & Live Updates)                       │
└─────────────────────────────────────────────────────────────┘
```

### **Database Schema Overview**

#### Core Entities

- **Users**: Authentication and user management
- **Patients**: Patient demographics and status
- **Admissions**: Admission records and details
- **Beds**: Bed management and occupancy
- **Medical Records**: Patient medical history
- **Emergency Contacts**: Patient emergency contacts

#### Clinical Entities

- **Progress Notes**: Medical documentation (SOAP format)
- **Investigations**: Laboratory and imaging orders
- **Investigation Results**: Test results and reports
- **Prescriptions**: Medication orders
- **Fluid Balance**: Input/output records
- **Vital Signs (Critical Factors)**: Patient monitoring data

#### Workflow Entities

- **Tasks**: Task assignment and tracking
- **Ward Rounds**: Consultant round documentation
- **Discharge Plans**: Discharge planning workflow
- **Consultations**: Inter-departmental consultations
- **Teaching Notes**: Academic documentation
- **Clinical Audits**: Quality improvement audits

#### System Entities

- **Notifications**: User notifications
- **Audit Logs**: Comprehensive audit trail
- **User Profiles**: Extended user information
- **User Preferences**: User settings
- **Patient Documents**: Document metadata

---

## 📦 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- **Cloudinary Account** (for file uploads) - [Sign up](https://cloudinary.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/sameeraherath/HDU-Surgical-Unit---District-General-Hospital-Kegalle.git
cd HDU-Surgical-Unit---District-General-Hospital-Kegalle
```

### Step 2: Database Setup

1. **Login to MySQL**:

   ```bash
   mysql -u root -p
   ```

2. **Create Database**:

   ```sql
   CREATE DATABASE hdu_db;
   ```

3. **Create Database User** (Optional but recommended):
   ```sql
   CREATE USER 'hdu_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON hdu_db.* TO 'hdu_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

> **Note**: The application will automatically create all necessary tables and relationships when the server starts for the first time.

### Step 3: Install Server Dependencies

```bash
cd server
npm install
```

### Step 4: Install Client Dependencies

```bash
cd ../client
npm install
```

### Step 5: Configure Environment Variables

Create `.env` files in both client and server directories.

#### Server `.env` (server/.env)

```env
# Server Configuration
PORT=5000

# JWT Secret (Generate a strong secret)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hdu_db
DB_DIALECT=mysql

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Client `.env` (client/.env)

```env
# API Base URL
VITE_API_URL=http://localhost:5000
```

> **Security Note**:
>
> - Never commit `.env` files to version control
> - Use strong, unique values for `JWT_SECRET` in production
> - Keep database credentials secure

### Step 6: Cloudinary Setup

1. Sign up for a free Cloudinary account at [cloudinary.com](https://cloudinary.com/)
2. Navigate to your Dashboard
3. Copy your `Cloud Name`, `API Key`, and `API Secret`
4. Add these values to your `server/.env` file

---

## 🚀 Running the Application

### Development Mode

You'll need two terminal windows/tabs:

#### Terminal 1: Start Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000` with hot-reload enabled.

#### Terminal 2: Start Frontend Development Server

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173` (or another port if 5173 is busy).

### Production Mode

#### Build Frontend

```bash
cd client
npm run build
```

This creates an optimized production build in the `client/dist` directory.

#### Start Backend Server

```bash
cd server
npm start
```

### Accessing the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Base URL**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Documentation**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

## 🔐 Environment Variables

### Server Environment Variables

| Variable                | Description               | Example           | Required           |
| ----------------------- | ------------------------- | ----------------- | ------------------ |
| `PORT`                  | Server port number        | `5000`            | No (default: 5000) |
| `JWT_SECRET`            | Secret key for JWT tokens | `mySecretKey123!` | **Yes**            |
| `DB_HOST`               | MySQL host address        | `localhost`       | **Yes**            |
| `DB_USER`               | MySQL username            | `root`            | **Yes**            |
| `DB_PASSWORD`           | MySQL password            | `password123`     | **Yes**            |
| `DB_NAME`               | Database name             | `hdu_db`          | **Yes**            |
| `DB_DIALECT`            | Database dialect          | `mysql`           | **Yes**            |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name     | `mycloud`         | **Yes**            |
| `CLOUDINARY_API_KEY`    | Cloudinary API key        | `123456789012345` | **Yes**            |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret     | `abcdef123456`    | **Yes**            |

### Client Environment Variables

| Variable       | Description          | Example                 | Required |
| -------------- | -------------------- | ----------------------- | -------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` | **Yes**  |

---

## 📚 API Documentation

This project includes **comprehensive interactive API documentation** using OpenAPI 3.0 (Swagger).

### 🌐 Accessing Interactive API Documentation

Once the server is running, access the Swagger UI at:

```
http://localhost:5000/api-docs
```

### ✨ Features

- 🔍 **Interactive Testing**: Test all API endpoints directly from the browser
- 📖 **Complete Schema Documentation**: View detailed request/response schemas
- 🔐 **Authentication Support**: Test authenticated endpoints with JWT tokens
- 📝 **Request/Response Examples**: See working examples for each endpoint
- 🎯 **Organized by Categories**: Endpoints grouped by functionality

### 📋 API Categories

The API documentation covers the following categories:

1. **Authentication** - User registration and login
2. **Beds Management** - Bed allocation and status
3. **Documents** - Patient document upload/retrieval
4. **Critical Factors** - Vital signs and monitoring
5. **Progress Notes** - SOAP format medical documentation
6. **Investigations** - Laboratory and imaging orders
7. **Prescriptions** - Medication management
8. **Tasks** - Medical task assignment and tracking
9. **Fluid Balance** - Intake/output records
10. **Ward Rounds** - Consultant rounds documentation
11. **Discharge Plans** - Patient discharge planning
12. **Teaching Notes** - Academic teaching sessions
13. **Consultations** - Inter-departmental consultations
14. **Clinical Audits** - Quality improvement audits
15. **Notifications** - User notifications
16. **Audit Logs** - System audit logging
17. **Users** - User profile management

### 🔑 Using the API Documentation

1. **Start the server** (see [Running the Application](#-running-the-application))
2. **Navigate to** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
3. **Authenticate**:
   - Use the `/api/auth/login` endpoint to get your JWT token
   - Click the "Authorize" 🔓 button at the top
   - Enter: `Bearer <your-token>`
   - Click "Authorize"
4. **Test Endpoints**:
   - Expand any endpoint
   - Click "Try it out"
   - Fill in parameters
   - Click "Execute" to see the response

### 🛠️ API Documentation Files

- `server/openapi.yaml` - Complete OpenAPI 3.0 specification
- `server/swagger.js` - Swagger UI configuration

### 📍 API Base URLs

- **Development**: `http://localhost:5000/api`
- **Production**: Configure in `server/openapi.yaml`

### 📄 Additional Documentation

For a comprehensive markdown version of the API documentation, refer to [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Quick Reference

#### Base URL

```
http://localhost:5000/api
```

#### Authentication

All endpoints (except `/auth/register` and `/auth/login`) require JWT authentication.

**Header:**

```
Authorization: Bearer <jwt_token>
```

#### Main Endpoint Categories

| Category         | Base Route                            | Description              |
| ---------------- | ------------------------------------- | ------------------------ |
| Authentication   | `/api/auth`                           | Login, Register          |
| Beds             | `/api/beds`                           | Bed management           |
| Documents        | `/api/documents`                      | Document upload/download |
| Critical Factors | `/api/critical-factors`               | Vital signs              |
| Progress Notes   | `/api/medical-officer/progress-notes` | Medical notes            |
| Investigations   | `/api/medical-officer/investigations` | Lab/Imaging orders       |
| Prescriptions    | `/api/medical-officer/prescriptions`  | Medication orders        |
| Tasks            | `/api/medical-officer/tasks`          | Task management          |
| Fluid Balance    | `/api/medical-officer/fluid-balance`  | I/O records              |
| Ward Rounds      | `/api/consultant/ward-rounds`         | Consultant rounds        |
| Discharge Plans  | `/api/consultant/discharge-plans`     | Discharge planning       |
| Teaching Notes   | `/api/consultant/teaching-notes`      | Teaching sessions        |
| Consultations    | `/api/consultant/consultations`       | Inter-dept consults      |
| Clinical Audits  | `/api/consultant/clinical-audits`     | Quality audits           |
| Notifications    | `/api/notifications`                  | User notifications       |
| Audit Logs       | `/api/audit`                          | System audit logs        |
| User Profile     | `/api/users/profile`                  | User management          |

#### Sample API Calls

**Login:**

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

**Create Progress Note:**

```bash
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

**Order Investigation:**

```bash
POST /api/medical-officer/investigations
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "investigationType": "LABORATORY",
  "testName": "Complete Blood Count",
  "urgency": "ROUTINE",
  "priority": "MEDIUM"
}
```

For complete API documentation with all endpoints, request/response schemas, and examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

---

## 👥 User Roles & Permissions

The system implements Role-Based Access Control (RBAC) with the following roles:

### 1. **Nurse**

**Permissions:**

- View and manage beds
- Admit new patients
- Record vital signs (critical factors)
- Assign patients to beds
- Upload patient documents
- View patient information

**Dashboard Features:**

- Bed occupancy status
- Patient admission workflow
- Quick vital signs entry
- Patient assignment

### 2. **House Officer**

**Permissions:**

- View patients
- View progress notes
- Execute assigned tasks
- View investigations and prescriptions
- Basic patient monitoring

**Dashboard Features:**

- Assigned tasks list
- Patient overview
- Task completion workflow

### 3. **Medical Officer**

**Permissions:**

- All House Officer permissions, plus:
- Create and edit progress notes
- Order investigations
- Create prescriptions
- Manage tasks
- Record fluid balance
- Review investigation results
- Patient care documentation

**Dashboard Features:**

- Comprehensive dashboard with statistics
- Progress notes management
- Investigation ordering and tracking
- Prescription management
- Task management
- Fluid balance monitoring
- Patient detail views

### 4. **Consultant**

**Permissions:**

- All Medical Officer permissions, plus:
- Conduct ward rounds
- Create discharge plans
- Write teaching notes
- Manage consultations
- Conduct clinical audits
- Approve discharge plans
- Senior-level documentation

**Dashboard Features:**

- Consultant overview dashboard
- Ward round management
- Discharge planning workflow
- Teaching notes
- Consultation management
- Clinical audit tools

### 5. **Admin**

**Permissions:**

- All system permissions
- User management
- System configuration
- Audit log access
- Full system administration

**Dashboard Features:**

- System administration panel
- User management
- Audit logs and compliance
- System statistics

---

## 🧪 Testing

### Manual Testing

The system should be manually tested for:

1. **Authentication Flow**

   - User registration with different roles
   - Login and logout
   - Token expiration and refresh

2. **Role-Based Access**

   - Verify each role can only access permitted features
   - Test protected routes

3. **Core Workflows**

   - Patient admission process
   - Vital signs recording
   - Progress note creation and review
   - Investigation ordering and results
   - Prescription creation and management
   - Task assignment and completion
   - Fluid balance recording
   - Ward round documentation
   - Discharge planning

4. **Real-time Features**

   - Notification delivery via Socket.IO
   - Real-time updates

5. **File Upload**

   - Document upload (various formats)
   - Cloudinary integration
   - File retrieval

6. **Audit Logging**
   - Verify all actions are logged
   - Check audit log filtering and export

### Test User Accounts

After initial setup, create test accounts for each role:

```javascript
// Example test users
const testUsers = [
  {
    username: "nurse_test",
    password: "Test123!",
    role: "Nurse",
    fullName: "Test Nurse",
    email: "nurse@test.com",
  },
  {
    username: "mo_test",
    password: "Test123!",
    role: "Medical Officer",
    fullName: "Test Medical Officer",
    email: "mo@test.com",
  },
  {
    username: "consultant_test",
    password: "Test123!",
    role: "Consultant",
    fullName: "Test Consultant",
    email: "consultant@test.com",
  },
];
```

### Automated Testing (Future Implementation)

Consider implementing:

- **Unit Tests**: Jest for backend, React Testing Library for frontend
- **Integration Tests**: Supertest for API testing
- **E2E Tests**: Cypress or Playwright
- **Load Testing**: Artillery or k6

---

## 🌐 Deployment

### Deployment Options

#### Option 1: Traditional Server Deployment

**Requirements:**

- Ubuntu Server (20.04 LTS or higher)
- Node.js v16+
- MySQL 8.0+
- Nginx (reverse proxy)
- PM2 (process manager)

**Steps:**

1. **Setup Server**:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2
```

2. **Clone and Setup Application**:

```bash
git clone <repository-url>
cd HDU-Surgical-Unit---District-General-Hospital-Kegalle

# Install dependencies
cd server && npm install --production
cd ../client && npm install
```

3. **Build Frontend**:

```bash
cd client
npm run build
```

4. **Configure Environment Variables**:

```bash
# Create production .env file
nano server/.env
```

5. **Start Backend with PM2**:

```bash
cd server
pm2 start server.js --name hdu-backend
pm2 startup
pm2 save
```

6. **Configure Nginx**:

```bash
sudo nano /etc/nginx/sites-available/hdu
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/HDU/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/hdu /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **Setup SSL (Optional but Recommended)**:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

#### Option 2: Docker Deployment

Create `Dockerfile` and `docker-compose.yml`:

**docker-compose.yml**:

```yaml
version: "3.8"

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build: ./server
    environment:
      - NODE_ENV=production
    env_file:
      - ./server/.env
    ports:
      - "5000:5000"
    depends_on:
      - mysql

  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

#### Option 3: Cloud Deployment

**AWS:**

- EC2 for compute
- RDS for MySQL
- S3 for static assets
- CloudFront for CDN

**Azure:**

- Azure App Service
- Azure Database for MySQL
- Azure Blob Storage

**Google Cloud:**

- Compute Engine
- Cloud SQL
- Cloud Storage

### Production Checklist

- [ ] Environment variables configured
- [ ] Database backed up
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] CORS settings updated
- [ ] Rate limiting implemented
- [ ] Logging configured
- [ ] Monitoring setup (e.g., PM2, New Relic)
- [ ] Error tracking (e.g., Sentry)
- [ ] Database indexes optimized
- [ ] Static assets optimized and minified
- [ ] Security headers configured
- [ ] Regular backup schedule established

---

## 📁 Project Structure

### Client Structure

```
client/
├── public/               # Static assets
│   ├── sounds/          # Notification sounds
│   ├── images/          # Images
│   └── vite.svg         # Favicon
├── src/
│   ├── api/             # API client functions
│   │   ├── apiClient.js                 # Axios instance
│   │   ├── authApi.jsx                  # Auth endpoints
│   │   ├── consultantApi.js             # Consultant APIs
│   │   ├── consultationApi.js           # Consultation APIs
│   │   ├── dischargePlanApi.js          # Discharge APIs
│   │   ├── documentApi.js               # Document APIs
│   │   ├── fluidBalanceApi.js           # Fluid balance APIs
│   │   ├── investigationApi.js          # Investigation APIs
│   │   ├── medicalOfficerApi.js         # MO APIs
│   │   ├── notificationApi.js           # Notification APIs
│   │   ├── prescriptionApi.js           # Prescription APIs
│   │   ├── progressNoteApi.js           # Progress note APIs
│   │   ├── taskApi.js                   # Task APIs
│   │   ├── teachingNoteApi.js           # Teaching note APIs
│   │   └── wardRoundApi.js              # Ward round APIs
│   ├── components/      # Reusable components
│   │   ├── BedCard.jsx
│   │   ├── CriticalFactorsForm.jsx
│   │   ├── GlobalAlertBanner.jsx
│   │   ├── GlobalAppBar.jsx
│   │   ├── GlobalSpinner.jsx
│   │   └── NurseDashboardForms/
│   ├── features/        # Redux slices
│   │   ├── alerts/
│   │   ├── audit/
│   │   ├── auth/
│   │   ├── fluidBalance/
│   │   ├── investigations/
│   │   ├── medicalOfficer/
│   │   ├── notifications/
│   │   ├── patients/
│   │   ├── prescriptions/
│   │   ├── progressNotes/
│   │   ├── tasks/
│   │   ├── ui/
│   │   └── userProfile/
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Layout components
│   ├── pages/           # Page components
│   ├── routes/          # Route configuration
│   ├── services/        # Business logic
│   ├── store/           # Redux store
│   ├── utils/           # Utility functions
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env                 # Environment variables
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML template
├── package.json         # Dependencies
├── postcss.config.js    # PostCSS config
├── tailwind.config.js   # Tailwind config
└── vite.config.js       # Vite configuration
```

### Server Structure

```
server/
├── config/              # Configuration files
│   ├── cloudinary.js               # Cloudinary setup
│   ├── database.js                 # DB connection
│   └── mysqlDB.js                  # Sequelize models
├── controllers/         # Request handlers
│   ├── auditController.js
│   ├── authController.js
│   ├── bedController.js
│   ├── clinicalAuditController.js
│   ├── consultantController.js
│   ├── consultationController.js
│   ├── criticalFactorController.js
│   ├── dischargePlanController.js
│   ├── documentController.js
│   ├── fluidBalanceController.js
│   ├── investigationController.js
│   ├── medicalOfficerController.js
│   ├── notificationController.js
│   ├── prescriptionController.js
│   ├── progressNoteController.js
│   ├── taskController.js
│   ├── teachingNoteController.js
│   ├── userProfileController.js
│   └── wardRoundController.js
├── middleware/          # Middleware functions
│   ├── auth.js                     # JWT authentication
│   └── auditMiddleware.js          # Audit logging
├── models/              # Database models (Sequelize)
│   ├── patients/                   # Patient models
│   ├── AuditLog.js
│   ├── BedMySQL.js
│   ├── ClinicalAudit.js
│   ├── Consultation.js
│   ├── DischargePlan.js
│   ├── FluidBalance.js
│   ├── Investigation.js
│   ├── InvestigationResult.js
│   ├── Notification.js
│   ├── Prescription.js
│   ├── ProgressNote.js
│   ├── Task.js
│   ├── TeachingNote.js
│   ├── UserMySQL.js
│   ├── UserProfile.js
│   └── WardRound.js
├── repositories/        # Data access layer
├── routes/              # Route definitions
│   ├── auditRoutes.js
│   ├── authRoutes.js
│   ├── bedRoutes.js
│   ├── clinicalAuditRoutes.js
│   ├── consultantRoutes.js
│   ├── consultationRoutes.js
│   ├── criticalFactorRoutes.js
│   ├── dischargePlanRoutes.js
│   ├── documentRoutes.js
│   ├── fluidBalanceRoutes.js
│   ├── investigationRoutes.js
│   ├── medicalOfficerRoutes.js
│   ├── notificationRoutes.js
│   ├── prescriptionRoutes.js
│   ├── progressNoteRoutes.js
│   ├── taskRoutes.js
│   ├── teachingNoteRoutes.js
│   ├── userRoutes.js
│   └── wardRoundRoutes.js
├── services/            # Business logic
├── utils/               # Utility functions
├── .env                 # Environment variables
├── package.json         # Dependencies
└── server.js            # Application entry point
```

---

## 🤝 Contributing

We welcome contributions to improve the HDU Hospital Management System!

### How to Contribute

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit Your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly
- Ensure no sensitive data is committed

### Code Style

- **JavaScript/React**: Follow ESLint configuration
- **Naming Conventions**:
  - Variables: camelCase
  - Components: PascalCase
  - Constants: UPPER_SNAKE_CASE
  - Files: PascalCase for components, camelCase for utilities

---

## 📄 License

This project is developed for District General Hospital, Kegalle. All rights reserved.

---

## 📞 Support & Contact

For support, questions, or feedback:

- **Email**: support@hdu-hospital.com
- **Project Repository**: [GitHub](https://github.com/sameeraherath/HDU-Surgical-Unit---District-General-Hospital-Kegalle)
- **Issue Tracker**: [GitHub Issues](https://github.com/sameeraherath/HDU-Surgical-Unit---District-General-Hospital-Kegalle/issues)

---

## 🙏 Acknowledgments

- District General Hospital, Kegalle - HDU Surgical Unit Team
- Healthcare professionals who provided domain expertise
- Open-source community for the excellent tools and libraries

---

## 📝 Changelog

### Version 1.0.0 (Current)

- ✅ Initial release
- ✅ Complete nurse dashboard with bed management and admissions
- ✅ Medical officer dashboard with full clinical workflow
- ✅ Consultant dashboard with ward rounds and discharge planning
- ✅ Comprehensive audit logging
- ✅ Real-time notifications
- ✅ Document management with Cloudinary
- ✅ User profile management

### Planned Features

- 📅 Calendar integration for appointments
- 📊 Advanced analytics and reporting
- 📱 Mobile app (React Native)
- 🔔 SMS/Email notifications
- 📈 Clinical decision support
- 🌍 Multi-language support
- 📑 PDF report generation
- 🔍 Advanced search and filters

---

**Made with ❤️ for District General Hospital, Kegalle**
