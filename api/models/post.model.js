const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: 'Text content is required',
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    created: {
        type: Date,
        default: Date.now,
    },
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
    ],
    comments: [
        {
            text: String,
            created: { type: Date, default: Date.now },
            postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
        },
    ],
});

module.exports = mongoose.model('Post', PostSchema);
