const mongoose = require('mongoose');

const studyGroupSchema = new mongoose.Schema({
    name: { type: mongoose.Schema.Types.ObjectId, ref: 'Name', required: true },
    university: { type: mongoose.Schema.Types.ObjectId, ref: 'Name', required: true },
    description: { type: String },
    deadline: { type: Date },
});

module.exports = mongoose.model('Task', taskSchema);