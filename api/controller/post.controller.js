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
