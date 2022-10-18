const { isEmpty } = require('lodash');
const { logger } = require('../../config');

const {UnauthorizedError, BadRequestError} = require('../utils/errors');
exports.checkPermission = (account_type) => (req, _res, next) => {
   logger.info(`Accesscontrol check for account type ${account_type}`);
   if(isEmpty(req.user)){
      logger.info('No user found in the request'); 
      throw new BadRequestError('No user found in the request');
   }

   if(account_type.includes(req.user.account_type)){
       logger.info(`Check for ${account_type} successful`);
       return next();
   }

   throw new UnauthorizedError(`${req.user.email} is not allowed to make the request`);
}