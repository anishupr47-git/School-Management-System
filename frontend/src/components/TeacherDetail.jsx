import { useEffect, useState } from "react";

export default function TeacherDetail({ teacherId, onBack }) {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    async function loadTeacher() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/admin/teachers/${teacherId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTeacher(data);
      } catch (e) {
        console.error("Error loading teacher:", e);
      } finally {
        setLoading(false);
      }
    }

    if (teacherId) loadTeacher();
  }, [teacherId, token]);

  if (loading) {
    return <div className="text-center py-8 text-lg">Loading teacher details...</div>;
  }

  if (!teacher) {
    return <div className="text-center py-8 text-red-600">Teacher not found</div>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition font-medium"
      >
        ← Back to Teachers
      </button>

      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold">{teacher.username}</h1>
        <p className="text-green-100 mt-1">Teacher Details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">Username</label>
              <p className="text-lg font-semibold text-gray-900">{teacher.username}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">First Name</label>
              <p className="text-lg font-semibold text-gray-900">{teacher.first_name || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Last Name</label>
              <p className="text-lg font-semibold text-gray-900">{teacher.last_name || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Email</label>
              <p className="text-lg font-semibold text-gray-900">{teacher.email || "-"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">Employee ID</label>
              <p className="text-lg font-semibold text-gray-900">{teacher.employee_id}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Department</label>
              <p className="text-lg font-semibold text-gray-900">{teacher.department || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Phone</label>
              <p className="text-lg font-semibold text-gray-900">{teacher.phone || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
