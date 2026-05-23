import { Plane, Moon, Sun, User, LogOut } from "lucide-react";
import { useState } from "react";
import profileImage from "../assets/profile.png";

export default function Navbar({ user, logout, theme, setTheme }) {
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Plane className="text-white" size={22} />
          </div>

          <h1 className="font-extrabold text-lg">AI TRAVEL AGENT</h1>
        </div>

        <div className="hidden md:flex gap-10 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#trips">My Trips</a>
          <button onClick={() => setOpenProfile(!openProfile)}>Profile</button>
        </div>

        <div className="relative flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="icon-btn"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button onClick={() => setOpenProfile(!openProfile)}>
            <img
              src={profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
            />
          </button>

          {openProfile && (
            <div className="absolute right-0 top-14 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {user?.name || "Traveler"}
                  </h3>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                </div>
              </div>

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <User size={17} />
                View Profile
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-slate-800"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
