import { useEffect, useState } from "react";

export default function StudentDetail({ studentId, onBack }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    async function loadStudent() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/admin/students/${studentId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStudent(data);
      } catch (e) {
        console.error("Error loading student:", e);
      } finally {
        setLoading(false);
      }
    }

    if (studentId) loadStudent();
  }, [studentId, token]);

  if (loading) {
    return <div className="text-center py-8 text-lg">Loading student details...</div>;
  }

  if (!student) {
    return <div className="text-center py-8 text-red-600">Student not found</div>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition font-medium"
      >
        ← Back to Students
      </button>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold">{student.username}</h1>
        <p className="text-blue-100 mt-1">Student Details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">Username</label>
              <p className="text-lg font-semibold text-gray-900">{student.username}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">First Name</label>
              <p className="text-lg font-semibold text-gray-900">{student.first_name || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Last Name</label>
              <p className="text-lg font-semibold text-gray-900">{student.last_name || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Email</label>
              <p className="text-lg font-semibold text-gray-900">{student.email || "-"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">Roll Number</label>
              <p className="text-lg font-semibold text-gray-900">{student.roll_number}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Batch</label>
              <p className="text-lg font-semibold text-gray-900">{student.batch || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Date of Birth</label>
              <p className="text-lg font-semibold text-gray-900">{student.date_of_birth || "-"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm font-medium">Total Attendance</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{student.attendance_summary?.total || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm font-medium">Present</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{student.attendance_summary?.present || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm font-medium">Absent</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{student.attendance_summary?.absent || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm font-medium">Attendance Rate</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{student.attendance_summary?.percentage || 0}%</p>
        </div>
      </div>

      {/* Marks Section */}
      {student.marks && student.marks.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Marks ({student.marks.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Subject</th>
                  <th className="px-4 py-2 text-left">Exam Type</th>
                  <th className="px-4 py-2 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {student.marks.map((mark, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{mark.subject}</td>
                    <td className="px-4 py-2 capitalize">{mark.exam_type}</td>
                    <td className="px-4 py-2 text-right font-semibold text-blue-600">{mark.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendance Details Section */}
      {student.attendance && student.attendance.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Attendance Records ({student.attendance.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Subject</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {student.attendance.map((att, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{att.subject}</td>
                    <td className="px-4 py-2">{att.date}</td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          att.is_present
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {att.is_present ? "Present" : "Absent"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
