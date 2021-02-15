const User = require('../models/user.model');
const extend = require('lodash/extend');
const bcrypt = require('bcrypt');
// const errorHandler = require('./error.controller');

exports.create = async (req, res, next) => {
    let hashedPassword;
    const requestBody = req.body;
    // Encrypt the password
    try {
        hashedPassword = await bcrypt.hash(req.body.password, 12);
    } catch (err) {
        return res.status(500).json({
            error: errorHandler.getErrorMessage(err),
        });
    }

    // Create a new user object
    const user = new User({ ...requestBody, password: hashedPassword });
    try {
        await user.save();
        return res.status(200).json({
            message: 'Successfully signed up!',
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

exports.list = async (req, res, next) => {
    try {
        let users = await User.find().select('name email updated created');
        res.json(users);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

// Also gets the parameter
exports.userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id);
        if (!user)
            return res.status('400').json({
                error: 'User not found',
            });
        req.profile = user;
        next();
    } catch (err) {
        return res.status('400').json({
            error: 'Could not retrieve user',
        });
    }
};

// Remove sensitive information fields
exports.read = (req, res, next) => {
    req.profile.password = undefined;
    return res.json(req.profile);
};

exports.update = async (req, res, next) => {
    try {
        let user = req.profile;
        // Extends and merges the changes from req.body to user (lodash)
        user = extend(user, req.body);
        user.updated = Date.now();
        await user.save();
        user.password = undefined;
        res.json(user);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

exports.remove = async (req, res, next) => {
    try {
        let user = req.profile;
        let deletedUser = await user.remove();
        deletedUser.password = undefined;

        res.json(deletedUser);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};
