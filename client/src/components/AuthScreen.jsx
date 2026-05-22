import { Plane } from "lucide-react";

export default function AuthScreen({
  authLoading,
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

        <button
          onClick={handleAuth}
          disabled={authLoading}
          className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
        >
          {authLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : authMode === "login" ? (
            "Login"
          ) : (
            "Create Account"
          )}
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
