export default function EditModal({
  editForm,
  setEditForm,
  updateTrip,
  close,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-[2rem] p-7 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-5">Edit Trip</h2>

        <input
          className="input"
          value={editForm.destination}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              destination: e.target.value,
            })
          }
          placeholder="Destination"
        />

        <input
          className="input"
          value={editForm.days}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              days: e.target.value,
            })
          }
          placeholder="Days"
        />

        <input
          className="input"
          value={editForm.budget}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              budget: e.target.value,
            })
          }
          placeholder="Budget"
        />

        <div className="flex gap-3 mt-4">
          <button onClick={updateTrip} className="btn-success flex-1">
            Save
          </button>

          <button onClick={close} className="btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
