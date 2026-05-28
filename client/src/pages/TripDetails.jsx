import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Hotel,
  CreditCard,
  DollarSign,
  Clock,
  ArrowLeft,
} from "lucide-react";

export default function TripDetails({ savedTrips }) {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [id]);

  const trip = savedTrips.find((t) => String(t.id) === id);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8ff] dark:bg-slate-950">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
            Trip not found
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            We couldn't find the trip you're looking for.
          </p>
          <Link
            to="/"
            className="inline-block px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f6f8ff] dark:bg-slate-950 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                <MapPin size={14} />
                <span>Trip Details</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                {trip.source
                  ? `${trip.source} → ${trip.destination}`
                  : trip.destination}
              </h1>
              <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>
                    {formatDate(trip.start_date)} — {formatDate(trip.end_date)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{trip.days} Days</span>
                </div>
              </div>
            </div>
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                trip.status === "confirmed"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}
            >
              {trip.status || "Draft"}
            </div>
          </div>
        </div>

        {/* Info Cards Grid - Smaller and cleaner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
              <DollarSign size={16} />
              <span className="text-xs font-medium">BUDGET</span>
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {trip.budget} {trip.budget_currency || "USD"}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
              <CreditCard size={16} />
              <span className="text-xs font-medium">ESTIMATED COST</span>
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              ${Math.round(trip.estimated_cost_usd || 0)}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
              <Hotel size={16} />
              <span className="text-xs font-medium">HOTEL</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {trip.selected_hotel || "Not selected"}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
              <MapPin size={16} />
              <span className="text-xs font-medium">STATUS</span>
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white capitalize">
              {trip.status || "Draft"}
            </p>
          </div>
        </div>

        {/* Itinerary Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin size={20} className="text-indigo-600" />
              Travel Itinerary
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Your personalized day-by-day travel plan
            </p>
          </div>

          <div className="p-6">
            {trip.itinerary ? (
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300 font-sans bg-slate-50 dark:bg-slate-800/30 p-5 rounded-xl">
                  {trip.itinerary}
                </pre>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">
                  No itinerary available for this trip yet.
                </p>
                <Link
                  to="/#planner"
                  className="inline-block mt-3 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  Plan a Trip
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
