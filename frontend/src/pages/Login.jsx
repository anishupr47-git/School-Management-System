import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let res;
      try {
        res = await fetch("http://127.0.0.1:8000/api/auth/token/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
      } catch (networkErr) {

        if (!navigator.onLine) throw new Error("Network offline. Check your connection.");
        throw new Error("Network error: failed to reach backend. Check backend is running and CORS settings.");
      }
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned HTML instead of JSON. Check Django terminal logs.");
      }

      if (!res.ok) {
        throw new Error(data?.detail || "Invalid username or password");
      }

      if (!data?.access) {
        throw new Error("Login failed: no access token received");
      }

      localStorage.setItem("accessToken", data.access);
      if (data.refresh) localStorage.setItem("refreshToken", data.refresh);

      const roleRes = await fetch("http://127.0.0.1:8000/api/protected/", {
        headers: { Authorization: `Bearer ${data.access}` },
      });

      const roleText = await roleRes.text();

      let roleData;
      try {
        roleData = JSON.parse(roleText);
      } catch {
        throw new Error("Protected endpoint returned HTML. Check Django logs.");
      }

      if (!roleRes.ok) {
        throw new Error(roleData?.detail || "Failed to verify login");
      }

      if (roleData?.role) {
        localStorage.setItem("role", roleData.role);
      }

      if (typeof onLoginSuccess === "function") {
        onLoginSuccess(data.access);
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

        {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}

        <div className="mb-3">
          <label className="block text-sm mb-1">Username</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
