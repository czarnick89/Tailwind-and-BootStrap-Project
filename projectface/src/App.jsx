import { useState, useEffect } from "react";
import "./App.css";
import WorkoutList from "./components/WorkoutList";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null); // null means logged out
  const [workouts, setWorkouts] = useState({ results: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // Optionally decode token to get username or just fetch workouts
      setUser({ username: "User" }); // Replace with real user info if available
      fetchWorkouts(accessToken);
    }
  }, []);

  const handleLogin = async ({ username, password }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json(); // ✅ { access, refresh }

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      setUser({ username }); // Or get user from token if desired

      await fetchWorkouts(data.access);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkouts = async (token) => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = token || localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token, please login");

      const response = await fetch("http://127.0.0.1:8000/api/workouts/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workouts");
      }

      const data = await response.json();
      setWorkouts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setWorkouts({ results: [] });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Login onLogin={handleLogin} />
        {error && <div className="text-danger mt-3">{error}</div>}
        {loading && <div>Loading...</div>}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button className="btn btn-outline-secondary mb-3" onClick={handleLogout}>
        Logout
      </button>
      <WorkoutList data={workouts} />
      {loading && <div>Loading workouts...</div>}
      {error && <div className="text-danger">{error}</div>}
    </div>
  );
}

export default App;
