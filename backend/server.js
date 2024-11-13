// Archivo: server.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: './config/.env' });

const attendanceRouter = require('./src/routes/attendance.routes');
const labsRouter = require('./src/routes/labs.routes');
const userRouter = require('./src/routes/user.routes');
const adminRouter = require('./src/routes/admin.routes');

const app = express();

app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

app.use(morgan('dev'));
app.use(express.json());

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send('Welcome to the Attendance Records API');
});

// Conectar los routers con el prefijo /api
app.use('/api/attendance', attendanceRouter);
app.use('/api/labs', labsRouter);
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);

// Manejo de errores
app.use((err, req, res, next) => {
    return res.status(500).json({
        message: err.message
    });
});

// Solo iniciar el servidor si no estamos en el entorno de prueba
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
