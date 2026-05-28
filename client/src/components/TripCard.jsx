import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTripImage } from "../utils/getTripImage";

export default function TripCard({
  trip,
  confirmBooking,
  cancelBooking,
  setEditingTrip,
  setEditForm,
}) {
  const navigate = useNavigate();
  const imageUrl = getTripImage(trip.destination);

  const [loadingAction, setLoadingAction] = useState(null);
  const [message, setMessage] = useState("");

  const badge =
    trip.status === "confirmed"
      ? "bg-green-500 text-white"
      : trip.status === "cancelled"
        ? "bg-red-500 text-white"
        : "bg-indigo-500 text-white";

  const openDetails = () => {
    navigate(`/trips/${trip.id}`);
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  };

  const handleConfirm = async (e) => {
    e.stopPropagation();
    try {
      setLoadingAction("confirm");
      await confirmBooking(trip.id);
      showMessage("Trip confirmed successfully");
    } catch (error) {
      showMessage("Failed to confirm trip");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCancel = async (e) => {
    e.stopPropagation();
    try {
      setLoadingAction("cancel");
      await cancelBooking(trip.id);
      showMessage("Trip cancelled successfully");
    } catch (error) {
      showMessage("Failed to cancel trip");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="relative">
      {message && (
        <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg dark:bg-white dark:text-slate-900">
          {message}
        </div>
      )}

      <div
        onClick={openDetails}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all"
      >
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
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">
            {trip.source
              ? `${trip.source} → ${trip.destination}`
              : trip.destination}
          </h3>

          <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
            <span>📅 {trip.days} Days</span>
            <span>💰 ${Math.round(trip.estimated_cost_usd || 0)}</span>
          </div>

          <p className="text-sm text-slate-500 mb-5">
            Hotel: {trip.selected_hotel || "Not selected"}
          </p>

          <p className="text-sm text-slate-500 mb-5">
            {trip.start_date || "Start date not set"} →{" "}
            {trip.end_date || "End date not set"}
          </p>

          <div className="space-y-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openDetails();
              }}
              className="w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Full Details
            </button>

            {trip.status === "draft" && (
              <div className="flex gap-3">
                <button
                  onClick={handleConfirm}
                  disabled={loadingAction !== null}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loadingAction === "confirm" ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTrip(trip);
                    setEditForm({
                      destination: trip.destination,
                      days: trip.days,
                      budget: trip.budget,
                    });
                  }}
                  disabled={loadingAction !== null}
                  className="flex-1 border border-indigo-300 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 dark:hover:bg-slate-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Edit
                </button>
              </div>
            )}

            {trip.status === "confirmed" && (
              <button
                onClick={handleCancel}
                disabled={loadingAction !== null}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loadingAction === "cancel" ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel"
                )}
              </button>
            )}

            {trip.status === "cancelled" && (
              <p className="text-center text-sm text-slate-400 py-3">
                No actions available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
