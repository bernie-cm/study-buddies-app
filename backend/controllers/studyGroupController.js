const StudyGroup = require('../models/StudyGroup');

const getStudyGroups = async(req, res) => {
    try {
        const studyGroups = await StudyGroup.find({groupId: req.group.id});
        res.json(studyGroups);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};