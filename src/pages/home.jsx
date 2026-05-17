import { useState } from "react";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [value, setValue] = useState("");
  const [filter, setFilter] = useState("all");

  const handleAddTask = () => {
    if (value.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text: value,
      completed: false,
      owner: "you",
    };

    setTasks([...tasks, newTask]);
    setValue("");
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);

    setTasks(updatedTasks);
  };

  const handleToggleComplete = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          completed: !task.completed,
        };
      }

      return task;
    });

    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") {
      return task.completed;
    }

    if (filter === "pending") {
      return !task.completed;
    }

    return true;
  });

  return (
    <div className="w-full min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold text-center mb-12">
        Couple Task Board 💖
      </h1>

      <div className="w-full flex gap-10">
        <section className="w-1/2 bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-blue-400">Your Tasks</h2>

            <span className="px-4 py-2 bg-blue-500 rounded-full text-sm font-semibold">
              You
            </span>
          </div>

          <div className="flex gap-4 mb-8">
            <input
              type="text"
              value={value}
              placeholder="Add your task..."
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-4 rounded-xl bg-black border border-zinc-700 outline-none focus:border-blue-500"
            />

            <button
              onClick={handleAddTask}
              className="px-6 py-4 bg-blue-500 rounded-xl font-semibold hover:scale-105 transition"
            >
              Add
            </button>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl transition ${filter === "all" ? "bg-blue-500" : "bg-zinc-800"}`}
            >
              All
            </button>

            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-xl transition ${filter === "completed" ? "bg-green-500" : "bg-zinc-800"}`}
            >
              Completed
            </button>

            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-xl transition ${filter === "pending" ? "bg-red-500" : "bg-zinc-800"}`}
            >
              Pending
            </button>
          </div>

          <ul className="flex flex-col gap-4">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`flex items-center justify-between p-5 rounded-2xl bg-black border border-zinc-800 ${task.completed ? "opacity-60" : ""}`}
              >
                <div className="flex flex-col gap-1">
                  <span
                    className={`text-lg font-medium ${task.completed ? "line-through" : ""}`}
                  >
                    {task.text}
                  </span>

                  <span className="text-sm text-zinc-500">
                    Owner: {task.owner}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    className="px-4 py-2 bg-green-500 rounded-xl hover:scale-105 transition"
                  >
                    Finish
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="px-4 py-2 bg-red-500 rounded-xl hover:scale-105 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="w-1/2 bg-pink-950 rounded-3xl p-8 border border-pink-900 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-pink-300">Her Tasks</h2>

            <span className="px-4 py-2 bg-pink-500 rounded-full text-sm font-semibold">
              Charu
            </span>
          </div>

          <div className="flex items-center justify-center h-[500px] border-2 border-dashed border-pink-800 rounded-3xl">
            <div>
              <input></input>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
