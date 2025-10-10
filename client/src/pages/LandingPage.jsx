import React from 'react';
import { Link } from 'react-router-dom';
import {
  LocalHospital as Hospital,
  Hotel as Bed,
  Assignment as ClipboardList,
  MedicalServices as StethoscopeIcon,
  Security as Shield,
  Notifications as Bell,
  Description as FileText,
  MonitorHeart as Activity,
  Group as Users,
  CheckCircle,
  ArrowForward as ArrowRight,
  Favorite as Heart,
  AccessTime as Clock,
  Lock as LockIcon,
  Person as UserMd,
  MedicalServices as MedicalIcon
} from '@mui/icons-material';

const LandingPage = () => {
  const features = [
    {
      icon: <Bed sx={{ fontSize: 32, color: '#2563eb' }} />,
      title: "Bed Management",
      description: "Real-time bed assignment system with visual status tracking for efficient patient placement"
    },
    {
      icon: <ClipboardList sx={{ fontSize: 32, color: '#16a34a' }} />,
      title: "Patient Admission",
      description: "Comprehensive multi-step patient registration with document upload and medical history"
    },
    {
      icon: <Activity sx={{ fontSize: 32, color: '#dc2626' }} />,
      title: "Vital Signs Monitoring",
      description: "Track critical factors including HR, BP, Temperature, and SpO2 with real-time alerts"
    },
    {
      icon: <FileText sx={{ fontSize: 32, color: '#9333ea' }} />,
      title: "SOAP Documentation",
      description: "Structured medical documentation with progress notes, investigations, and prescriptions"
    },
    {
      icon: <StethoscopeIcon sx={{ fontSize: 32, color: '#ea580c' }} />,
      title: "Ward Rounds",
      description: "Document consultant rounds with teaching points and follow-up planning"
    },
    {
      icon: <Shield sx={{ fontSize: 32, color: '#4f46e5' }} />,
      title: "Audit & Compliance",
      description: "Comprehensive audit logging with real-time monitoring and compliance reporting"
    }
  ];

  const userRoles = [
    {
      role: "Nurse",
      icon: <Heart sx={{ fontSize: 24, color: '#db2777' }} />,
      description: "Bed management, patient admissions, vital signs recording",
      features: ["Bed Assignment", "Patient Registration", "Vital Signs", "Document Upload"]
    },
    {
      role: "House Officer",
      icon: <UserMd sx={{ fontSize: 24, color: '#2563eb' }} />,
      description: "Patient monitoring, task execution, basic documentation",
      features: ["Task Management", "Patient Monitoring", "Progress Notes", "Investigation Review"]
    },
    {
      role: "Medical Officer",
      icon: <StethoscopeIcon sx={{ fontSize: 24, color: '#16a34a' }} />,
      description: "Comprehensive patient care, investigations, prescriptions",
      features: ["Progress Notes", "Investigations", "Prescriptions", "Fluid Balance", "Task Management"]
    },
    {
      role: "Consultant",
      icon: <Users sx={{ fontSize: 24, color: '#9333ea' }} />,
      description: "Ward rounds, discharge planning, teaching, clinical audits",
      features: ["Ward Rounds", "Discharge Planning", "Teaching Notes", "Consultations", "Clinical Audits"]
    }
  ];

  const stats = [
    { label: "Active Patients", value: "24/7", icon: <Heart sx={{ fontSize: 20 }} /> },
    { label: "Bed Capacity", value: "20+", icon: <Bed sx={{ fontSize: 20 }} /> },
    { label: "Staff Members", value: "50+", icon: <Users sx={{ fontSize: 20 }} /> },
    { label: "Uptime", value: "99.9%", icon: <Clock sx={{ fontSize: 20 }} /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Hospital sx={{ fontSize: 32, color: '#2563eb' }} />
              <div>
                <h1 className="text-xl font-bold text-gray-900">HDU Management System</h1>
                <p className="text-sm text-gray-500">District General Hospital, Kegalle</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Advanced Hospital
              <span className="text-blue-600 block">Management System</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamlining healthcare workflows in the High Dependency Unit with comprehensive 
              patient care, real-time monitoring, and seamless documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Access Dashboard
                <ArrowRight sx={{ fontSize: 20, ml: 1 }} />
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our system provides all the tools healthcare professionals need to deliver 
              exceptional patient care with efficiency and precision.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Role-Based Access Control
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored dashboards and workflows designed for different healthcare roles, 
              ensuring each professional has access to the tools they need.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {userRoles.map((role, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  {role.icon}
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">
                    {role.role}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <ul className="space-y-2">
                  {role.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Security & Compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with healthcare-grade security and compliance standards to protect 
              patient data and ensure regulatory adherence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <LockIcon sx={{ fontSize: 32, color: '#2563eb' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">JWT Authentication</h3>
              <p className="text-gray-600">Secure token-based authentication with role-based access control</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield sx={{ fontSize: 32, color: '#16a34a' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Audit Logging</h3>
              <p className="text-gray-600">Comprehensive audit trails for all system actions and data modifications</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell sx={{ fontSize: 32, color: '#9333ea' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Notifications</h3>
              <p className="text-gray-600">Instant alerts for critical events and important updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Healthcare Workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join the District General Hospital, Kegalle team in delivering exceptional 
            patient care with our comprehensive HDU management system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              Login to Dashboard
              <ArrowRight sx={{ fontSize: 20, ml: 1 }} />
            </Link>
            <Link
              to="/register"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-blue-300"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Hospital sx={{ fontSize: 32, color: '#60a5fa' }} />
                <div>
                  <h3 className="text-xl font-bold">HDU Management System</h3>
                  <p className="text-gray-400 text-sm">District General Hospital, Kegalle</p>
                </div>
              </div>
              <p className="text-gray-400">
                Advanced healthcare management system designed to streamline 
                operations in the High Dependency Unit.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#roles" className="text-gray-400 hover:text-white transition-colors">User Roles</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
              <div className="space-y-2 text-gray-400">
                <p>District General Hospital</p>
                <p>Kegalle, Sri Lanka</p>
                <p>Phone: +94 XX XXX XXXX</p>
                <p>Email: hdu@dghk.lk</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 District General Hospital, Kegalle. All rights reserved.</p>
            <p className="mt-2 text-sm">
              Built with ❤️ for healthcare professionals
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
