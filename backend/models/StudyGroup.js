const mongoose = require('mongoose');

const studyGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    university: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('StudyGroup', studyGroupSchema);