import { useRef, useState } from "react";
import axios from "axios";

import { DayPicker } from "react-day-picker";

export function TodoForm({ refetch }: { refetch: () => void }) {
  const selectRef = useRef<HTMLDetailsElement>(null);
  const dateRef = useRef<HTMLDetailsElement>(null);

  const [date, setDate] = useState<Date | undefined>();
  const [type, setType] = useState<"daily" | "task">("daily");
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("High");
  const [description, setDescription] = useState("");

  const selectDate = (e: Date | undefined) => {
    if (dateRef.current) {
      dateRef.current.open = !dateRef.current.open;
    }
    setDate(e);
  };

  const selectType = (type: "daily" | "task") => {
    if (selectRef.current) {
      selectRef.current.open = !selectRef.current.open;
    }
    setType(type);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axios.post("/api/todos", {
        name,
        priority,
        description,
        type,
        deadline: date,
      });
      refetch();
      const dialog = document.getElementById(
        "add_ceklis_modal"
      ) as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }
      setDate(undefined);
      setType("daily");
      setName("");
      setPriority("High");
      setDescription("");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <dialog id="add_ceklis_modal" className="modal">
      <div className="modal-box overflow-visible">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form method="dialog" onSubmit={handleSubmit}>
          <h3 className="font-bold text-lg">
            Buat{" "}
            <span className="font-logo text-sm sm:text-base italic">
              Ceklis.
            </span>
          </h3>
          <div className="py-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Nama</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Type here"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Prioritas</legend>
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="radio radio-error radio-sm"
                    name="priority"
                    checked={priority === "high"}
                    onChange={() => setPriority("high")}
                  />
                  <span className="text-error font-bold text-sm">High</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="radio radio-secondary radio-sm"
                    name="priority"
                    checked={priority === "medium"}
                    onChange={() => setPriority("medium")}
                  />
                  <span className="text-secondary font-bold text-sm">
                    Medium
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="radio radio-primary radio-sm"
                    name="priority"
                    checked={priority === "low"}
                    onChange={() => setPriority("low")}
                  />
                  <span className="text-primary font-bold text-sm">Low</span>
                </label>
              </div>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Deskripsi</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Type here"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Jenis Ceklis</legend>
              <details className="dropdown" ref={selectRef}>
                <summary
                  className="input input-border w-full"
                  onBlur={() => {
                    setTimeout(() => {
                      selectRef.current!.open = false;
                    }, 100);
                  }}
                >
                  {type === "daily" ? "Harian" : "Tugas"}
                </summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-full p-2 shadow-sm">
                  <li>
                    <button type="button" onClick={() => selectType("daily")}>
                      Harian
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => selectType("task")}>
                      Tugas
                    </button>
                  </li>
                </ul>
              </details>
            </fieldset>
            <fieldset className="fieldset relative">
              <legend className="fieldset-legend">Tenggat Waktu</legend>
              <details ref={dateRef}>
                <summary className="input input-border w-full">
                  {date ? date.toLocaleDateString() : "Pilih tanggal"}
                </summary>
                <div className="absolute bottom-18">
                  <DayPicker
                    className="react-day-picker"
                    mode="single"
                    selected={date}
                    onSelect={selectDate}
                  />
                </div>
              </details>
              <p className="fieldset-label">Opsional</p>
            </fieldset>
            <button type="submit" className="btn btn-neutral btn-block mt-4">
              Submit
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
