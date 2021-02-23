const express = require('express');
const postController = require('../controller/post.controller');
const userController = require('../controller/user.controller');
const isAuthenticated = require('../middlewares/auth').isAuthenticated;

const router = express.Router();

router.param('userId', userController.userByID);
router.param('postId', postController.postById);
router.route('/like').put(isAuthenticated, postController.like);
router.route('/unlike').put(isAuthenticated, postController.unlike);
router.route('/comment').put(isAuthenticated, postController.addComment);
router.route('/uncomment').put(isAuthenticated, postController.removeComment);
router.route('/feed/:userId').get(isAuthenticated, postController.listNewsFeed);
router.route('/by/:userId').get(isAuthenticated, postController.getPostsByUser);
router
    .route('/new/:userId')
    .post(isAuthenticated, postController.createNewPost);
router.route('/photo/:postId').get(postController.photo);
router
    .route('/:postId')
    .delete(isAuthenticated, postController.isPoster, postController.remove);

module.exports = router;
