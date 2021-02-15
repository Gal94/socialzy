//TODO - Add express-validator for routes

const express = require('express');
const userController = require('../controller/user.controller');

const router = express.Router();

// Instead of writing an authentication checker middleware
router.param('userId', userController.userByID);

router.route('/').get(userController.list).post(userController.create);

router
    .route('/:userId')
    .get(userController.read)
    .put(userController.update)
    .delete(userController.remove);

module.exports = router;
