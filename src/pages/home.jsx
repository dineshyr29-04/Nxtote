import { useState ,useEffect} from "react";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [value, setValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState("you");
  const [activities, setActivities] = useState([]);

  const handleAddTask = () => {
    if (value.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text: value,
      completed: false,
      owner: selectedUser,
    };

    setTasks([...tasks, newTask]);

    const newActivity = {
      id: Date.now(),
      message: `${selectedUser} added "${value}"`,
    };

    setActivities([newActivity, ...activities]);

    setValue("");
  };

  const handleDeleteTask = (id) => {
    const deletedTask = tasks.find((task) => task.id === id);

    const updatedTasks = tasks.filter((task) => task.id !== id);

    setTasks(updatedTasks);

    const newActivity = {
      id: Date.now(),
      message: `${deletedTask.owner} deleted "${deletedTask.text}"`,
    };

    setActivities([newActivity, ...activities]);
  };

  const handleToggleComplete = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        const newActivity = {
          id: Date.now(),
          message: `${task.owner} completed "${task.text}"`,
        };

        setActivities((prev) => [newActivity, ...prev]);

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
  useEffect(()=>{
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    );
  },[tasks])
  const yourTasks = filteredTasks.filter((task) => task.owner === "you");

  const herTasks = filteredTasks.filter((task) => task.owner === "her");

  return (
    <div className="w-full min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold text-center mb-12">
        Couple Task Board 💖
      </h1>

      <div className="flex gap-5 mb-10">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 p-4 rounded-xl outline-none"
        >
          <option value="you">You</option>
          <option value="her">Her</option>
        </select>

        <input
          type="text"
          value={value}
          placeholder="Enter task..."
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 outline-none"
        />

        <button
          onClick={handleAddTask}
          className="px-8 py-4 bg-blue-500 rounded-xl hover:scale-105 transition"
        >
          Add Task
        </button>
      </div>

      <div className="flex gap-5 mb-10">
        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-3 rounded-xl transition ${
            filter === "all" ? "bg-blue-500" : "bg-zinc-800"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("completed")}
          className={`px-5 py-3 rounded-xl transition ${
            filter === "completed" ? "bg-green-500" : "bg-zinc-800"
          }`}
        >
          Completed
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`px-5 py-3 rounded-xl transition ${
            filter === "pending" ? "bg-red-500" : "bg-zinc-800"
          }`}
        >
          Pending
        </button>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* YOUR TASKS */}

        <section className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-blue-400">Your Tasks</h2>

            <span className="bg-blue-500 px-4 py-2 rounded-full text-sm">
              You
            </span>
          </div>

          <ul className="flex flex-col gap-4">
            {yourTasks.map((task) => (
              <li
                key={task.id}
                className={`flex items-center justify-between p-4 rounded-2xl bg-black border border-zinc-800 ${
                  task.completed ? "opacity-50" : ""
                }`}
              >
                <div>
                  <p
                    className={`text-lg ${
                      task.completed ? "line-through" : ""
                    }`}
                  >
                    {task.text}
                  </p>
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

        {/* HER TASKS */}

        <section className="bg-pink-950 rounded-3xl p-6 border border-pink-900">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-pink-300">Her Tasks</h2>

            <span className="bg-pink-500 px-4 py-2 rounded-full text-sm">
              Her
            </span>
          </div>

          <ul className="flex flex-col gap-4">
            {herTasks.map((task) => (
              <li
                key={task.id}
                className={`flex items-center justify-between p-4 rounded-2xl bg-black border border-pink-900 ${
                  task.completed ? "opacity-50" : ""
                }`}
              >
                <div>
                  <p
                    className={`text-lg ${
                      task.completed ? "line-through" : ""
                    }`}
                  >
                    {task.text}
                  </p>
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

        
      
      </div>
    </div>
  );
}

export default Home;
