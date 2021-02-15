const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name field is required',
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email field is required',
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated: Date,
    password: {
        type: String,
        required: 'Password field is required',
    },
});

module.exports = mongoose.model('User', UserSchema);
