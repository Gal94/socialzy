//TODO - Add express-validator for routes

const express = require('express');
const userController = require('../controller/user.controller');
const isAuthorized = require('../middlewares/auth').isAuthorized;

const router = express.Router();

// Will be invoked every time userId is passed as a parameter
router.param('userId', userController.userByID);

router.route('/').get(userController.list).post(userController.create);

router.route('/defaultphoto').get(userController.defaultPhoto);

router
    .route('/follow')
    .put(isAuthorized, userController.addFollowing, userController.addFollower);
router
    .route('/unfollow')
    .put(
        isAuthorized,
        userController.removeFollowing,
        userController.removeFollower
    );

router
    .route('/photo/:userId')
    .get(userController.photo, userController.defaultPhoto);

router
    .route('/:userId')
    .get(isAuthorized, userController.read)
    .put(isAuthorized, userController.update)
    .delete(isAuthorized, userController.remove);

module.exports = router;
