import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Analytics() {
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the real analytics data from Render
    fetch("https://civic-iwnn.onrender.com/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">🏛️ CivicConnect</div>
        <nav>
          <Link to="/dashboard">🏠 Dashboard</Link>
          <Link to="/report">📝 Report Issue</Link>
          <Link to="/complaints">📋 My Complaints</Link>
          <Link to="/analytics" className="active">📊 Public Data</Link>
        </nav>
        <div className="sidebar-bottom">
          <Link to="/">🚪 Logout</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>📊 Public Data & Analytics</h1>
            <p>Live statistics from across the city.</p>
          </div>
        </header>

        {loading ? (
          <p>Loading live data... (Backend might be waking up)</p>
        ) : (
          <section className="stats-container">
            <div className="stat-card">
              <span className="stat-icon">📝</span>
              <div>
                <p>Total City Complaints</p>
                <h2>{stats.total}</h2>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon">⏳</span>
              <div>
                <p>Pending</p>
                <h2>{stats.pending}</h2>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon">🔄</span>
              <div>
                <p>In Progress</p>
                <h2>{stats.in_progress}</h2>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon">✅</span>
              <div>
                <p>Resolved</p>
                <h2>{stats.resolved}</h2>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Analytics;