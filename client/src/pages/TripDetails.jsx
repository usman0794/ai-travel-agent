import { useParams, Link } from "react-router-dom";

export default function TripDetails({ savedTrips }) {
  const { id } = useParams();

  const trip = savedTrips.find((t) => String(t.id) === id);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-3">Trip not found</h2>
          <Link to="/" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const itinerary = [
    {
      day: 1,
      title: `Arrival in ${trip.destination}`,
      activities: [
        "Hotel check-in",
        "Explore nearby attractions",
        "Local dinner experience",
      ],
    },
    {
      day: 2,
      title: "City Exploration",
      activities: [
        "Visit famous landmarks",
        "Try local food",
        "Evening walk or shopping",
      ],
    },
    {
      day: 3,
      title: "Relax and Return",
      activities: ["Breakfast at hotel", "Final sightseeing", "Departure"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f8ff] dark:bg-slate-950 text-slate-900 dark:text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="text-indigo-600 font-medium">
          ← Back to Dashboard
        </Link>

        <div className="card mt-6">
          <h1 className="text-4xl font-extrabold">{trip.destination} Trip</h1>

          <p className="text-slate-500 mt-2">
            {trip.days} Days • ${Math.round(trip.budget / 280)} Budget •{" "}
            {trip.status}
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-slate-800">
              <p className="text-sm text-slate-500">Hotel</p>
              <h3 className="font-bold">
                {trip.selected_hotel || "Not selected"}
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-green-50 dark:bg-slate-800">
              <p className="text-sm text-slate-500">Estimated Cost</p>
              <h3 className="font-bold">
                ${Math.round(trip.estimated_cost / 280)}
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-yellow-50 dark:bg-slate-800">
              <p className="text-sm text-slate-500">Status</p>
              <h3 className="font-bold capitalize">{trip.status}</h3>
            </div>
          </div>
        </div>

        <div className="card mt-8">
          <h2 className="text-2xl font-bold mb-6">Day-wise Itinerary</h2>

          <div className="space-y-6">
            {itinerary.map((item) => (
              <div key={item.day} className="border-l-4 border-indigo-600 pl-5">
                <span className="text-sm font-semibold text-indigo-600">
                  Day {item.day}
                </span>

                <h3 className="text-xl font-bold mt-1">{item.title}</h3>

                <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-300">
                  {item.activities.map((activity, index) => (
                    <li key={index}>• {activity}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
