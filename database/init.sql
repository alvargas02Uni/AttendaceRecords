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
    user_id INT PRIMARY KEY REFERENCES dep_user(user_id),
    token TEXT NOT NULL
);



-- Añadir datos de ejemplo para usuarios (estudiantes)
INSERT INTO dep_user (user_name, user_surname, user_email, user_password, user_gender, user_age, user_degree, user_zipcode, user_isnear) VALUES
('John', 'Doe', 'john.doe@example.com', 'password123', 'Male', '1999-05-12', 'Computer Science', '12345', TRUE),
('Jane', 'Smith', 'jane.smith@example.com', 'password123', 'Female', '2001-02-18', 'Biotechnology', '67890', FALSE),
('Alice', 'Johnson', 'alice.johnson@example.com', 'password123', 'Female', '2000-11-25', 'Mathematics', '54321', TRUE),
('Bob', 'Williams', 'bob.williams@example.com', 'password123', 'Male', '1998-09-03', 'Physics', '98765', FALSE);

-- Añadir datos de ejemplo para administradores
INSERT INTO dep_admin (admin_name, admin_surname, admin_email, admin_password) VALUES
('Admin', 'One', 'admin.one@example.com', 'adminpassword'),
('Admin', 'Two', 'admin.two@example.com', 'adminpassword');

-- Añadir datos de ejemplo para laboratorios
INSERT INTO labs (lab_name) VALUES
('Lab 1'),
('Lab 2'),
('Chemistry Lab'),
('Physics Lab'),
('Biology Lab');

-- Añadir datos de ejemplo para asistencias
INSERT INTO attendance (user_id, lab_id, att_time, att_end_time) VALUES
(1, 1, '2024-11-13 10:00:00', '2024-11-13 11:00:00'),
(2, 3, '2024-11-13 12:00:00', '2024-11-13 13:00:00'),
(3, 2, '2024-11-13 09:00:00', '2024-11-13 10:00:00'),
(4, 4, '2024-11-13 14:00:00', '2024-11-13 15:00:00');

-- Añadir datos de ejemplo para tokens de autenticación
INSERT INTO user_tokens (user_id, token) VALUES
(1, 'sampleTokenForUser1'),
(2, 'sampleTokenForUser2'),
(3, 'sampleTokenForUser3'),
(4, 'sampleTokenForUser4');
