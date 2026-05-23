import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-8 mt-10">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          © 2026 AI Travel Agent. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-slate-700 transition text-slate-700 dark:text-white"
          >
            <FaFacebookF size={16} />
          </a>

          <a
            href="#"
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-slate-700 transition text-slate-700 dark:text-white"
          >
            <FaTwitter size={16} />
          </a>

          <a
            href="#"
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-slate-700 transition text-slate-700 dark:text-white"
          >
            <FaInstagram size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
