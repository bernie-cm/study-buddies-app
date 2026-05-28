const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const StudyGroup = require('../models/StudyGroup');
const {
  getStudyGroups,
  createStudyGroup,
  updateStudyGroup,
  deleteStudyGroup,
} = require('../controllers/studyGroupController');

const { expect } = chai;

// Restore all stubs after each test so the same model method can be re-stubbed.
afterEach(() => {
  sinon.restore();
});

describe('createStudyGroup', () => {
  it('should create a study group successfully', async () => {
    const userId = new mongoose.Types.ObjectId();
    const req = {
      user: { id: userId },
      body: {
        name: 'Maths Crew',
        university: 'QUT',
        subject: 'Maths',
        description: 'weekly sessions',
      },
    };

    const createdGroup = { _id: new mongoose.Types.ObjectId(), ...req.body, createdBy: userId };
    const createStub = sinon.stub(StudyGroup, 'create').resolves(createdGroup);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createStudyGroup(req, res);

    expect(
      createStub.calledOnceWith({
        name: 'Maths Crew',
        university: 'QUT',
        subject: 'Maths',
        description: 'weekly sessions',
        createdBy: userId,
      })
    ).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdGroup)).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    sinon.stub(StudyGroup, 'create').throws(new Error('DB Error'));

    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { name: 'Maths Crew', university: 'QUT', subject: 'Maths' },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createStudyGroup(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});

describe('getStudyGroups', () => {
  it('should return all study groups when no filter is provided', async () => {
    const groups = [
      { _id: new mongoose.Types.ObjectId(), name: 'Group 1' },
      { _id: new mongoose.Types.ObjectId(), name: 'Group 2' },
    ];
    const findStub = sinon.stub(StudyGroup, 'find').resolves(groups);

    const req = { query: {} };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await getStudyGroups(req, res);

    expect(findStub.calledOnceWith({})).to.be.true;
    expect(res.json.calledWith(groups)).to.be.true;
    expect(res.status.called).to.be.false;
  });

  it('should filter by university and subject from the query string', async () => {
    const findStub = sinon.stub(StudyGroup, 'find').resolves([]);

    const req = { query: { university: 'QUT', subject: 'Maths' } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await getStudyGroups(req, res);

    expect(findStub.calledOnceWith({ university: 'QUT', subject: 'Maths' })).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    sinon.stub(StudyGroup, 'find').throws(new Error('DB Error'));

    const req = { query: {} };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await getStudyGroups(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});

describe('updateStudyGroup', () => {
  it('should update a study group successfully when the user is the creator', async () => {
    const userId = new mongoose.Types.ObjectId();
    const existingGroup = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Old Name',
      university: 'QUT',
      subject: 'Maths',
      description: 'old',
      createdBy: userId,
      save: sinon.stub().resolvesThis(),
    };
    sinon.stub(StudyGroup, 'findById').resolves(existingGroup);

    const req = {
      params: { id: existingGroup._id },
      user: { id: userId.toString() },
      body: { name: 'New Name', description: 'updated' },
    };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await updateStudyGroup(req, res);

    expect(existingGroup.name).to.equal('New Name');
    expect(existingGroup.description).to.equal('updated');
    expect(existingGroup.university).to.equal('QUT'); // unchanged field preserved
    expect(existingGroup.save.calledOnce).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.status.calledWith(404)).to.be.false;
    expect(res.status.calledWith(403)).to.be.false;
  });

  it('should return 404 if the study group is not found', async () => {
    sinon.stub(StudyGroup, 'findById').resolves(null);

    const req = {
      params: { id: new mongoose.Types.ObjectId() },
      user: { id: new mongoose.Types.ObjectId().toString() },
      body: {},
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateStudyGroup(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Study group not found' })).to.be.true;
  });

  it('should return 403 if the user is not the creator', async () => {
    const existingGroup = {
      _id: new mongoose.Types.ObjectId(),
      createdBy: new mongoose.Types.ObjectId(),
      save: sinon.stub().resolvesThis(),
    };
    sinon.stub(StudyGroup, 'findById').resolves(existingGroup);

    const req = {
      params: { id: existingGroup._id },
      user: { id: new mongoose.Types.ObjectId().toString() }, // different user
      body: { name: 'Hacked' },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateStudyGroup(req, res);

    expect(res.status.calledWith(403)).to.be.true;
    expect(existingGroup.save.called).to.be.false;
  });

  it('should return 500 if an error occurs', async () => {
    sinon.stub(StudyGroup, 'findById').throws(new Error('DB Error'));

    const req = {
      params: { id: new mongoose.Types.ObjectId() },
      user: { id: new mongoose.Types.ObjectId().toString() },
      body: {},
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateStudyGroup(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});

describe('deleteStudyGroup', () => {
  it('should delete a study group successfully when the user is the creator', async () => {
    const userId = new mongoose.Types.ObjectId();
    const existingGroup = {
      _id: new mongoose.Types.ObjectId(),
      createdBy: userId,
      deleteOne: sinon.stub().resolves(),
    };
    sinon.stub(StudyGroup, 'findById').resolves(existingGroup);

    const req = {
      params: { id: existingGroup._id.toString() },
      user: { id: userId.toString() },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteStudyGroup(req, res);

    expect(existingGroup.deleteOne.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Study group deleted' })).to.be.true;
  });

  it('should return 404 if the study group is not found', async () => {
    sinon.stub(StudyGroup, 'findById').resolves(null);

    const req = {
      params: { id: new mongoose.Types.ObjectId().toString() },
      user: { id: new mongoose.Types.ObjectId().toString() },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteStudyGroup(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Study group not found' })).to.be.true;
  });

  it('should return 403 if the user is not the creator', async () => {
    const existingGroup = {
      _id: new mongoose.Types.ObjectId(),
      createdBy: new mongoose.Types.ObjectId(),
      deleteOne: sinon.stub().resolves(),
    };
    sinon.stub(StudyGroup, 'findById').resolves(existingGroup);

    const req = {
      params: { id: existingGroup._id.toString() },
      user: { id: new mongoose.Types.ObjectId().toString() }, // different user
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteStudyGroup(req, res);

    expect(res.status.calledWith(403)).to.be.true;
    expect(existingGroup.deleteOne.called).to.be.false;
  });

  it('should return 500 if an error occurs', async () => {
    sinon.stub(StudyGroup, 'findById').throws(new Error('DB Error'));

    const req = {
      params: { id: new mongoose.Types.ObjectId().toString() },
      user: { id: new mongoose.Types.ObjectId().toString() },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteStudyGroup(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});
