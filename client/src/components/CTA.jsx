export default function CTA({ sendMessage }) {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-16">
      <div className="rounded-[2rem] bg-gradient-to-r from-indigo-600 to-blue-600 p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
        <div>
          <h2 className="text-3xl font-extrabold">
            Ready to explore the world?
          </h2>

          <p className="text-blue-100 mt-2">
            Let AI plan your perfect journey today.
          </p>
        </div>

        <button
          onClick={() => sendMessage("Plan me a budget friendly 3 day trip")}
          className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold"
        >
          Plan a Trip Now
        </button>
      </div>
    </section>
  );
}
