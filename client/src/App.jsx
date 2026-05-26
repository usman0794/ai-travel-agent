import { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";

import Footer from "./components/Footer";
import Trips from "./components/Trips";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Planner from "./components/Planner";
import EditModal from "./components/EditModal";
import TripDetails from "./pages/TripDetails";

import AuthScreen from "./components/AuthScreen";

// const API_URL = "http://127.0.0.1:8000";
// const API_URL = import.metanv.VITE_API_URL;

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000" ||
  "http://127.0.0.1:8000";

export default function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [savedTrips, setSavedTrips] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editingTrip, setEditingTrip] = useState(null);
  const [editForm, setEditForm] = useState({
    destination: "",
    days: "",
    budget: "",
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchTrips = async (authToken = token) => {
    if (!authToken) return;
    try {
      const res = await axios.get(`${API_URL}/trips`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setSavedTrips(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [token]);

  const sendMessage = async (customMessage) => {
    const finalMessage = customMessage || message;
    if (!finalMessage.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await axios.get(`${API_URL}/agent`, {
        params: { message: finalMessage },
        headers: authHeaders,
      });
      setResponse(
        res.data.response || res.data.message || "No response received.",
      );
      fetchTrips();
    } catch {
      setResponse("Backend error. Please make sure FastAPI server is running.");
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  const handleAuth = async () => {
    try {
      setAuthLoading(true);

      const endpoint = authMode === "login" ? "/login" : "/signup";

      const payload =
        authMode === "login"
          ? {
              email: authForm.email,
              password: authForm.password,
            }
          : authForm;

      const res = await axios.post(`${API_URL}${endpoint}`, payload);

      if (!res.data.success) {
        alert(res.data.message || "Authentication failed");
        return;
      }

      if (authMode === "signup") {
        alert("Account created successfully");
        setAuthMode("login");
        return;
      }

      localStorage.setItem("token", res.data.access_token);

      setToken(res.data.access_token);
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      fetchTrips(res.data.access_token);
    } catch {
      alert("Authentication error");
    } finally {
      setAuthLoading(false);
    }
  };

  const confirmBooking = async (tripId) => {
    const res = await axios.patch(
      `${API_URL}/trips/${tripId}/confirm`,
      {},
      { headers: authHeaders },
    );
    alert(res.data.message);
    fetchTrips();
  };

  const cancelBooking = async (tripId) => {
    const res = await axios.patch(
      `${API_URL}/trips/${tripId}/cancel`,
      {},
      { headers: authHeaders },
    );
    alert(res.data.message);
    fetchTrips();
  };

  const updateTrip = async () => {
    const res = await axios.patch(
      `${API_URL}/trips/${editingTrip.id}`,
      {
        destination: editForm.destination,
        days: Number(editForm.days),
        budget: Number(editForm.budget),
      },
      { headers: authHeaders },
    );

    alert(res.data.message);
    setEditingTrip(null);
    fetchTrips();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setSavedTrips([]);
  };

  if (!token) {
    return (
      <AuthScreen
        authLoading={authLoading}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        handleAuth={handleAuth}
      />
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-[#f6f8ff] dark:bg-slate-950 text-slate-900 dark:text-white">
            <Navbar
              user={user}
              setUser={setUser}
              logout={logout}
              theme={theme}
              setTheme={setTheme}
            />

            <Hero sendMessage={sendMessage} />

            <Services setMessage={setMessage} />

            <div id="planner">
              <Planner
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                loading={loading}
                response={response}
              />
            </div>

            <Trips
              savedTrips={savedTrips}
              confirmBooking={confirmBooking}
              cancelBooking={cancelBooking}
              setEditingTrip={setEditingTrip}
              setEditForm={setEditForm}
            />

            <Footer />

            {editingTrip && (
              <EditModal
                editForm={editForm}
                setEditForm={setEditForm}
                updateTrip={updateTrip}
                close={() => setEditingTrip(null)}
              />
            )}
          </div>
        }
      />

      <Route
        path="/trips/:id"
        element={<TripDetails savedTrips={savedTrips} />}
      />
    </Routes>
  );
}
