// External Dependencies
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Internal Dependencies
const globalErrorHandler = require('./utils/globalErrorHandler');
const AppError = require('./utils/appError');

const app = express();

// MIDDLEWARE
app.use(helmet()); // Set security to HTTP headers
app.use(morgan('dev')); // Logging
app.use(express.json({ limit: '10kb' })); // Body parser
app.use(mongoSanitize()); // Sanitize data to prevent query injection
app.use(xss()); //Sanitize data against XSS attack
app.use(hpp()); // Prevent parameter pollution

// ROUTES
app.use('/api/v1/auth', require('./routes/authRoutes'));

// Error Handler
app.all('*', (req, res, next) => {
  next(new AppError(`No path for ${req.originalUrl} in this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
