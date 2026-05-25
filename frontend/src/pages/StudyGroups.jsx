import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import StudyGroupForm from '../components/StudyGroupForm';
import StudyGroupList from '../components/StudyGroupList';
import { useAuth } from '../context/AuthContext';

const StudyGroups = () => {
  const { user } = useAuth();
  const [studyGroups, setStudyGroups] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);
  const [filters, setFilters] = useState({ university: '', subject: '' });

  useEffect(() => {
    const fetchStudyGroups = async () => {
      try {
        const params = {};
        if (filters.university) params.university = filters.university;
        if (filters.subject) params.subject = filters.subject;

        const response = await axiosInstance.get('/api/study-groups', {
          headers: { Authorization: `Bearer ${user.token}` },
          params,
        });
        setStudyGroups(response.data);
      } catch (error) {
        alert('Failed to fetch study groups.');
      }
    };

    if (user) fetchStudyGroups();
  }, [user, filters]);

  return (
    <div className="container mx-auto p-6">
      <StudyGroupForm
        studyGroups={studyGroups}
        setStudyGroups={setStudyGroups}
        editingGroup={editingGroup}
        setEditingGroup={setEditingGroup}
      />

      <div className="bg-white p-4 shadow-md rounded mb-6">
        <h2 className="text-lg font-bold mb-2">Filter</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="University"
            value={filters.university}
            onChange={(e) => setFilters({ ...filters, university: e.target.value })}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Subject"
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            className="flex-1 p-2 border rounded"
          />
        </div>
      </div>

      <StudyGroupList
        studyGroups={studyGroups}
        setStudyGroups={setStudyGroups}
        setEditingGroup={setEditingGroup}
      />
    </div>
  );
};

export default StudyGroups;
