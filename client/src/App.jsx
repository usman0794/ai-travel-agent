import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  Plane,
  Hotel,
  CloudSun,
  MapPin,
  Wallet,
  Send,
  LogOut,
  Moon,
  Sun,
  CheckCircle,
  XCircle,
  Edit3,
  Compass,
  Sparkles,
  CalendarDays,
  ShieldCheck,
  Bookmark,
  Bot,
} from "lucide-react";
import heroImage from "./assets/travel-hero.png";
import profileImage from "./assets/profile.png";

const API_URL = "http://127.0.0.1:8000";

export default function App() {
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
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        handleAuth={handleAuth}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8ff] dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar user={user} logout={logout} theme={theme} setTheme={setTheme} />

      <Hero sendMessage={sendMessage} />

      <Services sendMessage={sendMessage} />

      <Planner
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        loading={loading}
        response={response}
      />

      <Trips
        savedTrips={savedTrips}
        confirmBooking={confirmBooking}
        cancelBooking={cancelBooking}
        setEditingTrip={setEditingTrip}
        setEditForm={setEditForm}
      />

      <CTA sendMessage={sendMessage} />

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
  );
}

function AuthScreen({
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  handleAuth,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl p-8">
        <div className="text-center mb-7">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
            <Plane className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            AI Travel Agent
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {authMode === "login" ? "Login to continue" : "Create your account"}
          </p>
        </div>

        {authMode === "signup" && (
          <input
            className="input"
            placeholder="Full name"
            value={authForm.name}
            onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
          />
        )}

        <input
          className="input"
          placeholder="Email"
          value={authForm.email}
          onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={authForm.password}
          onChange={(e) =>
            setAuthForm({ ...authForm, password: e.target.value })
          }
        />

        <button onClick={handleAuth} className="btn-primary w-full mt-2">
          {authMode === "login" ? "Login" : "Create Account"}
        </button>

        <button
          onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
          className="w-full mt-5 text-indigo-600 font-medium"
        >
          {authMode === "login"
            ? "Create new account"
            : "Already have account? Login"}
        </button>
      </div>
    </div>
  );
}

function Navbar({ user, logout, theme, setTheme }) {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center">
            <Plane className="text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl">AI Travel Agent</h1>
            <p className="text-xs text-slate-500">Smart travel companion</p>
          </div>
        </div>

        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#services">Services</a>
          <a href="#planner">Planner</a>
          <a href="#trips">My Trips</a>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <img
              src={profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
            />

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {user?.name || "Traveler"}
              </p>

              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="icon-btn"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button onClick={logout} className="btn-danger">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero({ sendMessage }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
          <Sparkles size={16} /> AI-powered travel planning
        </span>

        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight text-slate-950 dark:text-white">
          Your AI Travel Companion
        </h2>

        <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-xl">
          Plan smarter. Travel better. Let AI find hotels, weather, routes,
          budgets, and bookings in one place.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() =>
              sendMessage(
                "Book me a 3-day Lahore trip from Jhang under 15000 PKR",
              )
            }
            className="btn-primary"
          >
            Plan a Trip
          </button>

          <a href="#trips" className="btn-secondary">
            View My Trips
          </a>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <img
          src={heroImage}
          alt="Travel Hero"
          className="w-full max-w-[650px] object-contain drop-shadow-2xl"
        />
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      icon: <Bot />,
      title: "AI Trip Planning",
      desc: "Generate personalized itineraries.",
    },
    {
      icon: <Hotel />,
      title: "Hotel Search",
      desc: "Find nearby hotels using APIs.",
    },
    {
      icon: <CloudSun />,
      title: "Live Weather",
      desc: "Check real weather before travel.",
    },
    {
      icon: <MapPin />,
      title: "Routes",
      desc: "Calculate distance and travel time.",
    },
    {
      icon: <Wallet />,
      title: "Budget Friendly",
      desc: "Estimate costs based on budget.",
    },
    {
      icon: <Bookmark />,
      title: "Save & Manage",
      desc: "Draft, confirm, edit, and cancel.",
    },
  ];

  return (
    <section id="services" className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold">Our Services</h2>
        <p className="text-slate-500 mt-2">
          Everything you need for a smooth trip
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <div key={i} className="card hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
              {s.icon}
            </div>
            <h3 className="font-bold text-lg">{s.title}</h3>
            <p className="text-slate-500 mt-2">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Planner({ message, setMessage, sendMessage, loading, response }) {
  const examples = [
    "Find hotels in Lahore range 2500 per night",
    "What is weather in Lahore?",
    "Route from Srinagar to Gulmarg",
    "Book me a 3-day Kashmir trip under 15000 PKR",
  ];

  return (
    <section id="planner" className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card">
          <h2 className="text-2xl font-bold mb-2">Plan Your Trip with AI</h2>
          <p className="text-slate-500 mb-6">
            Ask your travel assistant anything.
          </p>

          <div className="min-h-80 rounded-2xl bg-slate-50 dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700">
            {loading && (
              <p className="animate-pulse text-slate-500">
                AI is checking APIs...
              </p>
            )}

            {!loading && !response && (
              <div className="text-slate-400 flex flex-col items-center justify-center h-72">
                <Compass size={48} />
                <p className="mt-4">Your AI travel plan will appear here.</p>
              </div>
            )}

            {!loading && response && (
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            )}
          </div>

          <div className="mt-5 flex gap-3">
            <input
              className="input mb-0"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
            />
            <button onClick={() => sendMessage()} className="btn-primary">
              <Send size={16} />
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold mb-4">Example Prompts</h3>
          <div className="space-y-3">
            {examples.map((e, i) => (
              <button
                key={i}
                onClick={() => sendMessage(e)}
                className="w-full text-left p-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Trips({
  savedTrips,
  confirmBooking,
  cancelBooking,
  setEditingTrip,
  setEditForm,
}) {
  const [showAllTrips, setShowAllTrips] = useState(false);

  const visibleTrips = showAllTrips ? savedTrips : savedTrips.slice(0, 3);
  return (
    <section id="trips" className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold">Your Trips</h2>
          <p className="text-slate-500">
            Manage your draft and confirmed bookings
          </p>
        </div>
        {savedTrips.length > 3 && (
          <button
            onClick={() => setShowAllTrips(!showAllTrips)}
            className="btn-primary"
          >
            {showAllTrips ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {savedTrips.length === 0 ? (
        <div className="card text-center text-slate-500">
          No trips saved yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {visibleTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              confirmBooking={confirmBooking}
              cancelBooking={cancelBooking}
              setEditingTrip={setEditingTrip}
              setEditForm={setEditForm}
            />
          ))}
        </div>
      )}
    </section>
  );
}

const getTripImage = (destination) => {
  const city = destination?.toLowerCase() || "";

  if (city.includes("lahore")) {
    return "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80";
  }

  if (city.includes("islamabad")) {
    return "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=800&q=80";
  }

  if (city.includes("kashmir") || city.includes("srinagar")) {
    return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80";
  }

  return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";
};

function TripCard({
  trip,
  confirmBooking,
  cancelBooking,
  setEditingTrip,
  setEditForm,
}) {
  const imageUrl = getTripImage(trip.destination);

  const badge =
    trip.status === "confirmed"
      ? "bg-green-500 text-white"
      : trip.status === "cancelled"
        ? "bg-red-500 text-white"
        : "bg-indigo-500 text-white";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="relative">
        <img
          src={imageUrl}
          alt={trip.destination}
          className="w-full h-44 object-cover"
        />

        <span
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${badge}`}
        >
          {trip.status === "draft"
            ? "Draft"
            : trip.status === "confirmed"
              ? "Confirmed"
              : "Cancelled"}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-4">{trip.destination}</h3>

        <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
          <span>📅 {trip.days} Days</span>
          <span>💰 ${Math.round(trip.estimated_cost / 280)}</span>
        </div>

        <p className="text-sm text-slate-500 mb-5">
          Hotel: {trip.selected_hotel || "Not selected"}
        </p>

        {trip.status === "draft" && (
          <div className="flex gap-3">
            <button
              onClick={() => confirmBooking(trip.id)}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold"
            >
              Confirm
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
              className="flex-1 border border-indigo-300 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50"
            >
              Edit
            </button>
          </div>
        )}

        {trip.status === "confirmed" && (
          <button
            onClick={() => cancelBooking(trip.id)}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
          >
            Cancel
          </button>
        )}

        {trip.status === "cancelled" && (
          <p className="text-center text-sm text-slate-400 py-3">
            No actions available
          </p>
        )}
      </div>
    </div>
  );
}

function EditModal({ editForm, setEditForm, updateTrip, close }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-[2rem] p-7 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-5">Edit Trip</h2>

        <input
          className="input"
          value={editForm.destination}
          onChange={(e) =>
            setEditForm({ ...editForm, destination: e.target.value })
          }
          placeholder="Destination"
        />

        <input
          className="input"
          value={editForm.days}
          onChange={(e) => setEditForm({ ...editForm, days: e.target.value })}
          placeholder="Days"
        />

        <input
          className="input"
          value={editForm.budget}
          onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
          placeholder="Budget"
        />

        <div className="flex gap-3 mt-4">
          <button onClick={updateTrip} className="btn-success flex-1">
            Save
          </button>
          <button onClick={close} className="btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function CTA({ sendMessage }) {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-16">
      <div className="rounded-[2rem] bg-gradient-to-r from-indigo-600 to-blue-600 p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
        <div>
          <h2 className="text-3xl font-extrabold">
            Ready to explore the world?
          </h2>
          <p className="text-blue-100 mt-2">
            Let AI plan your perfect journey today.
          </p>
        </div>
        <button
          onClick={() => sendMessage("Plan me a budget friendly 3 day trip")}
          className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold"
        >
          Plan a Trip Now
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <a
          href="mailto:usmanjami794@gmail.com"
          className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
        >
          usmanjami794@gmail.com
        </a>

        <p className="text-slate-500 text-sm mt-2">© 2026 AI Travel Agent</p>
      </div>
    </footer>
  );
}
