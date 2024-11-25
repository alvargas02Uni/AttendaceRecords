// Archivo: server.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: './config/.env' });

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerConfig');

// Winston Logger
const logger = require('./src/util/logger');

const attendanceRouter = require('./src/routes/attendance.routes');
const labsRouter = require('./src/routes/labs.routes');
const userRouter = require('./src/routes/user.routes');
const adminRouter = require('./src/routes/admin.routes');

const app = express();

// Configuración de seguridad
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
}));

// Límite de tasa
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Configuración de morgan para utilizar Winston
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// Análisis del cuerpo de las solicitudes entrantes en formato JSON
app.use(express.json());

// Documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
    logger.error(`Error: ${err.message}`);  // Registro del error usando Winston
    return res.status(500).json({
        message: err.message
    });
});

// Solo iniciar el servidor si no estamos en el entorno de prueba
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`); // Log de inicio del servidor
        logger.info(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
    });
}

module.exports = app;
