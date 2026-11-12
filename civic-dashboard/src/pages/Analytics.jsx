import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Added icons for each domain!
const DOMAINS = [
  { name: "Roads", icon: "🛣️" },
  { name: "Education", icon: "🏫" },
  { name: "Healthcare", icon: "🏥" },
  { name: "Sanitation", icon: "🗑️" },
  { name: "Water Supply", icon: "💧" },
  { name: "Electricity", icon: "⚡" },
  { name: "Transport", icon: "🚌" },
  { name: "Other", icon: "📌" }
];

function Analytics() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Check if the current user is an admin
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

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
        <header className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1>📊 Public Data Analytics</h1>
            <p>Explore civic data uploaded by the administration.</p>
          </div>
          
          {/* Show this button ONLY if the user is an Admin */}
          {isAdmin && (
            <Link to="/admin" style={{ background: "#2563eb", color: "white", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}>
              ➕ Add / Upload Dataset
            </Link>
          )}
        </header>

        {loading ? (
          <p>Loading datasets... (Backend might be waking up)</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
            
            {/* Loop through all 8 fixed domains */}
            {DOMAINS.map((domain) => {
              // Find if a dataset exists for this specific domain
              const uploadedDataset = datasets.find((d) => d.category === domain.name);

              return (
                <div key={domain.name} style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", minHeight: "350px", display: "flex", flexDirection: "column" }}>
                  
                  {/* Card Header with Icon */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", borderBottom: "2px solid #e5e7eb", paddingBottom: "10px", marginBottom: "15px" }}>
                    <span style={{ fontSize: "28px" }}>{domain.icon}</span>
                    <h3 style={{ margin: 0, color: "#1e3a8a", fontSize: "20px" }}>
                      {domain.name}
                    </h3>
                  </div>

                  {!uploadedDataset ? (
                    // Beautiful Empty State
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, color: "#9ca3af" }}>
                      <span style={{ fontSize: "50px", marginBottom: "10px", opacity: 0.3 }}>{domain.icon}</span>
                      <p>No data uploaded for {domain.name} yet.</p>
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize: "12px", color: "gray", marginBottom: "15px" }}>
                        Source File: <strong>{uploadedDataset.name}</strong>
                      </p>
                      
                      {/* The Chart */}
                      <div style={{ width: "100%", height: 250, flex: 1 }}>
                        <ResponsiveContainer>
                          <BarChart data={JSON.parse(uploadedDataset.data_json)}>
                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                            <YAxis tick={{fontSize: 12}} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </>
                  )}
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