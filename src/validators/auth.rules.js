const joi = require('joi');
const requiredStr = joi.string().required();
const mongoID = joi.string().regex(/^[a-fA-F0-9]{24}$/);

const { ACCOUNT_TYPE } = require('../utils/constants');

const keys = (object) => joi.object().keys(object);


exports.login = keys({
  phone_number: joi.number().required(),
  password: requiredStr 
});


exports.register = keys({
  phone_number: joi.number().required(),
  email: requiredStr
  .min(7)
  .max(50)
  .description("User's valid email address"),
  first_name: requiredStr,
  last_name: requiredStr,
  password: requiredStr,
  account_type: joi.string().valid(ACCOUNT_TYPE.roles.customer),  
})

