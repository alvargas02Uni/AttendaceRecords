const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: './config/.env' });

const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerConfig');

const attendanceRouter = require('./src/routes/attendance.routes');
const labsRouter = require('./src/routes/labs.routes');
const userRouter = require('./src/routes/user.routes');
const adminRouter = require('./src/routes/admin.routes');

const app = express();

// Detectar entorno
const ENVIRONMENT = process.env.NODE_ENV || 'development';
console.log(`[INFO] Application running in ${ENVIRONMENT} mode`);

// Configuración de seguridad
app.use(helmet());

// Configuración de CORS
const allowedOrigins = [
    'http://localhost:3000',
    'https://attendance-records-551620082303.europe-southwest1.run.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
}));

// Manejo de pre-flight requests
app.options('*', cors());

// Configuración de logs (solo en desarrollo)
if (ENVIRONMENT !== 'production') {
    const morgan = require('morgan');
    const logger = require('./src/util/logger');

    app.use(morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim())
        }
    }));

    console.log(`[INFO] Logging enabled (NODE_ENV=${ENVIRONMENT})`);
}

// Análisis del cuerpo de las solicitudes entrantes en formato JSON
app.use(express.json());

// Manejo de proxy en Cloud Run para redirigir HTTP a HTTPS solo en producción
app.set('trust proxy', true);
app.use((req, res, next) => {
    if (ENVIRONMENT === 'production' && !(req.secure || req.headers['x-forwarded-proto'] === 'https')) {
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
});

// Límite de tasa
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Documentación de Swagger (evita el redirect en `/api-docs/`)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send(`Welcome to the Attendance Records API. Running in ${ENVIRONMENT} mode.`);
});

// Conectar los routers con el prefijo /api
app.use('/api/attendance', attendanceRouter);
app.use('/api/labs', labsRouter);
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);

// Manejo de errores
app.use((err, req, res, next) => {
    if (ENVIRONMENT !== 'production') {
        const logger = require('./src/util/logger');
        logger.error(`Error: ${err.message}`);
    }
    return res.status(500).json({
        message: err.message
    });
});

// Solo iniciar el servidor si no estamos en el entorno de prueba
if (ENVIRONMENT !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`[INFO] Server running on port ${PORT}`);
        console.log(`[INFO] Swagger Docs available at http://localhost:${PORT}/api-docs`);
    });
}

module.exports = app;
