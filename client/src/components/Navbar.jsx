import { Plane, Moon, Sun, LogOut } from "lucide-react";
import profileImage from "../assets/profile.png";

export default function Navbar({ user, logout, theme, setTheme }) {
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
