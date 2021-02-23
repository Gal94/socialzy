const Post = require('../models/post.model');
const fs = require('fs');
const formidable = require('formidable');
const errorHandler = require('./../helpers/dbErrorHandler');

/* 
    Returns all posts by users currently being followed and owned posts
    Posts will be sorted by the created timestamp
*/
exports.listNewsFeed = async (req, res, next) => {
    let following = req.profile.following;
    following.push(req.profile._id);
    try {
        let posts = await Post.find({ postedBy: { $in: following } })
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .sort('-created')
            .exec();
        return res.json(posts);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};
/*
    Get all posts by a given user
*/
exports.getPostsByUser = async (req, res, next) => {
    try {
        let posts = await Post.find({ postedBy: req.profile._id })
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .sort('-created')
            .exec();
        return res.json(posts);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

/*
    Saves a new post on the db
*/
exports.createNewPost = async (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res
                .status(400)
                .json({ error: 'Image could not be uploaded' });
        }
        let post = new Post(fields);
        post.postedBy = req.profile;
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = file.photo.type;
        }

        try {
            let result = await post.save();
            res.json(result);
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err),
            });
        }
    });
};

exports.photo = (req, res, next) => {
    res.set('Content-Type', req.post.photo.contentType);
    return res.send(req.post.photo.data);
};

exports.postById = async (req, res, next, id) => {
    try {
        let post = await (
            await Post.findById(id).populate('postedBy', '_id name')
        ).exec();
        if (!post) {
            return res.status(400).json({
                error: 'Post not found',
            });
        }
        req.post = post;
        next();
    } catch (err) {}
};

exports.isPoster = (req, res, next) => {
    let isPoster =
        req.post && req.auth && req.post.postedBy._id == req.auth._id;
    if (!isPoster) {
        return res.status(403).json({
            error: 'User is not authorized',
        });
    }
    next();
};

exports.remove = async (req, res, next) => {
    try {
        let post = req.post;
        let deletedPost = await post.remove();
        res.json(deletedPost);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

// Add a new userId to the like list
exports.like = async (req, res, next) => {
    try {
        let result = await Post.findByIdAndUpdate(
            req.body.postId,
            { $push: { likes: req.body.userId } },
            { new: true }
        );
        res.json(result);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

// Remove the userId from the like list
exports.unlike = async (req, res, next) => {
    try {
        let result = await Post.findByIdAndUpdate(
            req.body.postId,
            {
                $pull: {
                    likes: req.body.userId,
                },
            },
            { new: true }
        );
        res.json(result);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

// push the new comment into the post comments list
exports.addComment = async (req, res, next) => {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;
    try {
        let result = await Post.findByIdAndUpdate(
            req.body.postId,
            { $push: { comments: comment } },
            { new: true }
        )
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .exec();

        res.json(result);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

exports.removeComment = async (req, res, next) => {
    let comment = req.body.comment;
    try {
        let result = await Post.findByIdAndUpdate(
            req.body.postId,
            {
                $pull: { comments: { _id: comment._id } },
            },
            { new: true }
        )
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .exec();

        res.json(result);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};
