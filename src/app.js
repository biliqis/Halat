require('dotenv').config();
require('express-async-errors');
const cors = require('cors');
const path = require('path');
const express = require('express');
const config = require('../config');
const routesV1 = require('./routes/v1');
const errorClasses = require('./utils/errors');
const globalLogger = require('./middlewares/global-logger');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('*', globalLogger);
app.get('/health', (req,res)=>{
  return res.status(200).send(200);
});
app.get('/', (_req, res) => res.send({ message: `Welcome to ${config.APP_NAME} server!!` }));

app.get('/api-docs', (_req, res) => res.status(200).sendFile(path.join(__dirname, '..', 'docs', 'index.html')));

app.use('/api/v1/', routesV1);

app.use((_req, res, next) => {
  const response = {
    status: 'fail',
    error: {
      trace_id: res.app_log_metadata.id,
      errorSource: '404_NOT_FOUND_ERROR',
    },
    message: 'You have entered a black hole, find your way out!',
  };
  res.app_log_metadata.status_code = 404;
  res.app_log_metadata.response = response;
  res.app_log_metadata.timing.end_time = new Date().getTime();
  res.app_log_metadata.timing.total_time = res.app_log_metadata.timing.end_time
  - res.app_log_metadata.timing.start_time;
  return res.status(404).send(response);
});

// Global Error Handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, next) => {
  const isKnownError = Object.keys(errorClasses).some(
    (e) => err instanceof errorClasses[e],
  );
  // eslint-disable-next-line no-param-reassign
  err.trace_id = res.app_log_metadata.id;

  if (!isKnownError) {
    // Wrap error in a generic error class then return response to user
    // eslint-disable-next-line no-param-reassign
    err = new errorClasses.GenericError(err.message, err);
  }
  res.app_log_metadata.err = err;
  res.app_log_metadata.status_code = err.statusCode;
  res.app_log_metadata.response = err.error || err.message;
  res.app_log_metadata.error_info = err.devStack;
  res.app_log_metadata.timing.end_time = new Date().getTime();
  res.app_log_metadata.timing.total_time = res.app_log_metadata.timing.end_time
  - res.app_log_metadata.timing.start_time;

  config.logger.error(res.app_log_metadata,
    ((err.error && err.error.message) || err.message));
  return res.status(err.statusCode).send(err.error);
});

// In a seemingly unlikely event of unhandled Promise getting rejected,
// Here is the saviour to the server not getting crashed! However,
// this should be attended to with utmost alacrity
process.on('unhandledRejection', (error) => {
  config.logger.fatal({ err: error }, error.message);
  throw error;
});

module.exports = app;