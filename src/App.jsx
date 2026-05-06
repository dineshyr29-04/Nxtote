
import "./App.css";
import {  Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import Home from './pages/home'
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />}></Route>
      </Routes>
    </>
  );
}

export default App;
