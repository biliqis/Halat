/* eslint-disable max-classes-per-file */
const GenericError = require('./base');

// ERROR DEFAULT METAS
const META = {
  HTTP_CONN: {
    code: 503, // Service Unavailable,
    message: 'The upstream server is unable to receive and process',
  },
  VALIDATION: {
    code: 422,
    message: 'Validation failed, please check your request body!',
  },

};

class ValidationError extends GenericError {
  constructor(message = META.VALIDATION.message, meta = {}) {
    super(message, meta);
    this.HTTPStatusCode = meta.statusCode || META.VALIDATION.statusCode;
    this.message = message;
    this.errorSource = 'ValidationError';
  }
}

class HTTPConnectionError extends GenericError {
  constructor(message = META.HTTP_CONN.message, meta = { statusCode: META.HTTP_CONN.code }) {
    super(message, meta);
    this.HTTPStatusCode = meta.statusCode;
    this.message = message;
  }
}

class DuplicateError extends GenericError {
  constructor(message = 'Duplicate detected', meta = { statusCode: 400 }) {
    super(message, meta);
    this.HTTPStatusCode = meta.statusCode;
    this.message = message;
  }
}

class DocumentMissingError extends GenericError {
  constructor(message = 'The resource you\'re try to access is now missing', meta = { statusCode: 200 }) {
    super(message, meta);
    this.HTTPStatusCode = meta.statusCode || 200;
    this.message = message;
  }

  get error() {
    return {
      status: 'success',
      data: [],
      message: this.message,
    };
  }
}
class BadRequestError extends GenericError {
  constructor(message = 'An error occured', meta = { statusCode: 400 }) {
    super(message, meta);
    this.HTTPStatusCode = meta.statusCode;
    this.message = message;
  }
}
class UnauthorizedError extends GenericError {
  constructor(message = 'The resource you\'re try to access is unauthorized', meta = { statusCode: 401 }) {
    super(message, meta);
    this.HTTPStatusCode = meta.statusCode;
    this.message = message;
  }
}

class ForbiddenError extends GenericError {
  constructor(message = 'The resource you\'re try to access is forbidden', meta = { statusCode: 403 }) {
    super(message, meta);
    this.HTTPStatusCode = meta.statusCode;
    this.message = message;
  }
}

class InternalServerError extends GenericError {
  constructor(message = 'This is not you, this is us', meta = { statusCode: 500 }) {
    super(message, meta);
    this.HTTPStatusCode = meta.statusCode;
    this.message = message;
  }
}
module.exports = {
  ValidationError,
  HTTPConnectionError,
  GenericError,
  DuplicateError,
  DocumentMissingError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
  InternalServerError,
};