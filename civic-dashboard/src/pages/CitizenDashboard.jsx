import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CitizenDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState({ name: "Citizen" });
  const [loading, setLoading] = useState(true);

  // 1. Fetch real data from the backend
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
      
      fetch(`https://civic-iwnn.onrender.com/api/complaints/${loggedInUser.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setComplaints(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // 2. Calculate stats automatically based on real data
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">🏛️ CivicConnect</div>
        <nav>
          <Link to="/dashboard" className="active">🏠 Dashboard</Link>
          <Link to="/report">📝 Report Issue</Link>
          <Link to="/complaints">📋 My Complaints</Link>
          <Link to="/analytics">📊 Public Data</Link>
        </nav>
        <div className="sidebar-bottom">
          <Link to="/" onClick={() => localStorage.removeItem("user")}>🚪 Logout</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Citizen Dashboard</h1>
            <p>Welcome back, {user.name}! Track your complaints.</p>
          </div>
          <div className="user-profile">👤 {user.name}</div>
        </header>

        {/* Statistics (Now Dynamic!) */}
        <section className="stats-container">
          <div className="stat-card">
            <span className="stat-icon">📝</span>
            <div>
              <p>Total Complaints</p>
              <h2>{total}</h2>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⏳</span>
            <div>
              <p>Pending</p>
              <h2>{pending}</h2>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🔄</span>
            <div>
              <p>In Progress</p>
              <h2>{inProgress}</h2>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div>
              <p>Resolved</p>
              <h2>{resolved}</h2>
            </div>
          </div>
        </section>

        {/* Recent Complaints (Now Dynamic!) */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Recent Complaints</h2>
            <Link to="/complaints">View All</Link>
          </div>

          <div className="complaint-table">
            <div className="table-header">
              <span>Complaint</span>
              <span>Category</span>
              <span>Date</span>
              <span>Status</span>
            </div>

            {loading ? (
              <p style={{ padding: "20px" }}>Loading your complaints...</p>
            ) : complaints.length === 0 ? (
              <p style={{ padding: "20px" }}>No complaints found. Click "Report Issue" to add one.</p>
            ) : (
              complaints.slice(0, 5).map((c) => ( // Show only the 5 most recent
                <div className="table-row" key={c.id}>
                  <span>{c.title}</span>
                  <span>{c.category}</span>
                  <span>Today</span> {/* We can add real dates later */}
                  <span className={`status ${c.status.toLowerCase().replace(" ", "-")}`}>
                    {c.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default CitizenDashboard;