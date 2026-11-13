import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // <-- Added useNavigate

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate(); // <-- Initialize navigate

  useEffect(() => {
    // 🛑 THE SECURITY GUARD: Kick Admins out of Citizen pages
    if (user?.role === "admin") {
      navigate("/admin");
      return; // Stop the rest of the code from running
    }

    // Normal fetch for Citizens
    if (user) {
      fetch(`https://civic-iwnn.onrender.com/api/complaints/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setComplaints(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user, navigate]); // Added dependencies

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">🏛️ CivicConnect</div>
        <nav>
          <Link to="/dashboard">🏠 Dashboard</Link>
          <Link to="/report">📝 Report Issue</Link>
          <Link to="/complaints" className="active">📋 My Complaints</Link>
          <Link to="/analytics">📊 Public Data</Link>
        </nav>
        <div className="sidebar-bottom">
          <Link to="/">🚪 Logout</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>My Complaints</h1>
            <p>A complete list of all the issues you have reported.</p>
          </div>
        </header>

        <section className="dashboard-section">
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
              <p style={{ padding: "20px" }}>You haven't reported any issues yet.</p>
            ) : (
              complaints.map((c) => (
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

export default MyComplaints;