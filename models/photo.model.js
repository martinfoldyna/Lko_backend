const mongoose = require('mongoose');

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
    orientation: {
        type: Number
    },
    data: String,
    originalImg: String,
    thumbnail: Boolean,
    group: String,
    subject: String,
    createdBy: Object,
    createdAt: Date,
    classYear: Number
});

module.exports = mongoose.model('Photo', photosSchema);
