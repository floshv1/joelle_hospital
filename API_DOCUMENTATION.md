# API Documentation - Joelle Hospital

## Base URL

```
http://localhost:3000/api
```

## Table of Contents

1. [Users](#users)
2. [Practitioners](#practitioners)
3. [Availability Slots](#availability-slots)
4. [Appointments](#appointments)
5. [Notifications](#notifications)
6. [Audit Logs](#audit-logs)

---

## Users

### Create User

**POST** `/users`

Creates a new user account.

**Request Body:**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "password": "SecurePassword123!",
  "role": "patient"
}
```

**Query Parameters:**

- `role` (optional): `patient`, `practitioner`, `admin`, `staff` (defaults to `patient`)

**Response (201 Created):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "role": "patient",
  "created_at": "2025-12-08T10:30:00Z",
  "updated_at": "2025-12-08T10:30:00Z"
}
```

**Error Responses:**

- `400 Bad Request`: Missing required fields
- `409 Conflict`: Email already exists

**Example (cURL):**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "password123",
    "role": "patient"
  }'
```

**Example (JavaScript/Fetch):**

```javascript
const response = await fetch('http://localhost:3000/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    password: 'password123',
    role: 'patient'
  })
});
const user = await response.json();
```

---

### Get All Users

**GET** `/users`

Retrieves all users with optional filtering.

**Query Parameters:**

- `role` (optional): Filter by role (`patient`, `practitioner`, `admin`, `staff`)

**Response (200 OK):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "role": "patient",
    "created_at": "2025-12-08T10:30:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "first_name": "Dr. Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "role": "practitioner",
    "created_at": "2025-12-08T11:00:00Z"
  }
]
```

**Example (cURL):**

```bash
# Get all users
curl http://localhost:3000/api/users

# Get only practitioners
curl http://localhost:3000/api/users?role=practitioner
```

---

### Get User by ID

**GET** `/users/:id`

Retrieves a specific user by ID.

**URL Parameters:**

- `id` (required): User's MongoDB ObjectId

**Response (200 OK):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "role": "patient",
  "created_at": "2025-12-08T10:30:00Z",
  "updated_at": "2025-12-08T10:30:00Z"
}
```

**Error Responses:**

- `404 Not Found`: User does not exist

**Example (cURL):**

```bash
curl http://localhost:3000/api/users/507f1f77bcf86cd799439011
```

---

### Get User by Email

**GET** `/users/email/:email`

Retrieves a user by their email address.

**URL Parameters:**

- `email` (required): User's email address

**Response (200 OK):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "role": "patient"
}
```

**Example (cURL):**

```bash
curl http://localhost:3000/api/users/email/john@example.com
```

---

### Update User

**PUT** `/users/:id`

Updates an existing user's information.

**URL Parameters:**

- `id` (required): User's MongoDB ObjectId

**Request Body (all fields optional):**

```json
{
  "first_name": "Jonathan",
  "phone": "+9876543210"
}
```

**Response (200 OK):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "first_name": "Jonathan",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+9876543210",
  "role": "patient",
  "updated_at": "2025-12-08T11:45:00Z"
}
```

**Note:** Password cannot be updated through this endpoint for security.

**Example (cURL):**

```bash
curl -X PUT http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jonathan",
    "phone": "+9876543210"
  }'
```

---

### Delete User

**DELETE** `/users/:id`

Deletes a user account permanently.

**URL Parameters:**

- `id` (required): User's MongoDB ObjectId

**Response (200 OK):**

```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**

- `404 Not Found`: User does not exist

**Example (cURL):**

```bash
curl -X DELETE http://localhost:3000/api/users/507f1f77bcf86cd799439011
```

---

## Practitioners

### Create Practitioner

**POST** `/practitioners`

Registers a practitioner profile for a user.

**Request Body:**

```json
{
  "user_id": "507f1f77bcf86cd799439011",
  "specialty": "Cardiology",
  "title": "Dr.",
  "default_duration": 45,
  "description": "Expert cardiologist with 10 years of experience"
}
```

**Response (201 Created):**

```json
{
  "_id": "607f1f77bcf86cd799439020",
  "user_id": "507f1f77bcf86cd799439011",
  "specialty": "Cardiology",
  "title": "Dr.",
  "default_duration": 45,
  "description": "Expert cardiologist with 10 years of experience",
  "created_at": "2025-12-08T10:30:00Z"
}
```

**Example (cURL):**

```bash
curl -X POST http://localhost:3000/api/practitioners \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "507f1f77bcf86cd799439011",
    "specialty": "Cardiology",
    "title": "Dr.",
    "default_duration": 45,
    "description": "Expert cardiologist"
  }'
```

---

### Get All Practitioners

**GET** `/practitioners`

Retrieves all practitioners with optional filtering.

**Query Parameters:**

- `specialty` (optional): Filter by specialty (e.g., "Cardiology", "Neurology")

**Response (200 OK):**

```json
[
  {
    "_id": "607f1f77bcf86cd799439020",
    "user_id": "507f1f77bcf86cd799439011",
    "specialty": "Cardiology",
    "title": "Dr.",
    "default_duration": 45
  }
]
```

**Example (cURL):**

```bash
# Get all practitioners
curl http://localhost:3000/api/practitioners

# Filter by specialty
curl "http://localhost:3000/api/practitioners?specialty=Cardiology"
```

---

### Get Practitioners by Specialty

**GET** `/practitioners/specialty/:specialty`

Retrieves all practitioners in a specific specialty.

**URL Parameters:**

- `specialty` (required): Medical specialty

**Response (200 OK):**

```json
[
  {
    "_id": "607f1f77bcf86cd799439020",
    "specialty": "Cardiology",
    "title": "Dr.",
    "default_duration": 45
  },
  {
    "_id": "607f1f77bcf86cd799439021",
    "specialty": "Cardiology",
    "title": "Dr.",
    "default_duration": 30
  }
]
```

**Example (cURL):**

```bash
curl http://localhost:3000/api/practitioners/specialty/Cardiology
```

---

## Availability Slots

### Create Availability Slot

**POST** `/availability-slots`

Creates a new availability slot for a practitioner.

**Request Body:**

```json
{
  "practitioner_id": "607f1f77bcf86cd799439020",
  "start_datetime": "2025-12-15T09:00:00Z",
  "end_datetime": "2025-12-15T10:00:00Z",
  "recurrence_rule": "FREQ=WEEKLY;BYDAY=MO,WE,FR",
  "is_exception": false
}
```

**Response (201 Created):**

```json
{
  "_id": "707f1f77bcf86cd799439030",
  "practitioner_id": "607f1f77bcf86cd799439020",
  "start_datetime": "2025-12-15T09:00:00Z",
  "end_datetime": "2025-12-15T10:00:00Z",
  "recurrence_rule": "FREQ=WEEKLY;BYDAY=MO,WE,FR",
  "is_exception": false,
  "created_at": "2025-12-08T10:30:00Z"
}
```

**Example (cURL):**

```bash
curl -X POST http://localhost:3000/api/availability-slots \
  -H "Content-Type: application/json" \
  -d '{
    "practitioner_id": "607f1f77bcf86cd799439020",
    "start_datetime": "2025-12-15T09:00:00Z",
    "end_datetime": "2025-12-15T10:00:00Z",
    "recurrence_rule": "FREQ=WEEKLY;BYDAY=MO,WE,FR",
    "is_exception": false
  }'
```

---

### Get Available Slots

**GET** `/availability-slots/practitioner/:practitionerId/available`

Retrieves available slots for a practitioner within a date range.

**URL Parameters:**

- `practitionerId` (required): Practitioner's MongoDB ObjectId

**Query Parameters:**

- `startDate` (required): ISO 8601 date (e.g., "2025-12-15T00:00:00Z")
- `endDate` (required): ISO 8601 date (e.g., "2025-12-31T23:59:59Z")

**Response (200 OK):**

```json
[
  {
    "_id": "707f1f77bcf86cd799439030",
    "practitioner_id": "607f1f77bcf86cd799439020",
    "start_datetime": "2025-12-15T09:00:00Z",
    "end_datetime": "2025-12-15T10:00:00Z",
    "is_exception": false
  },
  {
    "_id": "707f1f77bcf86cd799439031",
    "start_datetime": "2025-12-17T09:00:00Z",
    "end_datetime": "2025-12-17T10:00:00Z"
  }
]
```

**Example (cURL):**

```bash
curl "http://localhost:3000/api/availability-slots/practitioner/607f1f77bcf86cd799439020/available?startDate=2025-12-15T00:00:00Z&endDate=2025-12-31T23:59:59Z"
```

---

## Appointments

### Create Appointment

**POST** `/appointments`

Books a new appointment.

**Request Body:**

```json
{
  "patient_id": "507f1f77bcf86cd799439011",
  "practitioner_id": "607f1f77bcf86cd799439020",
  "start_datetime": "2025-12-15T09:00:00Z",
  "end_datetime": "2025-12-15T10:00:00Z",
  "created_by": "507f1f77bcf86cd799439011"
}
```

**Response (201 Created):**

```json
{
  "_id": "807f1f77bcf86cd799439040",
  "patient_id": "507f1f77bcf86cd799439011",
  "practitioner_id": "607f1f77bcf86cd799439020",
  "start_datetime": "2025-12-15T09:00:00Z",
  "end_datetime": "2025-12-15T10:00:00Z",
  "status": "booked",
  "created_by": "507f1f77bcf86cd799439011",
  "created_at": "2025-12-08T10:30:00Z"
}
```

**Example (cURL):**

```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "507f1f77bcf86cd799439011",
    "practitioner_id": "607f1f77bcf86cd799439020",
    "start_datetime": "2025-12-15T09:00:00Z",
    "end_datetime": "2025-12-15T10:00:00Z",
    "created_by": "507f1f77bcf86cd799439011"
  }'
```

---

### Get Appointments by Patient

**GET** `/appointments/patient/:patientId`

Retrieves all appointments for a patient.

**URL Parameters:**

- `patientId` (required): Patient's MongoDB ObjectId

**Response (200 OK):**

```json
[
  {
    "_id": "807f1f77bcf86cd799439040",
    "patient_id": "507f1f77bcf86cd799439011",
    "practitioner_id": "607f1f77bcf86cd799439020",
    "start_datetime": "2025-12-15T09:00:00Z",
    "end_datetime": "2025-12-15T10:00:00Z",
    "status": "booked"
  }
]
```

**Example (cURL):**

```bash
curl http://localhost:3000/api/appointments/patient/507f1f77bcf86cd799439011
```

---

### Get Appointments by Practitioner

**GET** `/appointments/practitioner/:practitionerId`

Retrieves all appointments for a practitioner.

**URL Parameters:**

- `practitionerId` (required): Practitioner's MongoDB ObjectId

**Example (cURL):**

```bash
curl http://localhost:3000/api/appointments/practitioner/607f1f77bcf86cd799439020
```

---

### Get Appointments by Date Range

**GET** `/appointments/range`

Retrieves appointments within a date range.

**Query Parameters:**

- `startDate` (required): ISO 8601 date
- `endDate` (required): ISO 8601 date

**Example (cURL):**

```bash
curl "http://localhost:3000/api/appointments/range?startDate=2025-12-15T00:00:00Z&endDate=2025-12-31T23:59:59Z"
```

---

### Update Appointment Status

**PATCH** `/appointments/:id/status`

Updates the status of an appointment.

**URL Parameters:**

- `id` (required): Appointment's MongoDB ObjectId

**Request Body:**

```json
{
  "status": "confirmed"
}
```

**Valid Status Values:**

- `booked` - Initial booking
- `confirmed` - Confirmed by patient/practitioner
- `cancelled` - Appointment cancelled
- `no-show` - Patient did not attend

**Response (200 OK):**

```json
{
  "_id": "807f1f77bcf86cd799439040",
  "status": "confirmed",
  "updated_at": "2025-12-08T11:45:00Z"
}
```

**Example (cURL):**

```bash
curl -X PATCH http://localhost:3000/api/appointments/807f1f77bcf86cd799439040/status \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'
```

---

### Delete Appointment

**DELETE** `/appointments/:id`

Cancels and deletes an appointment.

**URL Parameters:**

- `id` (required): Appointment's MongoDB ObjectId

**Response (200 OK):**

```json
{
  "message": "Appointment deleted successfully"
}
```

**Example (cURL):**

```bash
curl -X DELETE http://localhost:3000/api/appointments/807f1f77bcf86cd799439040
```

---

## Notifications

### Create Notification

**POST** `/notifications`

Creates a new notification for an appointment.

**Request Body:**

```json
{
  "appointment_id": "807f1f77bcf86cd799439040",
  "type": "confirmation",
  "status": "pending"
}
```

**Valid Types:**

- `confirmation` - Appointment confirmation
- `reminder` - Appointment reminder
- `cancellation` - Appointment cancellation

**Valid Statuses:**

- `pending` - Not yet sent
- `sent` - Successfully sent
- `failed` - Failed to send

**Response (201 Created):**

```json
{
  "_id": "907f1f77bcf86cd799439050",
  "appointment_id": "807f1f77bcf86cd799439040",
  "type": "confirmation",
  "status": "pending",
  "created_at": "2025-12-08T10:30:00Z"
}
```

**Example (cURL):**

```bash
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "appointment_id": "807f1f77bcf86cd799439040",
    "type": "confirmation",
    "status": "pending"
  }'
```

---

### Get Pending Notifications

**GET** `/notifications/pending`

Retrieves all pending notifications that need to be sent.

**Response (200 OK):**

```json
[
  {
    "_id": "907f1f77bcf86cd799439050",
    "appointment_id": "807f1f77bcf86cd799439040",
    "type": "confirmation",
    "status": "pending"
  }
]
```

**Example (cURL):**

```bash
curl http://localhost:3000/api/notifications/pending
```

---

### Update Notification Status

**PATCH** `/notifications/:id/status`

Marks a notification as sent or failed.

**URL Parameters:**

- `id` (required): Notification's MongoDB ObjectId

**Request Body:**

```json
{
  "status": "sent",
  "sentAt": "2025-12-08T10:35:00Z"
}
```

**Response (200 OK):**

```json
{
  "_id": "907f1f77bcf86cd799439050",
  "status": "sent",
  "sent_at": "2025-12-08T10:35:00Z",
  "updated_at": "2025-12-08T10:35:00Z"
}
```

**Example (cURL):**

```bash
curl -X PATCH http://localhost:3000/api/notifications/907f1f77bcf86cd799439050/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "sent",
    "sentAt": "2025-12-08T10:35:00Z"
  }'
```

---

## Audit Logs

### Create Audit Log Entry

**POST** `/audit-logs`

Records an action for compliance and audit purposes.

**Request Body:**

```json
{
  "user_id": "507f1f77bcf86cd799439011",
  "action": "USER_CREATED_APPOINTMENT",
  "details": "Created appointment 807f1f77bcf86cd799439040 with Dr. Jane Smith"
}
```

**Response (201 Created):**

```json
{
  "_id": "a07f1f77bcf86cd799439060",
  "user_id": "507f1f77bcf86cd799439011",
  "action": "USER_CREATED_APPOINTMENT",
  "details": "Created appointment with Dr. Jane Smith",
  "timestamp": "2025-12-08T10:30:00Z"
}
```

**Example (cURL):**

```bash
curl -X POST http://localhost:3000/api/audit-logs \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "507f1f77bcf86cd799439011",
    "action": "USER_CREATED_APPOINTMENT",
    "details": "Created appointment with Dr. Jane Smith"
  }'
```

---

### Get Audit Logs by User

**GET** `/audit-logs/user/:userId`

Retrieves all actions performed by a specific user.

**URL Parameters:**

- `userId` (required): User's MongoDB ObjectId

**Response (200 OK):**

```json
[
  {
    "_id": "a07f1f77bcf86cd799439060",
    "user_id": "507f1f77bcf86cd799439011",
    "action": "USER_CREATED_APPOINTMENT",
    "details": "Created appointment with Dr. Jane Smith",
    "timestamp": "2025-12-08T10:30:00Z"
  },
  {
    "_id": "a07f1f77bcf86cd799439061",
    "user_id": "507f1f77bcf86cd799439011",
    "action": "USER_CANCELLED_APPOINTMENT",
    "details": "Cancelled appointment 807f1f77bcf86cd799439040",
    "timestamp": "2025-12-08T11:00:00Z"
  }
]
```

**Example (cURL):**

```bash
curl http://localhost:3000/api/audit-logs/user/507f1f77bcf86cd799439011
```

---

### Get Audit Logs by Date Range

**GET** `/audit-logs/range`

Retrieves audit logs within a date range.

**Query Parameters:**

- `startDate` (required): ISO 8601 date
- `endDate` (required): ISO 8601 date

**Example (cURL):**

```bash
curl "http://localhost:3000/api/audit-logs/range?startDate=2025-12-01T00:00:00Z&endDate=2025-12-31T23:59:59Z"
```

---

## Common Error Responses

### 400 Bad Request

```json
{
  "error": "Missing required fields"
}
```

### 404 Not Found

```json
{
  "error": "User not found"
}
```

### 409 Conflict

```json
{
  "error": "User with this email already exists"
}
```

### 500 Internal Server Error

```json
{
  "error": "Database connection failed"
}
```

---

## Authentication & Security

**Important Notes:**

- Passwords are hashed using bcrypt and never returned in responses
- Use HTTPS in production
- Include proper authentication headers in your requests
- Store sensitive data (like user IDs) securely

---

## Rate Limiting

Currently, the API does not have rate limiting implemented. Consider adding rate limiting in production.

---

## Pagination

Currently, the API does not support pagination. Large result sets are returned in full. Consider implementing pagination for production.

---

## Version History

- **v1.0** (2025-12-08): Initial API release
  - User management
  - Practitioner management
  - Appointment scheduling
  - Notifications
  - Audit logging
