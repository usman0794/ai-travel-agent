import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const handlePlanTrip = () => {
    const plannerSection = document.getElementById("planner");
    if (plannerSection) {
      plannerSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* CTA Section */}
        <div className="text-center mb-12 pb-8 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Ready to explore the world?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Let AI plan your perfect journey today.
          </p>
          <button
            onClick={handlePlanTrip}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md cursor-pointer"
          >
            Plan a Trip Now
          </button>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Media Icons - Larger */}
          <div className="flex items-center gap-4 order-2 md:order-1">
            <a
              href="#"
              className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all hover:scale-110 text-slate-700 dark:text-slate-300"
            >
              <FaFacebookF size={18} />
            </a>
            <a
              href="#"
              className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all hover:scale-110 text-slate-700 dark:text-slate-300"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href="#"
              className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all hover:scale-110 text-slate-700 dark:text-slate-300"
            >
              <FaInstagram size={18} />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-500 dark:text-slate-400 order-1 md:order-2">
            © 2026 AI Travel Agent. All rights reserved.
          </p>

          {/* Email Subscription */}
          <div className="flex items-center gap-3 order-3">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 md:w-56"
            />
            <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
