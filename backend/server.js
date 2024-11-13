const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

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

app.get('/', (req, res) => {
    res.send('Welcome to the Attendance Records API');
});

app.use('/attendance', attendanceRouter);
app.use('/labs', labsRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

app.use((err, req, res, next) => {
    return res.status(500).json({
        message: err.message
    });
});

module.exports = app;
