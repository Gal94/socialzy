const jwt = require('jsonwebtoken');
const config = require('../config/config');
module.exports = (req, res, next) => {
    const authorizationHeader = req.get('Authorization');

    // If header doesn't exist, user isn't logged in on client side
    if (!authorizationHeader) {
        req.isAuth = false;
        return next();
    }

    // Parse the token from the string
    const token = authorizationHeader.split(' ')[1];

    let match;
    try {
        match = jwt.verify(token, config.jwtSecret);
    } catch (err) {
        req.isAuth = false;
        return next();
    }

    if (!match) {
        req.isAuth = false;
        return next();
    }

    req.isAuth._id = match._id;
    return next();
};
