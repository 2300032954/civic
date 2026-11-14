import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ReportComplaint from "./pages/ReportComplaint";
import MyComplaints from "./pages/MyComplaints";
import Analytics from "./pages/Analytics";
import Footer from "./components/Footer"; // <-- Import the Footer

function App() {
  return (
    <BrowserRouter>
      {/* Flex column ensures footer stays at the bottom */}
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        
        {/* Main content area */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Dashboards */}
            <Route path="/dashboard" element={<CitizenDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Sidebar Links */}
            <Route path="/report" element={<ReportComplaint />} />
            <Route path="/complaints" element={<MyComplaints />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>

        {/* The Footer will appear on every page */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;