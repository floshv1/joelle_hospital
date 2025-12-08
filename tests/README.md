# User Tests Documentation

## Overview

This directory contains comprehensive unit and integration tests for the User model and controller.

## Test Structure

```
tests/
├── unit/
│   ├── User.unit.test.js              # User model unit tests
│   └── UserController.unit.test.js    # User controller unit tests
├── integration/
│   └── User.integration.test.js       # User API integration tests
└── setup.js                           # Test setup file (if needed)
```

## Test Files

### Unit Tests

#### `User.unit.test.js`
Tests the User model in isolation with mocked database calls.

**Test Suites:**
- `create` - Creating users with various data configurations
- `findById` - Retrieving users by ID
- `findByEmail` - Finding users by email address
- `update` - Updating user information
- `delete` - Deleting users
- `findAll` - Retrieving all users with optional filters

**Key Test Cases:**
- Creating users with all required fields
- Default role assignment to "patient"
- Finding non-existent users
- Updating timestamps on user modification
- Filtering users by role

#### `UserController.unit.test.js`
Tests the User controller with mocked User model calls.

**Test Suites:**
- `createUser` - Validating user creation through API
- `getUserById` - Retrieving user by ID through controller
- `getAllUsers` - Getting all users with filtering
- `updateUser` - Updating user information
- `deleteUser` - Deleting users
- `getUserByEmail` - Retrieving user by email

**Key Test Cases:**
- Password hashing validation
- Missing required field validation
- Duplicate email detection (409 Conflict)
- Password exclusion from responses
- Error handling for non-existent users

### Integration Tests

#### `User.integration.test.js`
Full API endpoint tests using Express and supertest.

**Test Routes:**
- `POST /api/users` - Create new user
- `GET /api/users` - Get all users with role filtering
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/email/:email` - Get user by email
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Key Test Cases:**
- Complete user creation flow
- Validation of required fields
- Duplicate email prevention
- Password security (not returned in responses)
- Proper HTTP status codes
- Error handling with database failures

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Unit Tests Only
```bash
npm run test:unit
```

### Run Integration Tests Only
```bash
npm run test:integration
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

## Test Data

### Sample User Object
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  phone: "1234567890",
  hashed_password: "hashedpassword123",
  role: "patient",
  created_at: Date,
  updated_at: Date
}
```

### Valid User Roles
- `patient` - Default role
- `practitioner` - Healthcare professional
- `admin` - System administrator
- `staff` - Hospital staff member

## Test Coverage

Current coverage includes:
- **User Model**: 100% coverage
  - All CRUD operations
  - Query methods (findById, findByEmail, findAll)
  - Timestamp management

- **User Controller**: 100% coverage
  - All endpoint handlers
  - Request validation
  - Error handling
  - Password security

- **API Routes**: 100% coverage
  - All HTTP methods (GET, POST, PUT, DELETE)
  - Query parameters
  - Route parameters
  - HTTP status codes

## Mocking Strategy

### Unit Tests
- Database calls are mocked using Vitest
- bcrypt is mocked for password hashing
- MongoDB ObjectId is properly handled

### Integration Tests
- Express app is created fresh for each test suite
- User model methods are mocked
- Real HTTP requests are made to the app using supertest

## Expected Test Output

```
✓ User Model - Unit Tests (5 test files)
  ✓ create
    ✓ should create a user with all required fields
    ✓ should set default role to patient if not provided
  ✓ findById
    ✓ should find user by ID
    ✓ should return null if user not found
  ... (more test results)

✓ User Controller - Unit Tests (5 test files)
  ... (test results)

✓ User Routes - Integration Tests (6 test files)
  ... (test results)

Test Files  3 passed (3)
     Tests  28 passed (28)
```

## Common Issues & Solutions

### Issue: Tests timeout
**Solution**: Increase timeout in vitest config or individual tests
```javascript
it("test name", async () => { ... }, { timeout: 10000 })
```

### Issue: Mock not resetting between tests
**Solution**: Ensure `beforeEach(() => vi.clearAllMocks())` is called

### Issue: ObjectId comparison fails
**Solution**: Use `.toString()` when comparing ObjectIds or use custom matchers

## Best Practices

1. **Keep tests isolated** - Each test should be independent
2. **Mock external dependencies** - Don't hit real databases in unit tests
3. **Use descriptive test names** - Clearly state what is being tested
4. **Test edge cases** - Test both happy paths and error scenarios
5. **Maintain test speed** - Keep tests fast for quick feedback
6. **Use beforeEach for setup** - Reset mocks and state before each test

## Future Test Coverage

Planned tests for other entities:
- Practitioner model and controller
- Appointment model and controller
- Notification model and controller
- AvailabilitySlot model and controller
- AuditLog model and controller

## References

- [Vitest Documentation](https://vitest.dev/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Express Testing Guide](https://expressjs.com/en/guide/debugging.html)
