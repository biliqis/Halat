const jwt = require('jsonwebtoken');
// const { isEmpty, omit } = require('lodash');
const configObj = require('../../config');
const { errorResponse } = require('../utils/responses');
const { SECRET } = require('../../config');

const unauthorizedResponse = (
  res,
  err,
  message = 'You do not have enough permission to access this resource',
) => errorResponse(res, 403, err, message);


class Middlewares {
    constructor(config = configObj) {
      this.config = config;
      this.logger = this.config.logger;
      this.verifyAllUserToken = this.verifyAllUserToken.bind(this);
    }

    async verifyAllUserToken(req, res, next) {
        const { authorization } = req.headers;
        if (!authorization) {
          return errorResponse(
            res,
            403,
            'NO_TOKEN_FOUND',
            'Unauthorized. No token found in header',
          );
        }
        try {
          // Check for falsy value or set
          const jwtToken = authorization ? authorization.split(' ')[1] : undefined;
    
          // TODO: Check for malformed token
          // const validAPIKEY = apiKey && apiKey.split('.').length === 3;
          // const validToken = jwtToken && jwtToken.split('.').length === 3;
          if (!jwtToken) {
            // Valid JWT Check
            return errorResponse(
              res,
              400,
              { token: 'TOKEN_ERROR' },
              'Token not formatted properly',
            );
          }
          if (jwtToken) {
            const user = jwt.verify(jwtToken, SECRET);
            // we  are supposed to use the data here for next level stuff!
            if(user.is_blocked){
              return unauthorizedResponse(res, 'ACCOUNT_BLOCKED');
            }
            req.user = user;
            return next();
          }
          return unauthorizedResponse(res);
        } catch (error) {
          if (error instanceof jwt.TokenExpiredError) {
            return unauthorizedResponse(res, 'EXPIRED_TOKEN',error.message);
          }
          if (error instanceof jwt.JsonWebTokenError) {
            return unauthorizedResponse(res, 'INVALID_OR_BAD_TOKEN', error.message);
          }
          return errorResponse(res, 'UNKNOWN_ERROR_OCURRED', error.message);
        }
      }
    
    
}


  module.exports = new Middlewares();