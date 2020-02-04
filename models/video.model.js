const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title:  {
        type: String,
        required: true
    },
    url: String,
    subject: String,
    description: String,
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
})

module.exports = mongoose.model('Video', videoSchema);