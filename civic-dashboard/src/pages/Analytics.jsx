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
  
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [showVisualization, setShowVisualization] = useState(false); // Tracks if we should show the chart

  useEffect(() => {
    fetch("https://civic-iwnn.onrender.com/api/admin/datasets")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDatasets(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Helper to get the current dataset
  const currentDataset = selectedDomain ? datasets.find(d => d.category === selectedDomain) : null;

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
        
        {/* --- VIEW 3: SHOW THE CHART --- */}
        {selectedDomain && showVisualization && currentDataset && (
          <div>
            <button 
              onClick={() => setShowVisualization(false)} 
              style={{ marginBottom: "20px", padding: "8px 16px", background: "#e5e7eb", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
            >
              ← Back to File Info
            </button>
            
            <div style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
              <h1 style={{ color: "#1e3a8a", marginBottom: "10px" }}>{selectedDomain} Data Visualization</h1>
              <p style={{ color: "gray", marginBottom: "30px" }}>
                Visualizing: <strong>{currentDataset.name}</strong>
              </p>
              
              <div style={{ width: "100%", height: 450 }}>
                <ResponsiveContainer>
                  <BarChart data={JSON.parse(currentDataset.data_json)}>
                    <XAxis dataKey="name" tick={{fontSize: 14}} />
                    <YAxis tick={{fontSize: 14}} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW 2: SHOW THE EXCEL FILE CARD --- */}
        {selectedDomain && !showVisualization && (
          <div>
            <button 
              onClick={() => setSelectedDomain(null)} 
              style={{ marginBottom: "20px", padding: "8px 16px", background: "#e5e7eb", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
            >
              ← Back to Domains
            </button>
            
            <div style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", maxWidth: "600px" }}>
              <h2 style={{ color: "#1e3a8a", borderBottom: "2px solid #e5e7eb", paddingBottom: "15px", marginBottom: "20px" }}>
                {selectedDomain} Dataset
              </h2>
              
              {currentDataset ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f9fafb", padding: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <span style={{ fontSize: "40px" }}>📄</span>
                    <div>
                      <h3 style={{ margin: 0, color: "#111827" }}>{currentDataset.name}</h3>
                      <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#6b7280" }}>Uploaded via Admin Portal</p>
                    </div>
                  </div>
                  
                  {/* The View Button in the corner */}
                  <button 
                    onClick={() => setShowVisualization(true)}
                    style={{ background: "#2563eb", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <span>👁️</span> View
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px", color: "gray" }}>
                  <span style={{ fontSize: "50px", opacity: 0.3 }}>📭</span>
                  <p>No dataset has been uploaded for {selectedDomain} yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- VIEW 1: SHOW THE GRID OF 8 DOMAINS --- */}
        {!selectedDomain && (
          <div>
            <header className="dashboard-header">
              <div>
                <h1>📊 Public Data Analytics</h1>
                <p>Click on a domain to view the available datasets.</p>
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
                      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <span style={{ fontSize: "40px" }}>{domain.icon}</span>
                        <div>
                          <h3 style={{ margin: 0, color: "#1e3a8a", fontSize: "22px" }}>{domain.name}</h3>
                          <p style={{ margin: "5px 0 0 0", color: hasData ? "green" : "gray", fontWeight: "bold" }}>
                            {hasData ? "✅ Data Available" : "⏳ Awaiting Admin Upload"}
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