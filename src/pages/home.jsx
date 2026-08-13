import { useState, useEffect } from "react";
import { useAuth } from "../context/authprovider";
import { createNote, getNotes, updateNote, deleteNote } from "../api/notesapi";
import Toast from "../components/Toastnotification";
import { Plus, Trash2, Check, Search, Calendar, ListTodo, Activity } from "lucide-react";

function Home() {
    const { user } = useAuth();

    // State initialization loading from LocalStorage
    const [tasks, setTasks] = useState([]);
    const [newTaskText, setNewTaskText] = useState("");
    const [newTaskContent, setNewTaskContent] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Work");
    const [selectedPriority, setSelectedPriority] = useState("Medium");

    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const [activities, setActivities] = useState(() => {
        const savedActivities = localStorage.getItem("single_user_activities");
        return savedActivities ? JSON.parse(savedActivities) : [];
    });

    // UI Toast notification state
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    //state initialization for the
    // Sync to localStorage
    useEffect(() => {
        localStorage.setItem("single_user_tasks", JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem("single_user_activities", JSON.stringify(activities));
    }, [activities]);


    // getting the tasks from the supabase and storing in the thing
    useEffect(() => {
        const fetchnotes = async () => {
            try {
                const note = await getNotes();
                const formattedNotes = note.data.map((item) => ({
                    ...item,
                    text: item.title || "",
                }));
                setTasks(formattedNotes);
            } catch (error) {
                console.error("Failed to load notes:", error);
            }
        };
        fetchnotes();
    }, []);
    // Greeting helper based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        const displayName = user?.name || "Guest";
        if (hour < 12) return `Good morning, ${displayName} 🌅`;
        if (hour < 18) return `Good afternoon, ${displayName} ☀️`;
        if (hour < 20) return `Good evening, ${displayName} 🌌`;
        return `Good Night, ${displayName}`;
    };

    const triggerToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    // Add Task Handler
    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskText) {
            return "Task text is required";
        }

        const note = {
            text: newTaskText,
            content: newTaskContent,
            category: selectedCategory,
            priority: selectedPriority,
            completed: false,
        };
        try {
            const result = await createNote(note);
            if (!result) return;
            const formattedNewNote = {
                ...result,
                text: result.title,
            };
            setTasks([...tasks, formattedNewNote]);
            setNewTaskText("");
            setNewTaskContent("");
        } catch (error) {
            console.error("Failed to add task:", error);
            triggerToast("Failed to add task.", "error");
        }
    };

    // Toggle Checked Handler
    const handleToggleComplete = async (id) => {
        const tasktotoggle = tasks.find((task) => task.id === id);
        if (!tasktotoggle) return;

        const newstatus = !tasktotoggle.completed;
        try {
            await updateNote(id, { completed: newstatus });
            // if the database update is success then update the frontend with the deleted task.
            const updatedTasks = tasks.map((task) => {
                if (task.id === id) {
                    logActivity(`${newstatus ? "completed" : "Reopened"} task ${task.text}`);
                    triggerToast(
                        newstatus ? "Task completed! 🎉" : "Task reopened",
                        newstatus ? "success" : "info",
                    );
                    return {...task, completed: newstatus };
                }
                return task;
            });
            setTasks(updatedTasks);
        } catch (error){
            console.error(error);
            triggerToast("Failed tom update the tasks.");
        }

    };

    // Delete Task Handler
    const handleDeleteTask = async(id) => {
        try {
            const taskToDelete = tasks.find((task) => task.id === id);
            if (!taskToDelete) return;
            const deletetask = await deleteNote(id);
            if (deletetask) {
                setTasks(tasks.filter((task) => task.id !== id));
                logActivity(`Deleted task: "${taskToDelete.text}"`);
                triggerToast("Task deleted.");
            }
        }
        catch (err) {
            console.error(err);
            triggerToast("Error in deleting the task");
       }
    };

    // Activity feed logger
    const logActivity = (message) => {
        const newActivity = {
            id: crypto.randomUUID(),
            message,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setActivities((prev) => [newActivity, ...prev].slice(0, 15));
    };

    const clearAllActivities = () => {
        setActivities([]);
        localStorage.removeItem("single_user_activities");
        triggerToast("Action history cleared.");
    };

    // Filtering Logic
    const filteredTasks = tasks.filter((task) => {
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "completed" && task.completed) ||
            (statusFilter === "pending" && !task.completed);

        const matchesCategory = categoryFilter === "all" || task.category === categoryFilter;

        const matchesSearch =
            task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.category.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesCategory && matchesSearch;
    });

    // Stats Analytics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionPercentage =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High":
                return "text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-sm shadow-rose-500/5";
            case "Medium":
                return "text-amber-400 bg-amber-500/10 border-amber-500/20";
            case "Low":
                return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
            default:
                return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "Work":
                return "💼";
            case "Personal":
                return "🏠";
            case "Health":
                return "❤️";
            case "Finance":
                return "💵";
            default:
                return "📌";
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden pb-12">
            {/* 🔮 Background Glow Effects */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-violet-600/10 blur-[130px] pointer-events-none"></div>
            <div className="absolute bottom-[20%] left-[-10%] w-80 h-80 rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none"></div>

            {/* Dashboard Header */}
            <header className="relative max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-slate-900 z-10">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
                        {getGreeting()}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-400 mt-2 text-sm">
                        <Calendar className="w-4 h-4 text-fuchsia-400" />
                        <span>
                            {new Date().toLocaleDateString(undefined, {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                </div>

                {/* Stats Panel */}
                <div className="flex gap-4">
                    <div className="bg-slate-900/40 border border-slate-800/80 px-6 py-4 rounded-2xl flex items-center gap-4 min-w-[200px] backdrop-blur-md">
                        <div className="w-12 h-12 rounded-full border-2 border-fuchsia-500/30 flex items-center justify-center text-sm font-black text-fuchsia-400">
                            {completionPercentage}%
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                Progress
                            </p>
                            <p className="text-lg font-extrabold text-slate-100">
                                {completedTasks} / {totalTasks}
                            </p>
                        </div>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800/80 px-6 py-4 rounded-2xl flex flex-col justify-center min-w-[120px] backdrop-blur-md">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Pending
                        </p>
                        <p className="text-2xl font-black text-rose-400 mt-1">{pendingTasks}</p>
                    </div>
                </div>
            </header>

            {/* Main Board Layout */}
            <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
                {/* Left Control Panel: Task Creator & Filters (Span 4) */}
                <aside className="lg:col-span-4 flex flex-col gap-6">
                    {/* Create Task Card */}
                    <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl hover:border-slate-850 transition duration-300">
                        <h2 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <Plus className="w-4.5 h-4.5 text-fuchsia-400" />
                            <span>New Task</span>
                        </h2>
                        <form onSubmit={handleAddTask} className="flex flex-col gap-4">
                            <input
                                type="text"
                                value={newTaskText}
                                onChange={(e) => setNewTaskText(e.target.value)}
                                placeholder="Task Title"
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800/80 rounded-xl outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20 text-sm transition"
                            />
                            <textarea
                                value={newTaskContent}
                                onChange={(e) => setNewTaskContent(e.target.value)}
                                placeholder="Task Details or Content..."
                                rows={2}
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800/80 rounded-xl outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20 text-sm transition resize-none"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                {/* Category select */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                        Category
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="px-3 py-2.5 bg-slate-950 border border-slate-800/80 rounded-xl outline-none text-xs text-slate-200 cursor-pointer"
                                    >
                                        <option value="Work">💼 Work</option>
                                        <option value="Personal">🏠 Personal</option>
                                        <option value="Health">❤️ Health</option>
                                        <option value="Finance">💵 Finance</option>
                                    </select>
                                </div>

                                {/* Priority select */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                        Priority
                                    </label>
                                    <select
                                        value={selectedPriority}
                                        onChange={(e) => setSelectedPriority(e.target.value)}
                                        className="px-3 py-2.5 bg-slate-950 border border-slate-800/80 rounded-xl outline-none text-xs text-slate-200 cursor-pointer"
                                    >
                                        <option value="Low">🟢 Low</option>
                                        <option value="Medium">🟡 Medium</option>
                                        <option value="High">🔴 High</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-2 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-95 text-white font-bold rounded-xl text-xs hover:scale-[1.01] active:scale-[0.99] transition duration-200 shadow-md shadow-fuchsia-500/10"
                            >
                                Add to Board
                            </button>
                        </form>
                    </div>

                    {/* Search & Filters Card */}
                    <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl">
                        <h2 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <Search className="w-4.5 h-4.5 text-fuchsia-400" />
                            <span>Search & Filter</span>
                        </h2>

                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search description or tags..."
                                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800/80 rounded-xl outline-none text-xs focus:border-fuchsia-500/50"
                            />

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                    Status
                                </label>
                                <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-900">
                                    {["all", "pending", "completed"].map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setStatusFilter(status)}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                                                statusFilter === status
                                                    ? "bg-slate-900 text-fuchsia-400 border border-slate-800/50"
                                                    : "text-slate-400 hover:text-slate-100"
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                    Category
                                </label>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800/80 rounded-xl outline-none text-xs text-slate-200 cursor-pointer"
                                >
                                    <option value="all">📁 All Categories</option>
                                    <option value="Work">💼 Work</option>
                                    <option value="Personal">🏠 Personal</option>
                                    <option value="Health">❤️ Health</option>
                                    <option value="Finance">💵 Finance</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right Panel: Tasks board (Span 8) */}
                <main className="lg:col-span-8 flex flex-col gap-6">
                    {/* Tasks list Card */}
                    <div className="bg-slate-900/10 border border-slate-900/80 rounded-3xl p-6 min-h-[420px] backdrop-blur-sm flex flex-col">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-900 pb-4">
                            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                                <ListTodo className="w-5 h-5 text-fuchsia-400" />
                                <span>My Tasks</span>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                                    {filteredTasks.length}
                                </span>
                            </h2>
                        </div>

                        {/* Empty view */}
                        {filteredTasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center my-auto py-16 text-center">
                                <div className="w-16 h-16 rounded-3xl bg-slate-900/40 border border-slate-800 flex items-center justify-center mb-4 shadow-inner text-2xl">
                                    🍃
                                </div>
                                <p className="text-slate-400 font-medium">
                                    Clear of outstanding tasks!
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Try relaxing, or add a new action item to the board.
                                </p>
                            </div>
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {filteredTasks.map((task) => (
                                    <li
                                        key={task.id}
                                        className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                                            task.completed
                                                ? "bg-slate-950/20 border-slate-950 text-slate-500 opacity-60"
                                                : "bg-slate-900/30 border-slate-850 hover:border-slate-800 text-slate-100 hover:bg-slate-900/50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            {/* Checkbox button */}
                                            <button
                                                onClick={() => handleToggleComplete(task.id)}
                                                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                                                    task.completed
                                                        ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 border-transparent text-white"
                                                        : "border-slate-700 hover:border-fuchsia-400"
                                                }`}
                                            >
                                                {task.completed && (
                                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                )}
                                            </button>

                                            {/* Content panel */}
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={`text-sm font-semibold truncate ${task.completed ? "line-through text-slate-500" : ""}`}
                                                >
                                                    {task.text}
                                                </p>
                                                {task.content && (
                                                    <p className={`text-xs text-slate-400 mt-1 leading-relaxed ${task.completed ? "line-through text-slate-650" : ""}`}>
                                                        {task.content}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                                        {getCategoryIcon(task.category)}{" "}
                                                        {task.category}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-850"></span>
                                                    <span
                                                        className={`text-[9px] px-2 py-0.5 rounded-md border font-extrabold uppercase ${getPriorityColor(task.priority)}`}
                                                    >
                                                        {task.priority}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-855"></span>
                                                    <span className="text-[10px] text-slate-500">
                                                        ⏱️ {task.createdAt}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delete action button */}
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition duration-150"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Action Log History */}
                    <section className="bg-slate-900/10 border border-slate-900/80 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
                            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-fuchsia-400" />
                                <span>Action History</span>
                            </h2>
                            {activities.length > 0 && (
                                <button
                                    onClick={clearAllActivities}
                                    className="text-xs text-slate-500 hover:text-rose-450 transition"
                                >
                                    Clear logs
                                </button>
                            )}
                        </div>

                        {activities.length === 0 ? (
                            <p className="text-xs text-slate-500 italic py-2">No recent logs.</p>
                        ) : (
                            <ul className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                {activities.map((act) => (
                                    <li
                                        key={act.id}
                                        className="flex justify-between items-center text-[11px] text-slate-400 py-1 border-b border-slate-900/40 last:border-0"
                                    >
                                        <span>{act.message}</span>
                                        <span className="text-[9px] text-slate-600 font-mono">
                                            {act.time}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </main>
            </div>

            {/* Toast Notification Container */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </div>
    );
}

export default Home;
