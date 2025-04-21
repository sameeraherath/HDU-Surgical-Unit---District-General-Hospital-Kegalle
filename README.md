# HDU Surgical Unit Management System

A comprehensive healthcare management system for the High Dependency Unit (HDU) Surgical Unit at District General Hospital Kegalle.

## Features

- **Role-Based Authentication**: Secure login and registration system with role-based access control for:
  - Consultants
  - Medical Officers
  - House Officers
  - Nurses

- **Bed Management**:
  - Real-time bed availability tracking
  - Patient assignment/deassignment
  - Visual bed status indicators
  - Bed occupancy history

- **Patient Management**:
  - Patient admission and discharge
  - Patient information recording
  - Medical condition tracking
  - Frequency measure monitoring (Red, Green, Blue, Yellow, Brown)

- **User Interface**:
  - Modern, responsive design
  - Intuitive navigation
  - Role-specific dashboards
  - Global alert system
  - Loading indicators
  - Toast notifications

## Technology Stack

### Frontend
- React.js
- Material-UI (MUI)
- Redux Toolkit for state management
- Formik & Yup for form handling and validation
- React Router for navigation
- Axios for API calls
- TailwindCSS for utility styling

### Backend
- Node.js with Express.js
- MySQL database with Sequelize ORM
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

## Project Structure

```
client/          # Frontend React application
├── src/
│   ├── api/          # API integration
│   ├── components/   # Reusable UI components
│   ├── features/     # Redux slices and state management
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Main application pages
│   └── routes/       # Route configurations

server/          # Backend Express application
├── config/      # Database and other configurations
├── controllers/ # Request handlers
├── models/      # Database models
├── repositories/# Data access layer
└── routes/      # API route definitions
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn package manager

### Installation

1. Clone the repository:
\`\`\`bash
git clone [repository-url]
\`\`\`

2. Install frontend dependencies:
\`\`\`bash
cd client
npm install
\`\`\`

3. Install backend dependencies:
\`\`\`bash
cd server
npm install
\`\`\`

4. Create a .env file in the server directory with the following variables:
\`\`\`
MYSQL_DATABASE=your_database_name
MYSQL_USER=your_database_user
MYSQL_PASSWORD=your_database_password
MYSQL_HOST=localhost
MYSQL_PORT=3306
JWT_SECRET=your_jwt_secret
\`\`\`

5. Create a .env file in the client directory:
\`\`\`
VITE_API_URL=http://localhost:5001
\`\`\`

### Running the Application

1. Start the backend server:
\`\`\`bash
cd server
npm run dev
\`\`\`

2. Start the frontend development server:
\`\`\`bash
cd client
npm run dev
\`\`\`

## License

This project is proprietary software for the District General Hospital Kegalle.

## Contributors

- [List of contributors]

## Acknowledgments

Special thanks to the staff and administration of District General Hospital Kegalle for their input and support in developing this system.