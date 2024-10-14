-- Tabla para los usuarios (estudiantes y administradores)
CREATE TABLE IF NOT EXISTS dep_user (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    user_surname VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_gender VARCHAR(10) NOT NULL,
    user_age DATE NOT NULL,
    user_degree VARCHAR(100) NOT NULL,
    user_zipcode VARCHAR(10) NOT NULL,
    user_isnear BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dep_admin (
    admin_id SERIAL PRIMARY KEY,
    admin_name VARCHAR(100) NOT NULL,
    admin_surname VARCHAR(100) NOT NULL,
    admin_email VARCHAR(100) UNIQUE NOT NULL,
    admin_password VARCHAR(100) NOT NULL
);

-- Tabla de laboratorios
CREATE TABLE IF NOT EXISTS labs (
    lab_id SERIAL PRIMARY KEY,
    lab_name VARCHAR(100) UNIQUE NOT NULL
);

-- Tabla de asistencia
CREATE TABLE IF NOT EXISTS attendance (
    att_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES dep_user(user_id), 
    lab_id INT REFERENCES labs(lab_id),
    att_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    att_end_time TIMESTAMP 
);

-- Tabla para almacenar tokens de autenticación
CREATE TABLE IF NOT EXISTS user_tokens (
    user_id INT PRIMARY KEY REFERENCES users(user_id),
    token TEXT NOT NULL
);