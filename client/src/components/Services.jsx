import { Bot, MapPin, Wallet, Bookmark, ArrowRight } from "lucide-react";

export default function Services({ sendMessage }) {
  const services = [
    {
      icon: <Bot size={28} />,
      title: "AI Trip Planning",
      desc: "Get personalized travel itineraries powered by advanced AI.",
      prompt: "Book me a 3-day Lahore trip under 15000 PKR",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: <MapPin size={28} />,
      title: "Smart Suggestions",
      desc: "Discover destinations, activities, and stays that match your style.",
      prompt: "Suggest me a budget friendly trip",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <Wallet size={28} />,
      title: "Budget Friendly",
      desc: "AI helps you plan the best experience within your budget.",
      prompt: "Book me a budget friendly 3-day Lahore trip",
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      icon: <Bookmark size={28} />,
      title: "Save & Manage",
      desc: "Save your trips, confirm bookings, and manage them easily.",
      prompt: "Book me a 3-day Kashmir trip under 15000 PKR",
      color: "bg-pink-100 text-pink-600",
    },
  ];

  return (
    <section id="services" className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-14">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Our Services
        </h2>

        <p className="text-slate-500 mt-3">
          Everything you need for a smooth and memorable trip
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <button
            key={index}
            onClick={() => sendMessage(service.prompt)}
            className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-7 text-left shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all min-h-[260px] flex flex-col"
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-7 ${service.color}`}
            >
              {service.icon}
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">
              {service.title}
            </h3>

            <p className="text-slate-500 text-sm leading-7 flex-1">
              {service.desc}
            </p>

            <div className="mt-6 flex justify-end">
              <span className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center group-hover:bg-indigo-700 transition">
                <ArrowRight size={20} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
