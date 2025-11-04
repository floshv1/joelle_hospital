-- Création des types ENUMq
CREATE TYPE user_role AS ENUM ('patient', 'practitioner', 'admin', 'staff');
CREATE TYPE appointment_status AS ENUM ('booked', 'confirmed', 'cancelled', 'no-show');
CREATE TYPE notification_type AS ENUM ('confirmation', 'reminder', 'cancellation');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed');

-- Table users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role user_role NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    hashed_password TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table practitioners
CREATE TABLE IF NOT EXISTS practitioners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    specialty VARCHAR(255),
    title VARCHAR(100),
    default_duration INT,
    description TEXT
);

-- Table availability_slots
CREATE TABLE IF NOT EXISTS availability_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practitioner_id UUID REFERENCES practitioners(id) ON DELETE CASCADE,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    recurrence_rule TEXT,
    is_exception BOOLEAN DEFAULT FALSE
);

-- Table appointments
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    practitioner_id UUID REFERENCES practitioners(id) ON DELETE CASCADE,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    status appointment_status NOT NULL DEFAULT 'booked',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    status notification_status NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP
);

-- Table audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);
