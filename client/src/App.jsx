import { useEffect, useState } from "react";
import axios from "axios";
import {
  Compass,
  Hotel,
  Cloud,
  MapPin,
  DollarSign,
  Send,
  LogOut,
  Moon,
  Sun,
  CheckCircle,
  XCircle,
} from "lucide-react";

import ReactMarkdown from "react-markdown";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
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

  const quickPrompts = [
    {
      icon: <Hotel size={18} />,
      text: "Find hotels in Lahore range 2500 per night",
    },
    { icon: <Cloud size={18} />, text: "What is weather in Lahore?" },
    { icon: <MapPin size={18} />, text: "Route from Srinagar to Gulmarg" },
    {
      icon: <DollarSign size={18} />,
      text: "Book me a 3-day Lahore trip from Jhang under 15000 PKR",
    },
  ];

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const fetchTrips = async (authToken = token) => {
    if (!authToken) return;

    try {
      const res = await axios.get(`${API_URL}/trips`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setSavedTrips(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
    }
  };

  const updateTrip = async () => {
    try {
      const res = await axios.patch(
        `${API_URL}/trips/${editingTrip.id}`,
        {
          destination: editForm.destination,
          days: Number(editForm.days),
          budget: Number(editForm.budget),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(res.data.message);
      setEditingTrip(null);
      fetchTrips();
    } catch (error) {
      alert("Failed to update trip");
    }
  };

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

  const confirmBooking = async (tripId) => {
    try {
      const res = await axios.patch(
        `${API_URL}/trips/${tripId}/confirm`,
        {},
        { headers: authHeaders },
      );

      alert(res.data.message);
      fetchTrips();
    } catch {
      alert("Failed to confirm booking");
    }
  };

  const cancelBooking = async (tripId) => {
    try {
      const res = await axios.patch(
        `${API_URL}/trips/${tripId}/cancel`,
        {},
        { headers: authHeaders },
      );

      alert(res.data.message);
      fetchTrips();
    } catch {
      alert("Failed to cancel booking");
    }
  };

  const handleAuth = async () => {
    try {
      const endpoint = authMode === "login" ? "/login" : "/signup";
      const payload =
        authMode === "login"
          ? { email: authForm.email, password: authForm.password }
          : authForm;

      const res = await axios.post(`${API_URL}${endpoint}`, payload);

      if (!res.data.success) {
        alert(res.data.message || "Authentication failed");
        return;
      }

      if (authMode === "signup") {
        alert("Account created. Please login.");
        setAuthMode("login");
        return;
      }

      localStorage.setItem("token", res.data.access_token);
      setToken(res.data.access_token);
      setUser(res.data.user);
      fetchTrips(res.data.access_token);
    } catch {
      alert("Authentication error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setSavedTrips([]);
  };

  useEffect(() => {
    fetchTrips();
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 px-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <Compass className="mx-auto text-blue-600 mb-3" size={42} />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              AI Travel Agent
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {authMode === "login"
                ? "Login to continue"
                : "Create your account"}
            </p>
          </div>

          {authMode === "signup" && (
            <input
              placeholder="Name"
              className="input"
              value={authForm.name}
              onChange={(e) =>
                setAuthForm({ ...authForm, name: e.target.value })
              }
            />
          )}

          <input
            placeholder="Email"
            className="input"
            value={authForm.email}
            onChange={(e) =>
              setAuthForm({ ...authForm, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            value={authForm.password}
            onChange={(e) =>
              setAuthForm({ ...authForm, password: e.target.value })
            }
          />

          <button onClick={handleAuth} className="btn-primary w-full">
            {authMode === "login" ? "Login" : "Create Account"}
          </button>

          <button
            onClick={() =>
              setAuthMode(authMode === "login" ? "signup" : "login")
            }
            className="w-full mt-4 text-blue-600 dark:text-blue-400"
          >
            {authMode === "login"
              ? "Create new account"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Travel Agent</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Hotels, weather, routes, trip planning, and bookings
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="icon-btn"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <span className="hidden sm:block text-sm text-slate-500 dark:text-slate-400">
              {user?.name || "User"}
            </span>

            <button onClick={logout} className="btn-danger">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 card">
          <h2 className="text-xl font-semibold mb-2">Ask your travel agent</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Plan a trip, check weather, find hotels, calculate routes, or create
            a draft booking.
          </p>

          <div className="flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Example: Book me a 3-day Lahore trip under 15000 PKR"
              className="input mb-0"
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                "Thinking..."
              ) : (
                <>
                  <Send size={16} /> Send
                </>
              )}
            </button>
          </div>

          <div className="mt-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 min-h-72 p-5">
            {loading && (
              <p className="animate-pulse text-slate-500">
                AI agent is checking APIs...
              </p>
            )}
            {!loading && !response && (
              <p className="text-slate-400">Your response will appear here.</p>
            )}
            {!loading && response && (
              <div className="prose dark:prose-invert max-w-none leading-7">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="card">
            <h3 className="font-semibold mb-4">Quick Actions</h3>

            <div className="space-y-3">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(prompt.text)}
                  className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700"
                >
                  {prompt.icon}
                  {prompt.text}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Saved Trips</h3>

            <div className="space-y-4">
              {savedTrips.length === 0 && (
                <p className="text-sm text-slate-400">No trips saved yet.</p>
              )}

              {savedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-400">
                      {trip.destination}
                    </h4>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        trip.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : trip.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {trip.status}
                    </span>
                  </div>

                  <p className="text-sm mt-2">Days: {trip.days}</p>
                  <p className="text-sm">Budget: PKR {trip.budget}</p>
                  <p className="text-sm">
                    Estimated: PKR {trip.estimated_cost}
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    Hotel: {trip.selected_hotel}
                  </p>

                  <div className="flex gap-2 mt-4">
                    {trip.status === "draft" && (
                      <>
                        <button
                          onClick={() => confirmBooking(trip.id)}
                          className="btn-success flex-1"
                        >
                          <CheckCircle size={15} /> Confirm
                        </button>

                        <button
                          onClick={() => {
                            setEditingTrip(trip);

                            setEditForm({
                              destination: trip.destination,
                              days: trip.days,
                              budget: trip.budget,
                            });
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex-1"
                        >
                          Edit
                        </button>
                      </>
                    )}

                    {trip.status === "confirmed" && (
                      <button
                        onClick={() => cancelBooking(trip.id)}
                        className="btn-danger flex-1"
                      >
                        <XCircle size={15} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {editingTrip && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-6 w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4">Edit Trip</h2>

                  <input
                    className="w-full mb-3 px-4 py-3 border rounded-xl"
                    value={editForm.destination}
                    onChange={(e) =>
                      setEditForm({ ...editForm, destination: e.target.value })
                    }
                    placeholder="Destination"
                  />

                  <input
                    className="w-full mb-3 px-4 py-3 border rounded-xl"
                    value={editForm.days}
                    onChange={(e) =>
                      setEditForm({ ...editForm, days: e.target.value })
                    }
                    placeholder="Days"
                  />

                  <input
                    className="w-full mb-4 px-4 py-3 border rounded-xl"
                    value={editForm.budget}
                    onChange={(e) =>
                      setEditForm({ ...editForm, budget: e.target.value })
                    }
                    placeholder="Budget"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={updateTrip}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl"
                    >
                      Save Changes
                    </button>

                    <button
                      onClick={() => setEditingTrip(null)}
                      className="flex-1 bg-gray-200 dark:bg-slate-700 text-slate-900 dark:text-white py-3 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
