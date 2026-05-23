const StudyGroup = require('../models/StudyGroup');

const getStudyGroups = async (req, res) => {
    try {
        const filter = {};
        if (req.query.university) filter.university = req.query.university;
        if (req.query.subject) filter.subject = req.query.subject;

        const studyGroups = await StudyGroup.find(filter);
        res.json(studyGroups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createStudyGroup = async (req, res) => {
    try {
        const { name, university, subject, description } = req.body;
        const studyGroup = await StudyGroup.create({
            name,
            university,
            subject,
            description,
            createdBy: req.user.id,
        });
        res.status(201).json(studyGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateStudyGroup = async (req, res) => {
    try {
        const studyGroup = await StudyGroup.findById(req.params.id);
        if (!studyGroup) return res.status(404).json({ message: 'Study group not found' });

        if (studyGroup.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this study group' });
        }

        const { name, university, subject, description } = req.body;
        studyGroup.name = name || studyGroup.name;
        studyGroup.university = university || studyGroup.university;
        studyGroup.subject = subject || studyGroup.subject;
        studyGroup.description = description || studyGroup.description;

        const updated = await studyGroup.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteStudyGroup = async (req, res) => {
    try {
        const studyGroup = await StudyGroup.findById(req.params.id);
        if (!studyGroup) return res.status(404).json({ message: 'Study group not found' });

        if (studyGroup.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this study group' });
        }

        await studyGroup.deleteOne();
        res.json({ message: 'Study group deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStudyGroups, createStudyGroup, updateStudyGroup, deleteStudyGroup };
