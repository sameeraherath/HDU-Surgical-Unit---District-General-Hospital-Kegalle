# HDU Surgical Unit Management System

A comprehensive healthcare management system for the High Dependency Unit (HDU) Surgical Unit at District General Hospital Kegalle. This system facilitates efficient patient management, bed allocation, and medical record handling in a multi-user environment.

## 🏥 Overview

This application streamlines the workflow of the surgical unit by providing specialized dashboards for different medical staff roles, real-time bed status monitoring, comprehensive patient data management, and secure document handling.

## ✨ Features

### Role-Based Authentication System

- **Secure Login/Registration**: JWT-based authentication
- **Role-Based Access Control**: Customized workflows for:
  - 👨‍⚕️ Consultants
  - 👩‍⚕️ Medical Officers
  - 🧑‍⚕️ House Officers
  - 👨‍⚕️ Nurses

### Bed Management

- **Real-time Status Tracking**: Visual indicators for bed availability
- **Patient Assignment Workflow**: Multi-step form for complete patient data collection
- **Bed Deassignment**: Patient discharge handling with confirmation dialogs
- **Visual Status Indicators**: Color-coded interface for quick status assessment

### Patient Management

- **Structured Admission Process**: Step-by-step patient admission wizard
- **Comprehensive Patient Records**:
  - Personal information
  - Emergency contacts
  - Medical history
  - Admission details
- **Document Upload System**: Support for medical reports, ID proof, and consent forms
- **Automatic Patient ID Generation**: Standardized patient ID format (PT-YYYY-XXXX)

### User Interface

- **Modern Material Design**: Intuitive, responsive interfaces using MUI components
- **Role-Specific Dashboards**: Tailored views for each medical staff role
- **Global State Management**: Centralized app state with Redux
- **Feedback Systems**:
  - Loading indicators
  - Toast notifications
  - Alert banners
  - Confirmation dialogs

### Security Features

- **JWT Authentication**: Secure token-based user sessions
- **Password Hashing**: Secure storage of user credentials
- **Route Protection**: Unauthorized access prevention
- **Secure File Uploads**: File type validation and storage

## 🛠️ Technology Stack

### Frontend

- **Framework**: React.js 19
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI) v6
- **Form Handling**: Formik with Yup validation
- **Routing**: React Router v7
- **HTTP Client**: Axios with interceptors
- **CSS Utilities**: TailwindCSS
- **Build Tool**: Vite 6

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: bcryptjs
- **File Management**: multer
- **Environment Variables**: dotenv

## 📁 Project Structure

```
client/                 # Frontend React application
├── public/             # Static assets
├── src/
│   ├── api/            # API service integration
│   ├── assets/         # Media files (images, icons)
│   ├── components/     # Reusable UI components
│   │   ├── BedCard     # Bed visualization component
│   │   ├── Global*     # App-wide utility components
│   │   └── NurseDashboardForms/ # Form components hierarchy
│   ├── features/       # Redux slices for state management
│   │   ├── alerts/     # Notification management
│   │   ├── auth/       # Authentication state
│   │   ├── patients/   # Patient data management
│   │   └── ui/         # UI state management
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Page layout structures
│   ├── pages/          # Main application views
│   │   └── auth/       # Authentication pages
│   ├── routes/         # Routing configuration
│   └── store/          # Redux store setup

server/                 # Backend Express application
├── config/             # Application configuration
├── controllers/        # Request handlers
├── middleware/         # Express middleware
├── models/             # Database models/schemas
│   └── patients/       # Patient-related models
├── repositories/       # Data access layer
├── routes/             # API route definitions
├── uploads/            # File storage location
└── utils/              # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8.0+)
- npm or yarn package manager

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/hdu-kegalle.git
cd hdu-kegalle
```

2. **Install frontend dependencies:**

```bash
cd client
npm install
```

3. **Install backend dependencies:**

```bash
cd server
npm install
```

4. **Configure environment variables:**

Create a `.env` file in the server directory:

```
# Database Configuration
MYSQL_DATABASE=hdu_kegalle
MYSQL_USER=your_database_user
MYSQL_PASSWORD=your_database_password
MYSQL_HOST=localhost
MYSQL_PORT=3306

# Authentication
JWT_SECRET=your_secure_random_string

# Server
PORT=5001
```

Create a `.env` file in the client directory:

```
VITE_API_URL=http://localhost:5001
```

5. **Database setup:**

The application will automatically create necessary database tables when started for the first time. Make sure the MySQL database specified in your `.env` file exists.

```sql
CREATE DATABASE IF NOT EXISTS hdu_kegalle;
```

### Running the Application

1. **Start the backend server:**

```bash
cd server
npm run dev
```

2. **Start the frontend development server:**

```bash
cd client
npm run dev
```

3. **Access the application:**
   - Frontend: http://localhost:5173 (or the port shown in your terminal)
   - Backend API: http://localhost:5001/api

## 👥 User Roles

### Nurse Dashboard

- Manage bed assignments and patient admissions
- View bed status across the unit
- Process patient admission forms
- Upload patient documents

### Consultant/Medical Officer/House Officer Dashboards

- Coming soon in future updates
- Will include patient monitoring, treatment planning, and medical record management

## 📱 Application Screenshots

- Coming soon

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Bed Management

- `GET /api/beds` - Get all beds with status
- `POST /api/beds/assign` - Assign patient to bed
- `DELETE /api/beds/:bedId` - Deassign patient from bed

### Document Management

- `POST /api/documents/patients/:patientId/documents` - Upload patient documents
- `GET /api/documents/patients/:patientId/documents` - Get patient documents

## ⚙️ Configuration

### Backend

- Edit `server/config/mysqlDB.js` to modify database connection settings
- Modify JWT expiration in `server/controllers/authController.js`

### Frontend

- Change app theme in Material-UI theme configuration (to be implemented)
- Modify API base URL in `.env` file

## 🔒 Security Considerations

- User passwords are hashed using bcrypt before storage
- JWT tokens are used for API authentication with 1-hour expiration
- All API endpoints are protected with authentication middleware
- File uploads are validated for type and size

## 💼 License

This project is proprietary software developed specifically for the District General Hospital Kegalle.

## 🙏 Acknowledgments

Special thanks to the medical staff and administration of District General Hospital Kegalle for their valuable input and requirements specification that guided the development of this system.

---

© 2025 HDU Surgical Unit, District General Hospital Kegalle
