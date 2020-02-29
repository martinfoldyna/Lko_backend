const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
    },
    url: String,
    subject: String,
    thumbnail: String,
    createdAt: {
        type: Date,
        required: true
    },
    createdBy: {
        type: Object,
        required: true,
    },
    updatedBy: {
        type: Object
    },
    updatedAt: {
        type: Date
    },
    images: {
        type: Buffer,
        contentType: String
    }
})

module.exports = mongoose.model('Post', postSchema);
