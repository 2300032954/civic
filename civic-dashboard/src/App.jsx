import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CitizenDashboard from "./pages/CitizenDashboard";
import ReportComplaint from "./pages/ReportComplaint";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<CitizenDashboard />}/>
        <Route path="/report" element={<ReportComplaint />}/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;