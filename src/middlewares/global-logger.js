const { randomUUID } = require('crypto');
const { logger } = require('../../config');
const scrubber = require('../utils/scrubber');

module.exports = (req, res, next) => {
  const logId = randomUUID();
  res.app_log_metadata = {
    id: logId,
    status_code: 100,
    type: 'http-endpoint', // This is to let us know this is not a socket error
    request: {
      body: scrubber(req.body),
      headers: scrubber(req.headers),
      query: scrubber(req.query),
      params: req.params,
      host: req.hostname,
      url: req.originalUrl,
      method: req.method,
      full_url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    },
    response: {},
    timing: {
      start_time: new Date().getTime(),
      end_time: null,
      total_time: null,
      execution_times: [
      
      ],
    },
    user: {},
    err: null,

  };
  logger.info(res.app_log_metadata, logId);

  next();
};