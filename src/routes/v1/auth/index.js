const { Router } = require('express');
const { logger, ...env } = require('../../../../config');
// const { ACCOUNT_TYPE } = require('../../../utils/constants');
const errors = require('../../../utils/errors');
const rules = require('../../../validators');
// const { verifyAllUserToken } = require('../../../middlewares/authenticator');
// const { checkPermission } = require('../../../middlewares/accessControl');
const dependencies = {
    logger,
    env,
    errors
}

const AuthController = require('../../../controllers/Auth.controller');

const authController = new AuthController(dependencies);


const router =  new Router();
//NB all routes is has a /auth prefix
router.post('/register',rules('register'),authController.register);
router.post('/login', rules('login'),authController.login);


module.exports = router;