import { useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "Find hotels in Srinagar",
    "What is weather in Lahore?",
    "Route from Srinagar to Gulmarg",
    "Book me a 3-day Kashmir trip under 15000 PKR",
  ];

  const sendMessage = async (customMessage) => {
    const finalMessage = customMessage || message;

    if (!finalMessage.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await axios.get(`${API_URL}/agent`, {
        params: { message: finalMessage },
      });

      setResponse(res.data.response || "No response received.");
    } catch (error) {
      setResponse("Backend error. Please make sure FastAPI server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Travel Agent</h1>
            <p className="text-sm text-slate-500">
              Hotels, weather, routes, and AI trip planning
            </p>
          </div>

          <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
            Backend Connected
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold mb-2">Ask your travel agent</h2>
          <p className="text-slate-500 mb-6">
            Plan a trip, check weather, find hotels, or calculate routes.
          </p>

          <div className="flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Example: Book me a 3-day Kashmir trip under 15000 PKR"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>

          <div className="mt-6 bg-slate-50 rounded-xl border border-slate-200 min-h-72 p-5">
            {loading && (
              <div className="animate-pulse text-slate-500">
                AI agent is checking APIs and preparing response...
              </div>
            )}

            {!loading && !response && (
              <div className="text-slate-400">
                Your travel response will appear here.
              </div>
            )}

            {!loading && response && (
              <pre className="whitespace-pre-wrap font-sans leading-7 text-slate-800">
                {response}
              </pre>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>

            <div className="space-y-3">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(prompt)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
