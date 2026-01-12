import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AIChatBox from "../components/AIChatBox";
export default function Layout({ children }) {
  const navigate = useNavigate();
  const rawRole = localStorage.getItem("role") || "";
  const role = rawRole.toLowerCase().trim();
  const isAdmin = role !== "student" && role !== "teacher" && role !== "";

  const [adminView, setAdminView] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (!isAdmin) setAdminView("dashboard");
  }, [isAdmin]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
          <div className="px-5 py-4 border-b">
            <h1 className="text-xl font-semibold text-blue-700">School System</h1>
            <p className="text-xs text-gray-500 mt-1">{role ? `Role: ${role}` : "Role: -"} </p>
          </div>

          <div className="flex-1 px-5 py-4 text-sm text-gray-700 space-y-2">
            <button
              onClick={() => {
                setAdminView("dashboard");
                navigate("/dashboard");
              }}
              className="block w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              Dashboard
            </button>

            {isAdmin && (
              <>
                <button onClick={() => setAdminView("students")} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50">
                  Students
                </button>
                <button onClick={() => setAdminView("teachers")} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50">
                  Teachers
                </button>
                <button onClick={() => setAdminView("classes")} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50">
                  Classes
                </button>
                <button onClick={() => setAdminView("subjects")} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50">
                  Subjects
                </button>
              </>
            )}
          </div>

          <div className="px-4 py-4 border-t">
            <button onClick={handleLogout} className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto space-y-4">{children}</div>
        </main>
      </div>
      <AIChatBox/>
    </>
  );
}
