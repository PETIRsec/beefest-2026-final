CREATE TABLE departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('USER', 'ADMIN')),
  display_name TEXT NOT NULL,
  department_id TEXT NOT NULL REFERENCES departments(id),
  profile_id TEXT NOT NULL UNIQUE REFERENCES profiles(id),
  manager_id TEXT REFERENCES users(id)
);

CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  bio TEXT
);

CREATE TABLE private_records (
  profile_id TEXT PRIMARY KEY REFERENCES profiles(id),
  salary TEXT,
  date_of_birth TEXT,
  bank_account TEXT,
  flag TEXT
);

CREATE TABLE payroll_records (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  salary TEXT NOT NULL,
  bank_account TEXT NOT NULL,
  last_updated TEXT NOT NULL
);
