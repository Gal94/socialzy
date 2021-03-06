const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../config/config');

exports.signin = async (req, res, next) => {
    try {
        // Check that a user exists
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status('401').json({ error: 'User not found' });

        // Check if passwords match
        let doesMatch;
        doesMatch = await bcrypt.compare(req.body.password, user.password);
        if (!doesMatch)
            return res.status('403').json({ error: 'Bad password' });

        // Configure jwt
        const token = jwt.sign({ _id: user._id }, config.jwtSecret);

        // Set the cookie
        res.cookie('t', token, { expire: new Date() + 9999 });

        // Return the token and user, token can be stored on localStorage
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        return res.status('401').json({ error: 'Could not sign in' });
    }
};

// Clears the cookie - will be removed from client
exports.signout = (req, res, next) => {
    res.clearCookie('t');
    res.status('200').json({ message: 'Signed out successfully.' });
};
