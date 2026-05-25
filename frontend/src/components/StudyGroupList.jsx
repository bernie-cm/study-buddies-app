import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const StudyGroupList = ({ studyGroups, setStudyGroups, setEditingGroup }) => {
  const { user } = useAuth();

  const handleDelete = async (groupId) => {
    try {
      await axiosInstance.delete(`/api/study-groups/${groupId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setStudyGroups(studyGroups.filter((group) => group._id !== groupId));
    } catch (error) {
      alert('Failed to delete study group.');
    }
  };

  if (studyGroups.length === 0) {
    return <p className="text-gray-500">No study groups found.</p>;
  }

  return (
    <div>
      {studyGroups.map((group) => {
        const isOwner = group.createdBy === user.id;
        return (
          <div key={group._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
            <h2 className="font-bold text-lg">{group.name}</h2>
            <p className="text-sm text-gray-700">
              {group.university} — {group.subject}
            </p>
            {group.description && <p className="mt-2">{group.description}</p>}
            {isOwner && (
              <div className="mt-2">
                <button
                  onClick={() => setEditingGroup(group)}
                  className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(group._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StudyGroupList;
