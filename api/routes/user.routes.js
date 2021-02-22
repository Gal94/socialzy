//TODO - Add express-validator for routes

const express = require('express');
const userController = require('../controller/user.controller');
const isAuthorized = require('../middlewares/auth').isAuthorized;
const isAuthenticated = require('../middlewares/auth').isAuthenticated;

const router = express.Router();

// Will be invoked every time userId is passed as a parameter
router.param('userId', userController.userByID);

router.route('/').get(userController.list).post(userController.create);

router.route('/defaultphoto').get(userController.defaultPhoto);

router
    .route('/follow')
    .put(
        isAuthenticated,
        userController.addFollowing,
        userController.addFollower
    );
router
    .route('/unfollow')
    .put(
        isAuthenticated,
        userController.removeFollowing,
        userController.removeFollower
    );

router
    .route('/photo/:userId')
    .get(userController.photo, userController.defaultPhoto);

router
    .route('/:userId')
    .get(isAuthenticated, userController.read)
    .put(isAuthenticated, isAuthorized, userController.update)
    .delete(isAuthenticated, isAuthorized, userController.remove);

router
    .route('/findpeople/:userId')
    .get(isAuthenticated, userController.findPeople);

module.exports = router;
