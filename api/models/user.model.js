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
    about: {
        type: String,
        trim: true,
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    // The references point to users in the collection who are following/followed
    following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('User', UserSchema);
