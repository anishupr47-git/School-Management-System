import { useEffect, useState } from "react";
import AIChatBox from "../../components/AIChatBox";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
export default function StudentDashboard() {
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [attendanceDetail, setAttendanceDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  
  useEffect(() => {
    async function loadData() {
      try {
        const marksRes = await fetch("http://127.0.0.1:8000/api/student/marks/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const attRes = await fetch("http://127.0.0.1:8000/api/student/attendance-summary/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const attDetailRes = await fetch("http://127.0.0.1:8000/api/student/attendance/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const marksData = await marksRes.json();
        const attData = await attRes.json();
        const attDetailData = await attDetailRes.json();
        
        console.log("student marks:", marksData);
        console.log("student attendance summary:", attData);
        setMarks(Array.isArray(marksData) ? marksData : []);
        setAttendance(attData || null);
        setAttendanceDetail(Array.isArray(attDetailData) ? attDetailData : []);
      } catch (e) {
        console.error("Error loading data:", e);
        setMarks([]);
        setAttendance(null);
        setAttendanceDetail([]);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadData();
    }
  }, [token]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">Student Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-4 text-blue-700">Attendance Overview</h2>
          {attendance ? (
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Classes:</span>
                  <span className="font-bold">{attendance.total}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Present:</span>
                  <span className="font-bold">{attendance.present}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Absent:</span>
                  <span className="font-bold">{attendance.absent}</span>
                </div>
                <div className="flex justify-between bg-white px-2 py-1 rounded">
                  <span>Percentage:</span>
                  <span className="font-bold text-lg text-blue-600">{attendance.percentage}%</span>
                </div>
              </div>
              {attendance && attendance.total > 0 ? (
                <div style={{marginTop: '20px', width: '100%', height: '200px'}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[{name: 'Present', value: attendance.present}, {name: 'Absent', value: attendance.absent}]} cx="50%" cy="50%" innerRadius={30} outerRadius={60} dataKey="value" label>
                        <Cell fill="#22c55e" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{marginTop: '20px', width: '100%', height: '200px'}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[{name: 'No Data', value: 1}]} cx="50%" cy="50%" innerRadius={30} outerRadius={60} dataKey="value" label>
                        <Cell fill="#94a3b8" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">No attendance data yet</p>
          )}
        </div>

        <div className="bg-linear-to-br from-green-50 to-green-100 p-6 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-4 text-green-700">Marks Summary</h2>
          <div className="space-y-2">
            <p className="text-gray-700">Total Records: <span className="font-bold text-lg">{marks.length}</span></p>
            {marks.length > 0 && (
              <>
                <p className="text-sm text-gray-600">Latest marks recorded</p>
                <div className="bg-white px-2 py-1 rounded text-sm">
                  {marks[0]?.subject} - {marks[0]?.score}/{marks[0]?.max_score || 100}
                </div>
              </>
            )}
            {marks.length === 0 && <p className="text-gray-600">No marks recorded yet</p>}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-4 text-blue-700">Marks by Subject</h2>
        <div style={{width: '100%', height: '300px'}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marks.length > 0 ? marks : [{subject: 'No Data', score: 0}] } margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" angle={marks.length > 0 ? -45 : 0} textAnchor={marks.length > 0 ? "end" : "middle"} height={marks.length > 0 ? 80 : 40} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-4 text-blue-700">Recent Marks</h2>
        {marks.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No marks recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Subject</th>
                  <th className="px-4 py-2 text-left">Exam Type</th>
                  <th className="px-4 py-2 text-right">Score</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((m, idx) => (
                  <tr key={m.id || idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{m.subject || "N/A"}</td>
                    <td className="px-4 py-2 capitalize">{m.exam_type}</td>
                    <td className="px-4 py-2 text-right font-semibold">{m.score}</td>
                    <td className="px-4 py-2">{m.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-4 text-blue-700">Attendance Details</h2>
        {attendanceDetail.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No attendance records yet.</p>
        ) : (
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
                {attendanceDetail.map((a, idx) => (
                  <tr key={a.id || idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{a.subject || "N/A"}</td>
                    <td className="px-4 py-2">{a.date}</td>
                    <td className="px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${a.is_present ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {a.is_present ? 'Present' : 'Absent'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AIChatBox/>
    </div>
  );
}
