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
    <div className="min-w-full min-h-screen p-10 bg-black text-white flex gap-10">
      <section className="flex flex-col gap-5">
        <h1 className="text-blue-500 text-lg">Dinesh</h1>
        <div className="mx-10 min-w-[50vh] min-h-screen flex justify-center">
          <div className="w-full flex items-center gap-5">
          <input
            type="text"
            value={value}
            placeholder="Enter Your Task..."
            className="
              w-full
              p-3
              border
              border-white
              rounded-lg
              bg-transparent
              outline-none
              hover:border-blue-500
              focus:border-blue-500
            "
            onChange={(e) => setValue(e.target.value)}
          />

          <button
            onClick={handleAddTask}
            className="
              bg-white
              text-black
              px-5
              py-3
              rounded-lg
              hover:scale-105
              transition
            "
          >
            Add Task
          </button>
            </div>


        <div className="flex gap-5">
          <button
            onClick={() => setFilter("all")}
            className={`
              px-4 py-2 rounded-lg transition
              ${filter === "all" ? "bg-blue-500" : "bg-gray-700"}
            `}
          >
            All
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={`
              px-4 py-2 rounded-lg transition
              ${filter === "completed" ? "bg-green-500" : "bg-gray-700"}
            `}
          >
            Completed
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`
              px-4 py-2 rounded-lg transition
              ${filter === "pending" ? "bg-red-500" : "bg-gray-700"}
            `}
          >
            Pending
          </button>
        </div>
        <ul className="flex flex-col gap-4 mt-5">
          {filteredTasks.map((task) => {
            return (
              <li
                key={task.id}
                className={`
                  flex
                  items-center
                  justify-between
                  p-4
                  rounded-lg
                  bg-gray-900
                  border
                  border-gray-700
                  ${task.completed ? "opacity-60" : ""}
                `}
              >
                <span
                  className={`
                    text-lg
                    ${task.completed ? "line-through" : ""}
                  `}
                >
                  {task.text}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    className="
                      bg-green-500
                      px-4
                      py-2
                      rounded-lg
                      hover:scale-105
                      transition
                    "
                  >
                    Finish
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="
                      bg-red-500
                      px-4
                      py-2
                      rounded-lg
                      hover:scale-105
                      transition
                    "
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        </div>
      </section>
      <section className="flex flex-col gap-5">
        <div className="w-full flex items-center gap-5">
          <input
            type="text"
            value={value}
            placeholder="Enter Your Task..."
            className="
              w-full
              p-3
              border
              border-white
              rounded-lg
              bg-transparent
              outline-none
              hover:border-blue-500
              focus:border-blue-500
            "
            onChange={(e) => setValue(e.target.value)}
          />

          <button
            onClick={handleAddTask}
            className="
              bg-white
              text-black
              px-5
              py-3
              rounded-lg
              hover:scale-105
              transition
            "
          >
            Add Task
          </button>
        </div>


        <div className="flex gap-5">
          <button
            onClick={() => setFilter("all")}
            className={`
              px-4 py-2 rounded-lg transition
              ${filter === "all" ? "bg-blue-500" : "bg-gray-700"}
            `}
          >
            All
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={`
              px-4 py-2 rounded-lg transition
              ${filter === "completed" ? "bg-green-500" : "bg-gray-700"}
            `}
          >
            Completed
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`
              px-4 py-2 rounded-lg transition
              ${filter === "pending" ? "bg-red-500" : "bg-gray-700"}
            `}
          >
            Pending
          </button>
        </div>
        <ul className="flex flex-col gap-4 mt-5">
          {filteredTasks.map((task) => {
            return (
              <li
                key={task.id}
                className={`
                  flex
                  items-center
                  justify-between
                  p-4
                  rounded-lg
                  bg-gray-900
                  border
                  border-gray-700
                  ${task.completed ? "opacity-60" : ""}
                `}
              >
                <span
                  className={`
                    text-lg
                    ${task.completed ? "line-through" : ""}
                  `}
                >
                  {task.text}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    className="
                      bg-green-500
                      px-4
                      py-2
                      rounded-lg
                      hover:scale-105
                      transition
                    "
                  >
                    Finish
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="
                      bg-red-500
                      px-4
                      py-2
                      rounded-lg
                      hover:scale-105
                      transition
                    "
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export default Home;
