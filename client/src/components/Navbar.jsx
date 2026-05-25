import {
  Plane,
  Moon,
  Sun,
  LogOut,
  Upload,
  Pencil,
  Lock,
  Bell,
  UserCircle,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import profileImage from "../assets/profile.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Navbar({ user, setUser, logout, theme, setTheme }) {
  const [openProfile, setOpenProfile] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Default avatar image
  const profilePic = user?.profile_picture || profileImage;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/profile/upload-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const updatedUser = {
        ...user,
        profile_picture: res.data.profile_picture,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Upload error:", error.response?.data || error);

      alert(error.response?.data?.detail || "Profile picture upload failed");
    } finally {
      setUploading(false);
    }
  };

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
        </div>

        <div className="relative flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="icon-btn"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Click profile picture to show all options */}
          <button onClick={() => setOpenProfile(!openProfile)}>
            <img
              src={profilePic}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
            />
          </button>

          {openProfile && (
            <div className="absolute right-0 top-14 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {user?.name || "Traveler"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {user?.email || "No email"}
                  </p>
                </div>
              </div>

              <label className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                <Upload size={17} />
                {uploading ? "Uploading..." : "Upload Picture"}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <Pencil size={17} />
                Edit Profile
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <Lock size={17} />
                Change Password
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <Bell size={17} />
                Notification Settings
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
