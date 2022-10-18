const GENERIC_ERROR_MESSAGE = 'Something went wrong. We are trying to investigate the cause of this.';

class GenericError extends Error {
  constructor(message = GENERIC_ERROR_MESSAGE, meta = {}) {
    super(message);
    this.name = this.constructor.name;
    this.HTTPStatusCode = meta.statusCode || 500;
    this.message = message;
    this.errorSource = meta.errorSource || 'ApplicationError';
    Error.captureStackTrace(this, this.constructor);
    this.errors = meta.errors || [];
    this.status = meta.status || 'fail';
    this.trace_id = meta.trace_id;
  }

  get statusCode() {
    return this.HTTPStatusCode;
  }

  get devStack() {
    return {
      status: this.status,
      stack: this.stack,
      message: this.message,
      statusCode: this.statusCode,
      errorSource: this.errorSource,
      errors: this.errors,
      trace_id: this.trace_id,
    };
  }

  get error() {
    return {
      status: this.status,
      error: {
        // errors: this.errors,
        statusCode: this.statusCode,
        errorSource: this.errorSource,
        trace_id: this.trace_id,
      },
      message: this.message,
    };
  }
}

module.exports = GenericError;