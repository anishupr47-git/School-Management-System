import { useEffect, useState } from "react";

export default function ClassDetail({ classId, onBack }) {
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    async function loadClass() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/admin/classes/${classId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setClassData(data);
      } catch (e) {
        console.error("Error loading class:", e);
      } finally {
        setLoading(false);
      }
    }

    if (classId) loadClass();
  }, [classId, token]);

  if (loading) {
    return <div className="text-center py-8 text-lg">Loading class details...</div>;
  }

  if (!classData) {
    return <div className="text-center py-8 text-red-600">Class not found</div>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition font-medium"
      >
        ← Back to Classes
      </button>

      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold">{classData.name}</h1>
        <p className="text-purple-100 mt-1">Class Details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">Class Name</label>
              <p className="text-lg font-semibold text-gray-900">{classData.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Section</label>
              <p className="text-lg font-semibold text-gray-900">{classData.section || "-"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">Academic Year</label>
              <p className="text-lg font-semibold text-gray-900">{classData.academic_year}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Homeroom Teacher</label>
              <p className="text-lg font-semibold text-gray-900">{classData.homeroom_teacher || "-"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">Total Students</label>
              <p className="text-3xl font-bold text-purple-600">{classData.students.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Students in this Class ({classData.students.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Roll Number</th>
                <th className="px-4 py-2 text-left">Batch</th>
              </tr>
            </thead>
            <tbody>
              {classData.students.length > 0 ? (
                classData.students.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{s.username}</td>
                    <td className="px-4 py-2">{s.roll_number}</td>
                    <td className="px-4 py-2">{s.batch}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                    No students enrolled in this class
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
