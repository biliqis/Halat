const userModel = require('../models/user.model'); 
const { isEmpty } = require('lodash');
const Joi = require('joi');
const {   
    // errorResponse,
    successResponse,
  } = require('../utils/responses');
const { getPaginationData } = require('../utils/helpers');  
  
class UserController{
    constructor(dependencies = {}){
        this.logger = dependencies.logger;
        this.env = dependencies.env;    
        this.errors = dependencies.errors;
        this.getUsers = this.getUsers.bind(this);
        this.getUserByPhoneNumber = this.getUserByPhoneNumber.bind(this);
        this.changeUserBlockStatus = this.changeUserBlockStatus.bind(this);
        this.getTotalUsers = this.getTotalUsers.bind(this);
    }

    async getUserByPhoneNumber(req, res){
        this.logger.info('Request to retrieve an account');
        const user = await userModel.findOne({ phone_number: req.params.phone_number }).lean();
        if(isEmpty(user)){
            this.logger.info(`Account with phone_number ${req.params.phone_number} not found`);
            throw new this.errors.DocumentMissingError(`Account with phone_number ${req.params.phone_number} not found`);
        }
        delete user.password;
        return successResponse(
            res,
            201,
            user,
            `Users fetched successfully!!`,
          );      
    }

    async getUsers(req, res){
        const count = await userModel.countDocuments();
        const {
            records_per_page,
            offset,
            totalPages,      
        } = getPaginationData(req.query, count);
        const users = await userModel.find({})
        .skip(offset)
        .limit(records_per_page);
        const data = {
            users,
            meta: {
                count,
                totalPages
            }
        };  
        return successResponse(
            res,
            201,
            data,
            `Users fetched successfully!!`,
          );      
    }

    async changeUserBlockStatus(req,res){
        this.logger.info('Request to block user account');
        const { is_blocked } = req.body;
        const { error} = Joi.string().regex(/^[a-fA-F0-9]{24}$/).validate(req.params.id);
        if(error){
            this.logger.info(`Invalid id format id: ${req.params.id}`);
            throw new this.errors.BadRequestError(`Invalid id format id: ${req.params.id}`);
        }
        const user = await userModel.findOneAndUpdate({ 
            _id: req.params.id
        },{ is_blocked }, { 
            new: true
        });
        if(isEmpty(user)){
            this.logger.info(`User Id: ${req.params.id} not found`);
            throw new this.errors.DocumentMissingError(`User Id: ${req.params.id} not found`);
        }
        return successResponse(
            res,
            200,
            user,
            `Users updated successfully!!`,
        );  
    }

    async getTotalUsers(_req, res){
       this.logger.info('Request to get total users');
       const count = await userModel.countDocuments();
       return successResponse(
        res,
        200,
        { total_users: count },
        `Total users retrived successfully!!`,
    );  
    }

}

module.exports = UserController;