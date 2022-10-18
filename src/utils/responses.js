const { isEmpty } = require('lodash');
const { logger } = require('../../config');

function errorResponse(res, statusCode, error, message = 'An error occurred', status = 'fail') {
  const responseObject = {
    status,
    error,
    message,
  };
  res.app_log_metadata.err = error;
  res.app_log_metadata.status_code = statusCode;
  res.app_log_metadata.response = error.error || error.message;
  res.app_log_metadata.timing.end_time = new Date().getTime();
  res.app_log_metadata.timing.total_time = res.app_log_metadata.timing.end_time
  - res.app_log_metadata.timing.start_time;

  logger.error(res.app_log_metadata, error.message);
  return res.status(statusCode).send(responseObject);
}

function successResponse(res, statusCode, data = [], message, status = 'success', meta = {}) {
  const responseObject = isEmpty(meta) ? {
    status,
    data,
    message,
  } : {
    status,
    data,
    meta,
    message,
  };
  res.app_log_metadata.status_code = statusCode;
  res.app_log_metadata.response = JSON.parse(JSON.stringify(responseObject));
  res.app_log_metadata.timing.end_time = new Date().getTime();
  res.app_log_metadata.timing.total_time = res.app_log_metadata.timing.end_time
  - res.app_log_metadata.timing.start_time;
  // logger.info(res.app_log_metadata, message);
  return res.status(statusCode).send(responseObject);
}

module.exports = {
  errorResponse,
  successResponse,
};
