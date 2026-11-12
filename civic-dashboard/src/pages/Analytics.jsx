import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// The 8 fixed domains
const DOMAINS = [
  "Roads",
  "Education",
  "Healthcare",
  "Sanitation",
  "Water Supply",
  "Electricity",
  "Transport",
  "Other"
];

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

        {loading ? (
          <p>Loading datasets... (Backend might be waking up)</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            
            {/* Loop through all 8 fixed domains */}
            {DOMAINS.map((domain) => {
              // Find if a dataset exists for this specific domain
              const uploadedDataset = datasets.find((d) => d.category === domain);

              return (
                <div key={domain} style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", minHeight: "350px" }}>
                  <h3 style={{ marginBottom: "10px", color: "#1e3a8a", borderBottom: "2px solid #e5e7eb", paddingBottom: "10px" }}>
                    {domain}
                  </h3>

                  {!uploadedDataset ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "250px", color: "#9ca3af" }}>
                      <p>No data uploaded for {domain} yet.</p>
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize: "12px", color: "gray", marginBottom: "15px" }}>
                        Source: {uploadedDataset.name}
                      </p>
                      
                      {/* The Chart */}
                      <div style={{ width: "100%", height: 250 }}>
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