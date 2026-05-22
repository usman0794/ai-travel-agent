import { Bot, Hotel, CloudSun, MapPin, Wallet, Bookmark } from "lucide-react";

export default function Services({ sendMessage }) {
  const services = [
    {
      icon: <Bot />,
      title: "AI Trip Planning",
      desc: "Generate personalized itineraries.",
      prompt: "Book me a 3-day Lahore trip under 15000 PKR",
    },
    {
      icon: <Hotel />,
      title: "Hotel Search",
      desc: "Find nearby hotels using APIs.",
      prompt: "Find hotels in Lahore range 2500 per night",
    },
    {
      icon: <CloudSun />,
      title: "Live Weather",
      desc: "Check real weather before travel.",
      prompt: "What is weather in Lahore?",
    },
    {
      icon: <MapPin />,
      title: "Routes",
      desc: "Calculate distance and travel time.",
      prompt: "Route from Srinagar to Gulmarg",
    },
    {
      icon: <Wallet />,
      title: "Budget Friendly",
      desc: "Estimate costs based on budget.",
      prompt: "Book me a budget friendly 3-day Lahore trip",
    },
    {
      icon: <Bookmark />,
      title: "Save & Manage",
      desc: "Draft, confirm, edit, and cancel.",
      prompt: "Book me a 3-day Kashmir trip under 15000 PKR",
    },
  ];

  return (
    <section id="services" className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold">Our Services</h2>

        <p className="text-slate-500 mt-2">
          Everything you need for a smooth trip
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <button
            key={i}
            onClick={() => sendMessage(s.prompt)}
            className="card hover:-translate-y-1 text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
              {s.icon}
            </div>

            <h3 className="font-bold text-lg">{s.title}</h3>

            <p className="text-slate-500 mt-2">{s.desc}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
