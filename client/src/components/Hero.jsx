import { Sparkles } from "lucide-react";
import heroImage from "../assets/travel-hero.png";

export default function Hero({ sendMessage }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
          <Sparkles size={16} />
          AI-powered travel planning
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
