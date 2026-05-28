import ReactMarkdown from "react-markdown";
import { Compass, Send } from "lucide-react";

export default function Planner({
  message,
  setMessage,
  sendMessage,
  loading,
  response,
}) {
  const examples = [
    "Find hotels in Lahore range 2500 per night",
    "What is weather in Lahore?",
    "Route from Srinagar to Gulmarg",
    "Book me a 3-day Kashmir trip under 15000 PKR",
  ];

  const handleSend = () => {
    if (!message.trim() || loading) return;
    sendMessage(message);
  };

  return (
    <section id="planner" className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Planner */}
        <div className="lg:col-span-2 card">
          <h2 className="text-2xl font-bold mb-2">Plan Your Trip with AI</h2>

          <p className="text-slate-500 mb-6">
            Ask your travel assistant anything.
          </p>

          {/* Response Box */}
          <div className="min-h-80 rounded-2xl bg-slate-50 dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700">
            {loading && (
              <div className="flex items-center gap-3 text-slate-500">
                <div className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                <p>AI is planning your trip...</p>
              </div>
            )}

            {!loading && !response && (
              <div className="text-slate-400 flex flex-col items-center justify-center h-72">
                <Compass size={48} />
                <p className="mt-4">Your AI travel plan will appear here.</p>
              </div>
            )}

            {!loading && response && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    🤖
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 max-w-xl shadow-sm">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{response}</ReactMarkdown>
                    </div>

                    <button
                      onClick={() => {
                        const tripsSection = document.getElementById("trips");

                        if (tripsSection) {
                          tripsSection.scrollIntoView({
                            behavior: "smooth",
                          });
                        }
                      }}
                      className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-medium transition"
                    >
                      View Full Trip
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-3 mt-5">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && message.trim() && !loading) {
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 h-14 px-5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />

            <button
              onClick={handleSend}
              disabled={!message.trim() || loading}
              className="h-14 w-14 shrink-0 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send size={22} />
            </button>
          </div>
        </div>

        {/* Examples */}
        <div className="card">
          <h3 className="font-bold mb-4">Example Prompts</h3>

          <div className="space-y-3">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setMessage(example)}
                className="w-full text-left p-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 transition"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
