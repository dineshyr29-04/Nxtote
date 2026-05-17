import { useState } from "react";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [value, setValue] = useState("");
  const [filter, setFilter] = useState("all");

  const handleAddTask = () => {
    if (value.trim() === "") return;

    const newtasks = {
      id: Date.now(),
      text: value,
      completed: false,
    };

    setTasks([...tasks, newtasks]);
    setValue("");
  };

  const handleDeleteTask = (id) => {
    const newtask = tasks.filter((task) => task.id !== id);
    setTasks(newtask);
  };

  const handleToggleComplete = (id) => {
    const updatedtasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          completed: !task.completed,
        };
      }
      return task;
    });

    setTasks(updatedtasks);
  };
  const filterTasks = tasks.filter((task) => {
    if (filter === "completed") {
      return task.completed;
    }
    if (filter === "pending") {
      return !task.completed;
    }
    return true;
  });

  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
      <h1 className="mb-6 text-center text-3xl font-bold tracking-tight text-white">
        Task Manager
      </h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a task..."
          className="w-full rounded-lg border border-slate-600 bg-slate-950/80 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
        />
        <button
          className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white transition hover:bg-emerald-600"
          onClick={handleAddTask}
        >
          Add
        </button>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <button
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            filter === "all"
              ? "bg-sky-400 text-slate-950"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            filter === "completed"
              ? "bg-sky-400 text-slate-950"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            filter === "pending"
              ? "bg-sky-400 text-slate-950"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
      </div>

      <ul className="space-y-2">
        {filterTasks.map((task) => {
          return (
            <li
              key={task.id}
              className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2"
            >
              <span
                className={`text-slate-100 ${
                  task.completed ? "text-slate-400 line-through" : ""
                }`}
              >
                {task.text}
              </span>
              <div className="flex gap-2">
                <button
                  className="rounded bg-emerald-500 px-2 py-1 text-white transition hover:bg-emerald-600"
                  onClick={() => handleToggleComplete(task.id)}
                >
                  ✔
                </button>

                <button
                  className="rounded bg-red-500 px-2 py-1 text-white transition hover:bg-red-600"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  ✖
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Home;
