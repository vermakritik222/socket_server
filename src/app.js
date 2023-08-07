const express = require('express');
const cors = require('cors');
// middleware
const universalMiddleware = require('./middleware/universalMiddleware');
// routes
const healthcheckRoutes = require('./routes/healthcheck.routes');
const musicRouter = require('./routes/music.routes');
const fileRouter = require('./routes/fileUpload.routes');
const hlsStreamRouter = require('./routes/hlsStream.routes');
const jwtauthRoutes = require('./routes/jwtauth.routes');
const todoRoutes = require('./routes/apps/todo/todo.routes');
const userRoutes = require('./routes/user.routes');
// utils
const AppError = require('./utils/appError');
// controllers
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.json());

// Serving static files
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/uploads`));

// CORS Middleware
app.use(
    cors({
        origin: '*',
        credentials: true,
    })
);

// custom middleware
app.use(universalMiddleware.sendTimeStamp);

// Routes
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
    });
});

// health check
app.use('/health-check', healthcheckRoutes);

// admin
app.use('/api/v1/', userRoutes);

// auth
app.use('/api/v1/jwt', jwtauthRoutes);

// apps
app.use('/api/v1/todo', todoRoutes);
app.use('/api/v1/music', musicRouter);
app.use('/api/v1/files', fileRouter);
app.use('/api/v1/hsl', hlsStreamRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
