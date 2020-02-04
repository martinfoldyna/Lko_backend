const mongoose = require('mongoose');
const User = require('./../models/user.model');

const uploadsFilesSchema = new mongoose.Schema({
    length: Number,
    chunkSize: Number,
    uploadDate: Date,
    filename: String,
    md5: String,
    contentType: String,
})

// module.exports = mongoose.model('Upload Files', uploadsFilesSchema, 'uploads.files')

const photosSchema = new mongoose.Schema({
    doc_id: {
        type: String
    },
    length : {
        type: Number
    },
    name: {
        type: String
    },
    type: {
        type: String
    },
    data: String,
    subject: String,
    createdBy: Object,
    createdAt: Date
});

module.exports = mongoose.model('Photo', photosSchema);
