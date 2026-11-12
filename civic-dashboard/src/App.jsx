import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard"; // Added Admin
import ReportComplaint from "./pages/ReportComplaint";
import MyComplaints from "./pages/MyComplaints";
import Analytics from "./pages/Analytics"; // Added Analytics

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Dashboards */}
        <Route path="/dashboard" element={<CitizenDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Sidebar Links (Make sure these match CitizenDashboard.jsx) */}
        <Route path="/report" element={<ReportComplaint />} />
        <Route path="/complaints" element={<MyComplaints />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;