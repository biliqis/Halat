require('dotenv').config()
const pino = require('pino');
const { 
    NODE_ENV, 
    DATABASE_URL, 
    PORT, 
    EXPIRES_IN,
    SECRET,
    ...rest
 } = process.env;

let logger = pino();
if(NODE_ENV !== 'production'){
   logger = pino({ prettyPrint: { colorize: true }});
}

module.exports = {
  ...rest,
  NODE_ENV,
  DATABASE_URL,
  PORT,
  EXPIRES_IN,
  SECRET,
  logger,
}