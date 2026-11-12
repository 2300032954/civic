import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [selectedDomain, setSelectedDomain] = useState(null); // Tracks which domain the user clicked

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
        
        {/* --- VIEW 1: SHOW THE CHART IF A DOMAIN IS CLICKED --- */}
        {selectedDomain ? (
          <div>
            <button 
              onClick={() => setSelectedDomain(null)} 
              style={{ marginBottom: "20px", padding: "8px 16px", background: "#e5e7eb", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
            >
              ← Back to Domains
            </button>
            
            <div style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
              <h1 style={{ color: "#1e3a8a", marginBottom: "20px" }}>{selectedDomain} Data Analysis</h1>
              
              {datasets.find(d => d.category === selectedDomain) ? (
                <>
                  <p style={{ color: "gray", marginBottom: "20px" }}>
                    Visualizing: <strong>{datasets.find(d => d.category === selectedDomain).name}</strong>
                  </p>
                  <div style={{ width: "100%", height: 400 }}>
                    <ResponsiveContainer>
                      <BarChart data={JSON.parse(datasets.find(d => d.category === selectedDomain).data_json)}>
                        <XAxis dataKey="name" tick={{fontSize: 14}} />
                        <YAxis tick={{fontSize: 14}} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "50px", color: "gray" }}>
                  <p>No dataset has been uploaded for {selectedDomain} yet.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          
          /* --- VIEW 2: SHOW THE GRID OF 8 DOMAINS --- */
          <div>
            <header className="dashboard-header">
              <div>
                <h1>📊 Public Data Analytics</h1>
                <p>Click on a domain to view the visualized data.</p>
              </div>
            </header>

            {loading ? (
              <p>Loading domains...</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
                {DOMAINS.map((domain) => {
                  const hasData = datasets.some((d) => d.category === domain.name);
                  return (
                    <div 
                      key={domain.name} 
                      onClick={() => setSelectedDomain(domain.name)}
                      style={{ 
                        background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", 
                        cursor: "pointer", transition: "transform 0.2s, boxShadow 0.2s", 
                        borderLeft: hasData ? "5px solid #2563eb" : "5px solid #e5e7eb"
                      }}
                      // Simple hover effect
                      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <span style={{ fontSize: "40px" }}>{domain.icon}</span>
                        <div>
                          <h3 style={{ margin: 0, color: "#1e3a8a", fontSize: "22px" }}>{domain.name}</h3>
                          <p style={{ margin: "5px 0 0 0", color: hasData ? "green" : "gray", fontWeight: "bold" }}>
                            {hasData ? "✅ Click to View Data" : "⏳ Awaiting Admin Upload"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
export default Analytics;