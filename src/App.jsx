import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
import Login from "./pages/login";
import ProtectedRoute from "./components/Protectedroute"; 

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto w-full px-4 pb-8 pt-24 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />}></Route>
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
