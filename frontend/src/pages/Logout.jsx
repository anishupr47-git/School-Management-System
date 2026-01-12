import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    const timer = setTimeout(() => navigate("/login", { replace: true }), 500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border rounded-xl shadow-sm px-6 py-4 text-center">
        <p className="text-sm text-gray-700 font-medium">Logging you out…</p>
      </div>
    </div>
  );
}
