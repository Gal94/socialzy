const User = require('../models/user.model');
const extend = require('lodash/extend');
const bcrypt = require('bcrypt');
const formidable = require('formidable');
const fs = require('fs');
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

// Returns a list of all users
exports.list = async (req, res, next) => {
    try {
        let users = await User.find().select(
            'name email updated created photo'
        );
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

// Returns single user
// Remove sensitive information fields
exports.read = (req, res, next) => {
    req.profile.password = undefined;
    return res.json(req.profile);
};

// Updates a user
// exports.update = async (req, res, next) => {
//     // Parse the incoming form - pass a cb upon execution
//     let form = new formidable.IncomingForm();
//     form.keepExtensions = true;
//     form.parse(req, async (err, fields, files) => {
//         if (err) {
//             console.log(err);
//             return res
//                 .status(400)
//                 .json({ error: 'Photo could not be uploaded' });
//         }
//         let user = req.profile;
//         // Extends and merges the changes from the parsed fields to user (lodash)
//         user = extend(user, fields);
//         user.updated = Date.now();

//         // File is stored temporarily on the filesystem - deleted upon completion
//         if (files.photo) {
//             user.photo.data = fs.readFileSync(file.photo.path);
//             user.photo.contentType = files.photo.type;
//         }
//         try {
//             await user.save();
//             user.password = undefined;
//             res.json(user);
//         } catch (err) {
//             return res.status(400).json({
//                 error: errorHandler.getErrorMessage(err),
//             });
//         }
//     });
// };

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: 'Photo could not be uploaded',
            });
        }
        let user = req.profile;
        user = extend(user, fields);
        user.updated = Date.now();
        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }
        try {
            await user.save();
            user.password = undefined;
            res.json(user);
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err),
            });
        }
    });
};

// Deletes a user
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

exports.photo = (req, res, next) => {
    // if photo is found in profile
    if (req.profile.photo.data) {
        res.set('Content-Type', req.profile.photo.contentType);
        return res.send(req.profile.photo.data);
    }
    next();
};

exports.defaultPhoto = (req, res) => {
    console.log(process.cwd());
    return res.sendFile(process.cwd() + '/uploads/images/profile-pic.png');
};
