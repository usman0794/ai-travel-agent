import {
  Plane,
  Moon,
  Sun,
  LogOut,
  Upload,
  Pencil,
  Lock,
  Bell,
  ChevronRight,
  X,
  Check,
  MapPin,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import profileImage from "../assets/profile.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Navbar({ user, setUser, logout, theme, setTheme }) {
  const [openProfile, setOpenProfile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const profileRef = useRef(null);
  const editModalRef = useRef(null);
  const submenuTimeoutRef = useRef(null);
  const securityButtonRef = useRef(null);
  const notificationsButtonRef = useRef(null);

  const profilePic = user?.profile_picture || profileImage;

  const handleMenuItemHover = (menuId) => {
    if (submenuTimeoutRef.current) clearTimeout(submenuTimeoutRef.current);
    setActiveSubmenu(menuId);
  };

  const handleSubmenuLeave = () => {
    submenuTimeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null);
    }, 150);
  };

  const handleMenuItemLeave = () => {
    submenuTimeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null);
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
        setActiveSubmenu(null);
      }

      if (
        openEdit &&
        editModalRef.current &&
        !editModalRef.current.contains(event.target)
      ) {
        setOpenEdit(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (submenuTimeoutRef.current) clearTimeout(submenuTimeoutRef.current);
    };
  }, [openEdit]);

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

      setOpenProfile(false);
    } catch (error) {
      console.error("Upload error:", error.response?.data || error);
      alert(error.response?.data?.detail || "Profile picture upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) {
      alert("Name cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/profile/update`,
        { name: editName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedUser = {
        ...user,
        name: editName,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setOpenEdit(false);
    } catch (error) {
      console.error("Update error:", error);
      alert(error.response?.data?.detail || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleYourTrips = () => {
    const tripsSection = document.getElementById("trips");
    if (tripsSection) {
      tripsSection.scrollIntoView({ behavior: "smooth" });
      setOpenProfile(false);
    }
  };

  return (
    <>
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
            <a href="#planner">Plan Trip</a>
            <button
              onClick={handleYourTrips}
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1"
            >
              Your Trips
            </button>
          </div>

          <div ref={profileRef} className="relative flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="icon-btn"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button onClick={() => setOpenProfile((prev) => !prev)}>
              <img
                src={profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow cursor-pointer hover:opacity-80 transition-opacity"
              />
            </button>

            {/* Profile Dropdown */}
            {openProfile && (
              <div className="absolute right-0 top-14 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Info Header */}
                <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                      {user?.name || "Traveler"}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">
                      {user?.email || "No email"}
                    </p>
                  </div>
                </div>

                {/* Menu Items Container */}
                <div className="p-2">
                  {/* Your Trips in Dropdown */}
                  <button
                    onClick={handleYourTrips}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <MapPin
                      size={17}
                      className="text-slate-500 group-hover:text-slate-700 dark:text-slate-400"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Your Trips
                    </span>
                  </button>

                  {/* Upload Picture */}
                  <label className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                    <Upload
                      size={17}
                      className="text-slate-500 group-hover:text-slate-700 dark:text-slate-400"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {uploading ? "Uploading..." : "Upload Picture"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>

                  {/* Edit Profile */}
                  <button
                    onClick={() => {
                      setEditName(user?.name || "");
                      setOpenProfile(false);
                      setOpenEdit(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <Pencil
                      size={17}
                      className="text-slate-500 group-hover:text-slate-700 dark:text-slate-400"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Edit Profile
                    </span>
                  </button>

                  {/* Security & Privacy - WITH SUBMENU */}
                  <div
                    ref={securityButtonRef}
                    onMouseEnter={() => handleMenuItemHover("security")}
                    onMouseLeave={handleMenuItemLeave}
                  >
                    <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Lock
                          size={17}
                          className="text-slate-500 group-hover:text-slate-700 dark:text-slate-400"
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Security & Privacy
                        </span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>
                  </div>

                  {/* Notifications - WITH SUBMENU */}
                  <div
                    ref={notificationsButtonRef}
                    onMouseEnter={() => handleMenuItemHover("notifications")}
                    onMouseLeave={handleMenuItemLeave}
                  >
                    <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Bell
                          size={17}
                          className="text-slate-500 group-hover:text-slate-700 dark:text-slate-400"
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Notifications
                        </span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="my-2 border-t border-slate-100 dark:border-slate-800"></div>

                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors group"
                  >
                    <LogOut size={17} className="text-red-500" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      Logout
                    </span>
                  </button>
                </div>

                {/* Security Submenu */}
                {activeSubmenu === "security" && securityButtonRef.current && (
                  <div
                    className="fixed bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden animate-in fade-in slide-in-from-left-1 duration-150"
                    style={{
                      top: securityButtonRef.current.getBoundingClientRect()
                        .top,
                      left:
                        securityButtonRef.current.getBoundingClientRect().left -
                        288 -
                        8,
                      width: "288px",
                    }}
                    onMouseEnter={() => {
                      if (submenuTimeoutRef.current)
                        clearTimeout(submenuTimeoutRef.current);
                      setActiveSubmenu("security");
                    }}
                    onMouseLeave={handleSubmenuLeave}
                  >
                    <div className="p-2">
                      <div className="px-3 py-2 bg-gradient-to-r from-indigo-50 to-transparent dark:from-indigo-950/50">
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                          SECURITY
                        </p>
                      </div>
                      <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Change Password
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Update your password
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Notifications Submenu */}
                {activeSubmenu === "notifications" &&
                  notificationsButtonRef.current && (
                    <div
                      className="fixed bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden animate-in fade-in slide-in-from-left-1 duration-150"
                      style={{
                        top: notificationsButtonRef.current.getBoundingClientRect()
                          .top,
                        left:
                          notificationsButtonRef.current.getBoundingClientRect()
                            .left -
                          320 -
                          8,
                        width: "320px",
                      }}
                      onMouseEnter={() => {
                        if (submenuTimeoutRef.current)
                          clearTimeout(submenuTimeoutRef.current);
                        setActiveSubmenu("notifications");
                      }}
                      onMouseLeave={handleSubmenuLeave}
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 bg-gradient-to-r from-indigo-50 to-transparent dark:from-indigo-950/50">
                          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                            Notification Preferences
                          </p>
                        </div>
                        <label className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            Push Notifications
                          </span>
                          <div className="relative inline-block w-10 h-5 transition-all">
                            <input
                              type="checkbox"
                              className="peer opacity-0 w-0 h-0"
                              defaultChecked
                            />
                            <div className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-300 dark:bg-slate-700 rounded-full peer-checked:bg-indigo-600 transition-colors"></div>
                            <div className="absolute content-[''] h-4 w-4 left-0.5 bottom-0.5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                          </div>
                        </label>
                        <label className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            Email Notifications
                          </span>
                          <div className="relative inline-block w-10 h-5 transition-all">
                            <input
                              type="checkbox"
                              className="peer opacity-0 w-0 h-0"
                              defaultChecked
                            />
                            <div className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-300 dark:bg-slate-700 rounded-full peer-checked:bg-indigo-600 transition-colors"></div>
                            <div className="absolute content-[''] h-4 w-4 left-0.5 bottom-0.5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                          </div>
                        </label>
                        <label className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            Travel Deals
                          </span>
                          <div className="relative inline-block w-10 h-5 transition-all">
                            <input
                              type="checkbox"
                              className="peer opacity-0 w-0 h-0"
                            />
                            <div className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-300 dark:bg-slate-700 rounded-full peer-checked:bg-indigo-600 transition-colors"></div>
                            <div className="absolute content-[''] h-4 w-4 left-0.5 bottom-0.5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Edit Profile Modal */}
      {openEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setOpenEdit(false)}
          />

          <div
            ref={editModalRef}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Edit Profile
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Update your personal information
                </p>
              </div>
              <button
                onClick={() => setOpenEdit(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-500/20"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {user?.name}
                  </h3>
                  <p className="text-sm text-slate-500 break-all">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                  autoFocus
                />
                <p className="text-xs text-slate-500 mt-1">
                  This is the name that will be displayed on your profile
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl">
              <button
                onClick={() => setOpenEdit(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving || !editName.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
