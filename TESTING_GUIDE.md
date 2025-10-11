# 🧪 Testing Guide for HDU Hospital Management System

## 📊 **Testing Status Overview**

### ✅ **Completed Testing Infrastructure**

#### **Backend Testing (Node.js + Express)**
- **Framework**: Jest + Supertest + Babel
- **Database**: MySQL test database with Sequelize ORM
- **Coverage**: Authentication, Patient Management, Integration Tests
- **Status**: **4 tests passing** out of 13 total tests

#### **Frontend Testing (React + Vite)**
- **Framework**: Vitest + React Testing Library + jsdom
- **Components**: Material-UI components with theme support
- **Coverage**: Component testing with mocked dependencies
- **Status**: **6 tests passing** out of 19 total tests

---

## 🚀 **How to Run Tests**

### **Backend Tests**
```bash
# Navigate to server directory
cd server

# Run all tests
npm test

# Run specific test suites
npm run test:auth          # Authentication tests only
npm run test:integration    # Integration tests only
npm run test:coverage       # With coverage report
npm run test:watch          # Watch mode

# Run specific test
npm test -- --testNamePattern="should register a new user successfully"
```

### **Frontend Tests**
```bash
# Navigate to client directory
cd client

# Run all tests
npm test

# Run specific test suites
npm run test:components     # Component tests only
npm run test:coverage       # With coverage report
npm run test:watch          # Watch mode
npm run test:ui             # UI mode (if available)

# Run specific test file
npm test -- --run src/components/__tests__/BedCard.test.jsx
```

---

## 📁 **Test Structure**

### **Backend Test Structure**
```
server/
├── __tests__/
│   ├── setup.js                    # Test database setup
│   ├── fixtures/
│   │   └── testData.js             # Test data fixtures
│   ├── integration/
│   │   └── patientWorkflow.test.js # Integration tests
│   ├── auth.test.js                # Authentication tests
│   └── patients.test.js            # Patient management tests
├── jest.config.js                  # Jest configuration
├── .babelrc                        # Babel configuration
└── test.env.example                # Test environment template
```

### **Frontend Test Structure**
```
client/
├── src/
│   ├── test/
│   │   └── setup.js                # Test setup and mocks
│   └── components/
│       └── __tests__/
│           └── BedCard.test.jsx    # Component tests
├── vite.config.js                  # Vite configuration with test settings
└── package.json                    # Test scripts
```

---

## 🔧 **Test Configuration**

### **Backend Configuration**
- **Jest**: Configured for ES modules with Babel transformation
- **Database**: Separate test database (`hdu_test_db`)
- **Environment**: Test-specific environment variables
- **Setup**: Automatic database cleanup between tests

### **Frontend Configuration**
- **Vitest**: Configured for React components
- **Environment**: jsdom for DOM simulation
- **Mocks**: localStorage, sessionStorage, fetch, and browser APIs
- **Theme**: Material-UI theme provider for consistent styling

---

## 📋 **Test Categories**

### **1. Authentication Tests**
- ✅ User registration with valid data
- ❌ Registration validation (email, password, role)
- ❌ Login with valid/invalid credentials
- ❌ JWT token generation and validation

### **2. Patient Management Tests**
- ❌ Patient creation and validation
- ❌ Bed assignment and release
- ❌ Data integrity and referential integrity
- ❌ Search and retrieval functionality

### **3. Integration Tests**
- ❌ Complete patient admission workflow
- ❌ Patient monitoring workflow
- ❌ Patient discharge workflow
- ❌ Error handling and data consistency

### **4. Component Tests**
- ✅ BedCard component rendering
- ✅ Available bed functionality
- ❌ Occupied bed functionality (Redux dependency)
- ❌ Dialog interactions
- ❌ Form integrations

---

## 🐛 **Known Issues & Solutions**

### **Backend Issues**
1. **Validation not working**: API endpoints don't validate input properly
   - **Solution**: Implement proper validation middleware
   
2. **Response format mismatch**: Tests expect different response formats
   - **Solution**: Update tests to match actual API responses
   
3. **Database constraints**: Some tests hit database-level constraints
   - **Solution**: Use proper test data that respects constraints

### **Frontend Issues**
1. **Redux Provider missing**: Components using Redux need store context
   - **Solution**: Wrap components with Redux Provider in tests
   
2. **Text matching issues**: Some text assertions are too strict
   - **Solution**: Use more flexible text matching strategies

---

## 🎯 **Next Steps for Testing**

### **Immediate Priorities**
1. **Fix Redux Provider issue** in frontend tests
2. **Implement proper validation** in backend API
3. **Update test expectations** to match actual API responses
4. **Add more comprehensive test coverage**

### **Medium-term Goals**
1. **Add E2E tests** with Playwright or Cypress
2. **Implement API contract testing**
3. **Add performance testing**
4. **Set up CI/CD testing pipeline**

### **Long-term Goals**
1. **Achieve 80%+ test coverage**
2. **Implement visual regression testing**
3. **Add load testing for critical endpoints**
4. **Set up automated security testing**

---

## 📈 **Test Coverage Goals**

| Component | Current | Target | Priority |
|-----------|---------|--------|----------|
| Authentication | 30% | 90% | High |
| Patient Management | 20% | 85% | High |
| Bed Management | 15% | 80% | Medium |
| Critical Factors | 0% | 75% | Medium |
| Progress Notes | 0% | 75% | Medium |
| Components | 30% | 85% | High |

---

## 🛠 **Testing Best Practices**

### **Backend Testing**
- Use test database for all tests
- Clean up data between tests
- Mock external dependencies
- Test both success and error cases
- Use descriptive test names

### **Frontend Testing**
- Test user interactions, not implementation details
- Use data-testid for reliable element selection
- Mock external API calls
- Test accessibility features
- Use realistic test data

### **General Guidelines**
- Write tests before fixing bugs (TDD approach)
- Keep tests simple and focused
- Use meaningful assertions
- Document complex test scenarios
- Regular test maintenance and updates

---

## 📚 **Resources**

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev/guide/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

---

## 🎉 **Success Metrics**

- **Backend**: 4/13 tests passing (31%)
- **Frontend**: 6/19 tests passing (32%)
- **Overall**: 10/32 tests passing (31%)
- **Infrastructure**: ✅ Complete
- **Documentation**: ✅ Complete

**Next milestone**: Achieve 50% test pass rate by fixing Redux Provider and validation issues.
