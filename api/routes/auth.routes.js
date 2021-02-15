const express = require('express');
const authController = require('../controller/auth.controller');

const router = express.Router();

router.route('/signin').post(authController.signin);
router.route('/signout').get(authController.signout);

module.exports = router;
