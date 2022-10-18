const { Router } = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const router =  new Router();

router.use('/auth',authRoutes);
router.use('/users', userRoutes);

module.exports = router;

