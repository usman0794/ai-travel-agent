import { getTripImage } from "../utils/getTripImage";

export default function TripCard({
  trip,
  confirmBooking,
  cancelBooking,
  setEditingTrip,
  setEditForm,
}) {
  const imageUrl = getTripImage(trip.destination);

  const badge =
    trip.status === "confirmed"
      ? "bg-green-500 text-white"
      : trip.status === "cancelled"
        ? "bg-red-500 text-white"
        : "bg-indigo-500 text-white";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="relative">
        <img
          src={imageUrl}
          alt={trip.destination}
          className="w-full h-44 object-cover"
        />

        <span
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${badge}`}
        >
          {trip.status === "draft"
            ? "Draft"
            : trip.status === "confirmed"
              ? "Confirmed"
              : "Cancelled"}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-4">{trip.destination}</h3>

        <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
          <span>📅 {trip.days} Days</span>
          <span>💰 ${Math.round(trip.estimated_cost / 280)}</span>
        </div>

        <p className="text-sm text-slate-500 mb-5">
          Hotel: {trip.selected_hotel || "Not selected"}
        </p>

        {trip.status === "draft" && (
          <div className="flex gap-3">
            <button
              onClick={() => confirmBooking(trip.id)}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold"
            >
              Confirm
            </button>

            <button
              onClick={() => {
                setEditingTrip(trip);
                setEditForm({
                  destination: trip.destination,
                  days: trip.days,
                  budget: trip.budget,
                });
              }}
              className="flex-1 border border-indigo-300 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50"
            >
              Edit
            </button>
          </div>
        )}

        {trip.status === "confirmed" && (
          <button
            onClick={() => cancelBooking(trip.id)}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
          >
            Cancel
          </button>
        )}

        {trip.status === "cancelled" && (
          <p className="text-center text-sm text-slate-400 py-3">
            No actions available
          </p>
        )}
      </div>
    </div>
  );
}
