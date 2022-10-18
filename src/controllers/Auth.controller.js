const jwt = require('jsonwebtoken');
const { isEmpty } = require('lodash');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');  
const {   
    // errorResponse,
    successResponse,
  } = require('../utils/responses');

  
class AuthController{
    constructor(dependencies = {}){
        this.logger = dependencies.logger;
        this.env = dependencies.env;    
        this.errors = dependencies.errors;
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    static generateToken(payload, expiresIn = process.env.EXPIRES_IN || '25d') {
        return jwt.sign(payload, process.env.SECRET, { expiresIn });
    }
    

    async register(req, res){
        this.logger.info('Request to register an account');
        const checkIfUserExist = await userModel.findOne({ phone_number: req.body.phone_number }).lean();
        if(checkIfUserExist){
            this.logger.info('User account already exist');
            throw new this.errors.BadRequestError('User account already exist');
        }
        const data = await userModel.create(req.body);
        this.logger.info('Account created successfully');
        return successResponse(
            res,
            201,
            data,
            `Registration successfull`,
          );      
    }

    async login(req, res){
      const { phone_number, password } = req.body;
      this.logger.info(`Request to login an account with phone_number ${phone_number}`);
      const user = await userModel.findOne({ phone_number }).lean();
      if(isEmpty(user)){
        this.logger.info(`User account ${phone_number} not found`);
        throw new this.errors.BadRequestError(`User account ${phone_number} not found`);
      }
      if(user.is_blocked){
        this.logger.info(`User account ${phone_number} has already been blocked`);
        throw new this.errors.UnauthorizedError(`User account ${phone_number} has already been blocked`);
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        this.logger.warn(res.app_log_metadata,
          `User with phone_number ${phone_number} tried to sign in with a wrong password`);
  
        throw new this.errors.UnauthorizedError(
          'Account details supplied is incorrect, please check and try again',
        );
      }
  
      delete user.password;
      const token = this.constructor.generateToken(user, process.env.EXPIRES_IN);
      const data = { ...user, token };
      this.logger.info(`Login successfull`);
      return successResponse(
        res,
        201,
        data,
        `Login successfull`,
      );      
    }
}

module.exports = AuthController;