import { Plane, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import authImage from "../assets/travel-hero.png";

export default function AuthScreen({
  authLoading,
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  handleAuth,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950 overflow-hidden">
      <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
        {/* LEFT IMAGE SIDE - DESKTOP ONLY */}
        <div
          className="hidden lg:block relative h-screen bg-cover bg-center text-white"
          style={{ backgroundImage: `url(${authImage})` }}
        >
          <div className="absolute inset-0 bg-black/35" />

          <div className="relative z-10 h-full flex flex-col justify-between p-10">
            {/* Top: Logo */}
            <div className="flex items-center gap-3"></div>

            {/* Center: Main Message */}
            <div className="text-center max-w-lg mx-auto">
              <h2 className="text-5xl font-extrabold leading-tight">
                Let AI plan your{" "}
                <span className="text-indigo-400">perfect trip</span>
              </h2>
              <p className="mt-4 text-lg text-white/90">
                Smart recommendations, customized for you.
              </p>
            </div>

            {/* Bottom: Empty spacer for balance */}
            <div></div>
          </div>
        </div>

        {/* RIGHT FORM SIDE */}
        <div className="min-h-screen flex items-center justify-center px-5 py-10 lg:p-10 bg-white dark:bg-slate-950">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-3">
                <Plane className="text-indigo-600" size={28} />
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {authMode === "login" ? "Welcome Back" : "Create Account"}
              </h2>

              <p className="text-slate-500 dark:text-slate-400 mt-2">
                {authMode === "login"
                  ? "Login to continue your journey"
                  : "Sign up and start planning smarter"}
              </p>
            </div>

            {authMode === "signup" && (
              <InputBox
                icon={<User size={20} />}
                placeholder="Full Name"
                value={authForm.name}
                onChange={(e) =>
                  setAuthForm({ ...authForm, name: e.target.value })
                }
              />
            )}

            <InputBox
              icon={<Mail size={20} />}
              placeholder="Enter your email"
              type="email"
              value={authForm.email}
              onChange={(e) =>
                setAuthForm({ ...authForm, email: e.target.value })
              }
            />

            <div className="relative mb-3">
              <Lock
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                className="w-full rounded-xl border border-slate-200 pl-14 pr-14 py-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm({ ...authForm, password: e.target.value })
                }
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {authMode === "login" && (
              <div className="text-right mb-5">
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              onClick={handleAuth}
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
            >
              {authLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : authMode === "login" ? (
                "Login"
              ) : (
                "Create Account"
              )}
            </button>

            {authMode === "login" && (
              <>
                <div className="flex items-center gap-4 my-5 text-sm text-slate-400">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                  or continue with
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                </div>

                <button className="w-full py-3 rounded-xl border border-slate-200 flex items-center justify-center gap-3 font-semibold hover:bg-slate-50 transition dark:border-slate-700 dark:hover:bg-slate-900 dark:text-white">
                  <GoogleIcon />
                  Continue with Google
                </button>
              </>
            )}

            <button
              onClick={() =>
                setAuthMode(authMode === "login" ? "signup" : "login")
              }
              className="w-full mt-5 text-slate-500 hover:text-slate-700 transition"
            >
              {authMode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}

              <span className="text-indigo-600 font-semibold hover:underline">
                {authMode === "login" ? "Sign up" : "Login"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputBox({ icon, ...props }) {
  return (
    <div className="relative mb-3">
      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>

      <input
        {...props}
        className="w-full rounded-xl border border-slate-200 pl-14 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition dark:bg-slate-900 dark:border-slate-700 dark:text-white"
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
