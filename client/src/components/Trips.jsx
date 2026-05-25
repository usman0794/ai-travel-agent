import { useState } from "react";
import TripCard from "./TripCard";

export default function Trips({
  savedTrips,
  confirmBooking,
  cancelBooking,
  setEditingTrip,
  setEditForm,
}) {
  const [showAllTrips, setShowAllTrips] = useState(false);

  const visibleTrips = showAllTrips ? savedTrips : savedTrips.slice(0, 3);

  return (
    <section id="trips" className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-extrabold">Your Trips</h2>
          <p className="text-slate-500 text-sm">
            Manage your draft and confirmed bookings
          </p>
        </div>

        {savedTrips.length > 3 && (
          <button
            onClick={() => setShowAllTrips(!showAllTrips)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
          >
            {showAllTrips ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {savedTrips.length === 0 ? (
        <div className="text-center text-slate-500 py-6">
          No trips saved yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-5">
          {visibleTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              confirmBooking={confirmBooking}
              cancelBooking={cancelBooking}
              setEditingTrip={setEditingTrip}
              setEditForm={setEditForm}
            />
          ))}
        </div>
      )}
    </section>
  );
}
