import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const StudyGroupForm = ({ studyGroups, setStudyGroups, editingGroup, setEditingGroup }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    subject: '',
    description: '',
  });

  useEffect(() => {
    if (editingGroup) {
      setFormData({
        name: editingGroup.name || '',
        university: editingGroup.university || '',
        subject: editingGroup.subject || '',
        description: editingGroup.description || '',
      });
    } else {
      setFormData({ name: '', university: '', subject: '', description: '' });
    }
  }, [editingGroup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGroup) {
        const response = await axiosInstance.put(
          `/api/study-groups/${editingGroup._id}`,
          formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setStudyGroups(
          studyGroups.map((group) =>
            group._id === response.data._id ? response.data : group
          )
        );
      } else {
        const response = await axiosInstance.post('/api/study-groups', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setStudyGroups([...studyGroups, response.data]);
      }
      setEditingGroup(null);
      setFormData({ name: '', university: '', subject: '', description: '' });
    } catch (error) {
      alert('Failed to save study group.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingGroup ? 'Edit Study Group' : 'Create Study Group'}
      </h1>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="University"
        value={formData.university}
        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Subject"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingGroup ? 'Update Group' : 'Create Group'}
      </button>
      {editingGroup && (
        <button
          type="button"
          onClick={() => setEditingGroup(null)}
          className="w-full mt-2 bg-gray-300 text-gray-800 p-2 rounded"
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default StudyGroupForm;
