const { Router } = require('express');
const { logger, ...env } = require('../../../../config');
const { ACCOUNT_TYPE } = require('../../../utils/constants');
const errors = require('../../../utils/errors');
const rules = require('../../../validators');
const { verifyAllUserToken } = require('../../../middlewares/authenticator');
const { checkPermission } = require('../../../middlewares/accessControl');
const dependencies = {
    logger,
    env,
    errors
}

const UserController = require('../../../controllers/User.controller');

const userController = new UserController(dependencies);


const router =  new Router();
//NB all routes is has a /users prefix
router.get('/',
    verifyAllUserToken,
    checkPermission(ACCOUNT_TYPE.roles.super_admin),
    userController.getUsers);
router.get('/get-total-users',
    verifyAllUserToken,
    checkPermission(ACCOUNT_TYPE.roles.super_admin),
    userController.getTotalUsers
);
router.get('/:phone_number',verifyAllUserToken,userController.getUserByPhoneNumber);
router.patch('/change-user-block-status/:id', 
    verifyAllUserToken,
    rules('changeUserBlockStatus'),
    checkPermission(ACCOUNT_TYPE.roles.super_admin),
    userController.changeUserBlockStatus
);

module.exports = router;