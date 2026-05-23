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
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    🤖
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 max-w-xl shadow-sm">
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                      {response}
                    </p>

                    <button
                      onClick={() => {
                        const tripsSection = document.getElementById("trips");

                        if (tripsSection) {
                          tripsSection.scrollIntoView({
                            behavior: "smooth",
                          });
                        }
                      }}
                      className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-medium"
                    >
                      View Full Trip
                    </button>
                  </div>
                </div>
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
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => sendMessage(example)}
                className="w-full text-left p-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700"
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
