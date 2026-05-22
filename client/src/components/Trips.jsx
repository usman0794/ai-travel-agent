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
    <section id="trips" className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold">Your Trips</h2>
          <p className="text-slate-500">
            Manage your draft and confirmed bookings
          </p>
        </div>

        {savedTrips.length > 3 && (
          <button
            onClick={() => setShowAllTrips(!showAllTrips)}
            className="btn-primary"
          >
            {showAllTrips ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {savedTrips.length === 0 ? (
        <div className="card text-center text-slate-500">
          No trips saved yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
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
