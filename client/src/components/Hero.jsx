import { Sparkles } from "lucide-react";
import heroImage from "../assets/travel-hero.png";

export default function Hero({ sendMessage }) {
  const handlePlanTrip = () => {
    const plannerSection = document.getElementById("planner");
    if (plannerSection) {
      plannerSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleViewMyTrips = () => {
    const tripsSection = document.getElementById("trips");
    if (tripsSection) {
      tripsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-2 gap-8 items-center"
    >
      <div className="animate-fade-in-up">
        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight text-slate-950 dark:text-white animate-slide-in-left">
          Your AI Travel Companion
        </h2>

        <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-xl animate-slide-in-left animation-delay-200">
          Plan smarter. Travel better. Let AI find hotels, weather, routes,
          budgets, and bookings in one place.
        </p>

        <div className="mt-6 flex flex-wrap gap-4 animate-slide-in-left animation-delay-400">
          <button
            onClick={handlePlanTrip}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-md flex items-center gap-2"
          >
            Plan a Trip
          </button>

          <button
            onClick={handleViewMyTrips}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-all transform hover:scale-105"
          >
            View My Trips
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-start lg:justify-start animate-float">
        <img
          src={heroImage}
          alt="Travel Hero"
          className="w-full max-w-[750px] lg:ml-[-40px] object-contain drop-shadow-2xl animate-float-slow"
        />
      </div>
    </section>
  );
}
