import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function Analytics() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://civic-iwnn.onrender.com/api/admin/datasets")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDatasets(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-logo">🏛️ CivicConnect</div>
        <nav>
          <Link to="/dashboard">🏠 Dashboard</Link>
          <Link to="/report">📝 Report Issue</Link>
          <Link to="/complaints">📋 My Complaints</Link>
          <Link to="/analytics" className="active">📊 Public Data</Link>
        </nav>
        <div className="sidebar-bottom"><Link to="/">🚪 Logout</Link></div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>📊 Public Data Analytics</h1>
            <p>Explore civic data uploaded by the administration.</p>
          </div>
        </header>

        {loading ? <p>Loading charts...</p> : datasets.length === 0 ? <p>No datasets uploaded yet.</p> : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {datasets.map((ds) => {
              // Convert the JSON string from the database back into an array
              const chartData = JSON.parse(ds.data_json);
              return (
                <div key={ds.id} style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                  <h3 style={{ marginBottom: "15px", color: "#1e3a8a" }}>{ds.category} Data</h3>
                  <p style={{ fontSize: "12px", color: "gray", marginBottom: "20px" }}>Source: {ds.name}</p>
                  
                  {/* The Chart */}
                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Analytics;