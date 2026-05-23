const express = require('express');
const { getStudyGroups, createStudyGroup, updateStudyGroup, deleteStudyGroup } = require('../controllers/studyGroupController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getStudyGroups);
router.post('/', protect, createStudyGroup);
router.put('/:id', protect, updateStudyGroup);
router.delete('/:id', protect, deleteStudyGroup);

module.exports = router;