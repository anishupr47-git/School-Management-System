import { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import AIChatBox from "../../components/AIChatBox";
import StudentDetail from "../../components/StudentDetail";
import TeacherDetail from "../../components/TeacherDetail";
import ClassDetail from "../../components/ClassDetail";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, studentsRes, teachersRes, classesRes, subjectsRes, attRes, analyticsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/admin/stats/", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://127.0.0.1:8000/api/admin/students/", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://127.0.0.1:8000/api/admin/teachers/", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://127.0.0.1:8000/api/admin/classes/", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://127.0.0.1:8000/api/admin/subjects/", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://127.0.0.1:8000/api/admin/attendance/", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://127.0.0.1:8000/api/admin/analytics/", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const statsData = await statsRes.json();
        const studentsData = await studentsRes.json();
        const teachersData = await teachersRes.json();
        const classesData = await classesRes.json();
        const subjectsData = await subjectsRes.json();
        const attData = await attRes.json();
        const analyticsData = await analyticsRes.json();

        setStats(statsData);
        setStudents(Array.isArray(studentsData) ? studentsData : []);
        setTeachers(Array.isArray(teachersData) ? teachersData : []);
        setClasses(Array.isArray(classesData) ? classesData : []);
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
        setAttendance(attData);
        setAnalytics(analyticsData);
      } catch (e) {
        console.error("Error loading admin data:", e);
      } finally {
        setLoading(false);
      }
    }

    if (token) loadData();
  }, [token]);

  if (loading) {
    return <div className="text-center py-8 text-lg">Loading admin dashboard...</div>;
  }

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  if (selectedStudent) {
    return <StudentDetail studentId={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  }

  if (selectedTeacher) {
    return <TeacherDetail teacherId={selectedTeacher} onBack={() => setSelectedTeacher(null)} />;
  }

  if (selectedClass) {
    return <ClassDetail classId={selectedClass} onBack={() => setSelectedClass(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-blue-100 mt-1">Complete overview of school system</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        {["overview", "students", "teachers", "classes", "subjects", "analytics"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-gray-600 text-sm font-medium">Total Students</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.students || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-gray-600 text-sm font-medium">Total Teachers</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats?.teachers || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-gray-600 text-sm font-medium">Total Classes</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats?.classes || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-gray-600 text-sm font-medium">Total Subjects</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats?.subjects || 0}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Distribution Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">System Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Students", value: stats?.students || 0 },
                      { name: "Teachers", value: stats?.teachers || 0 },
                      { name: "Classes", value: stats?.classes || 0 },
                      { name: "Subjects", value: stats?.subjects || 0 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[0, 1, 2, 3].map((index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Attendance Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
              {attendance && (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[{ name: "Attendance", Present: attendance.present, Absent: attendance.absent }]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Present" fill="#10B981" />
                      <Bar dataKey="Absent" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-gray-600 text-sm">Present</p>
                      <p className="text-2xl font-bold text-green-600">{attendance.present}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Absent</p>
                      <p className="text-2xl font-bold text-red-600">{attendance.absent}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Rate</p>
                      <p className="text-2xl font-bold text-blue-600">{attendance.percentage}%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === "students" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">All Students ({students.length})</h3>
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
                {students.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedStudent(s.id)}
                    className="border-b hover:bg-blue-50 cursor-pointer transition"
                  >
                    <td className="px-4 py-2 font-medium">{s.username}</td>
                    <td className="px-4 py-2">{s.roll_number}</td>
                    <td className="px-4 py-2">{s.batch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Teachers Tab */}
      {activeTab === "teachers" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">All Teachers ({teachers.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Username</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTeacher(t.id)}
                    className="border-b hover:bg-green-50 cursor-pointer transition"
                  >
                    <td className="px-4 py-2 font-medium">{t.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Classes Tab */}
      {activeTab === "classes" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">All Classes ({classes.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedClass(c.id)}
                className="border rounded-lg p-4 hover:shadow-lg hover:bg-purple-50 transition cursor-pointer"
              >
                <p className="font-semibold text-purple-600">{c.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subjects Tab */}
      {activeTab === "subjects" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">All Subjects ({subjects.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <div key={s.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                <p className="font-semibold text-purple-600">{s.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Marks Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.marks_by_type}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3B82F6" name="Count" />
                  <Bar dataKey="average" fill="#10B981" name="Avg Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Students by Batch</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.students_by_batch} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="batch" type="category" width={60} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm font-medium">Total Marks</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{analytics.total_marks}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm font-medium">Average Score</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{analytics.average_score.toFixed(1)}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm font-medium">Total Attendance</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{analytics.total_attendance}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm font-medium">Attendance Rate</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{analytics.attendance_percentage}%</p>
            </div>
          </div>
        </div>
      )}

      <AIChatBox />
    </div>
  );
}
