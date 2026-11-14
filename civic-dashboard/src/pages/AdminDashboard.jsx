import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DOMAINS = [
  "Roads", "Education", "Healthcare", "Sanitation", 
  "Water Supply", "Electricity", "Transport", "Other"
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("complaints"); 
  
  const [datasets, setDatasets] = useState([]);
  const [uploadingDomain, setUploadingDomain] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [tracking, setTracking] = useState({ total_users: 0, total_citizens: 0, total_admins: 0, total_logins: 0, users: [] });

  const fetchDatasets = () => {
    fetch("https://civic-iwnn.onrender.com/api/admin/datasets")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setDatasets(data); });
  };

  const fetchComplaints = () => {
    fetch("https://civic-iwnn.onrender.com/api/admin/complaints")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setComplaints(data); });
  };

  const fetchTracking = () => {
    fetch("https://civic-iwnn.onrender.com/api/admin/tracking")
      .then(res => res.json())
      .then(data => { if (data.users) setTracking(data); });
  };

  useEffect(() => {
    fetchDatasets();
    fetchComplaints();
    fetchTracking();
  }, []);

  const handleFileUpload = async (event, domainName) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadingDomain(domainName);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", domainName);
    try {
      const res = await fetch("https://civic-iwnn.onrender.com/api/admin/upload-dataset", { method: "POST", body: formData });
      if (res.ok) { alert(`✅ ${domainName} dataset uploaded!`); fetchDatasets(); }
    } catch (err) { alert("❌ Network error."); } finally { setUploadingDomain(null); }
  };

  const handleDeleteDataset = async (datasetId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`https://civic-iwnn.onrender.com/api/admin/datasets/${datasetId}`, { method: "DELETE" });
      if (res.ok) { alert("🗑️ Deleted."); fetchDatasets(); }
    } catch (err) { alert("❌ Network error."); }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const res = await fetch(`https://civic-iwnn.onrender.com/api/admin/complaints/${complaintId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) { setComplaints(complaints.map(c => c.id === complaintId ? { ...c, status: newStatus } : c)); }
    } catch (err) { alert("❌ Network error."); }
  };

  const sidebarBtnStyle = (tabName) => ({
    background: activeTab === tabName ? "linear-gradient(135deg, rgba(37, 99, 235, 0.8), rgba(6, 182, 212, 0.8))" : "transparent",
    border: "none",
    color: activeTab === tabName ? "white" : "#94a3b8",
    textAlign: "left",
    padding: "14px 18px",
    fontSize: "15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    fontWeight: activeTab === tabName ? "600" : "500",
    borderRadius: "12px",
    marginBottom: "8px",
    transition: "0.2s"
  });

  return (
    <div className="dashboard-page">
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">🏛️ Admin Panel</div>
        
        <nav style={{ display: "flex", flexDirection: "column" }}>
          <button onClick={() => setActiveTab("complaints")} style={sidebarBtnStyle("complaints")}>
            📝 Manage Complaints
          </button>
          <button onClick={() => setActiveTab("datasets")} style={sidebarBtnStyle("datasets")}>
            📁 Manage Datasets
          </button>
          <button onClick={() => setActiveTab("tracking")} style={sidebarBtnStyle("tracking")}>
            👥 Citizen Tracking
          </button>
        </nav>

        <div className="sidebar-bottom">
          <Link to="/">🚪 Logout</Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>
              {activeTab === "complaints" && "Manage Complaints"}
              {activeTab === "datasets" && "Manage Datasets"}
              {activeTab === "tracking" && "Citizen Tracking"}
            </h1>
            <p>
              {activeTab === "complaints" && "Review and update the status of citizen reports."}
              {activeTab === "datasets" && "Upload and manage Excel datasets for the public data portal."}
              {activeTab === "tracking" && "View user activity, login counts, and last active times."}
            </p>
          </div>
        </header>

        {/* --- TAB 1: COMPLAINTS --- */}
        {activeTab === "complaints" && (
          <div className="complaint-table">
            <div className="table-header" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1.5fr" }}>
              <span>Issue</span><span>Category</span><span>Reported By</span><span>Status</span>
            </div>
            {complaints.length === 0 ? <p style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>No complaints reported yet.</p> : 
              complaints.map((c) => (
                <div key={c.id} className="table-row" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1.5fr" }}>
                  <span style={{ fontWeight: "600", color: "white" }}>{c.title}</span>
                  <span>{c.category}</span>
                  <span style={{ fontSize: "14px", color: "#94a3b8" }}>{c.user_email}</span>
                  <select 
                    value={c.status} 
                    onChange={(e) => handleStatusChange(c.id, e.target.value)} 
                    style={{ 
                      padding: "8px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", 
                      background: c.status === "Pending" ? "rgba(245, 158, 11, 0.2)" : c.status === "In Progress" ? "rgba(59, 130, 246, 0.2)" : "rgba(16, 185, 129, 0.2)", 
                      color: c.status === "Pending" ? "#fbbf24" : c.status === "In Progress" ? "#60a5fa" : "#34d399",
                      fontWeight: "bold", cursor: "pointer", outline: "none"
                    }}
                  >
                    <option style={{background: "#1e293b"}} value="Pending">⏳ Pending</option>
                    <option style={{background: "#1e293b"}} value="In Progress">🔄 In Progress</option>
                    <option style={{background: "#1e293b"}} value="Resolved">✅ Resolved</option>
                  </select>
                </div>
              ))
            }
          </div>
        )}

        {/* --- TAB 2: DATASETS --- */}
        {activeTab === "datasets" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {DOMAINS.map((domain) => {
              const domainFiles = datasets.filter((d) => d.category === domain);
              return (
                <div key={domain} className="complaint-table" style={{ padding: "25px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "15px", marginBottom: "15px" }}>
                    <h3 style={{ margin: 0, color: "white" }}>{domain}</h3>
                    <div>
                      <input type="file" id={`upload-${domain}`} style={{ display: "none" }} accept=".csv, .xlsx" onChange={(e) => handleFileUpload(e, domain)} />
                      <label htmlFor={`upload-${domain}`} style={{ background: uploadingDomain === domain ? "#64748b" : "linear-gradient(135deg, #2563eb, #06b6d4)", color: "white", padding: "8px 16px", borderRadius: "8px", cursor: uploadingDomain === domain ? "not-allowed" : "pointer", fontWeight: "600", fontSize: "14px" }}>
                        {uploadingDomain === domain ? "Uploading..." : "⬆️ Upload New File"}
                      </label>
                    </div>
                  </div>
                  {domainFiles.length === 0 ? <p style={{ color: "#94a3b8", fontSize: "14px" }}>No files uploaded yet.</p> : 
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {domainFiles.map((file) => (
                        <div key={file.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.2)", padding: "12px 18px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <span style={{ fontSize: "14px", fontWeight: "600", color: "#e2e8f0" }}>📄 {file.name}</span>
                          <button onClick={() => handleDeleteDataset(file.id)} style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#fca5a5", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>🗑️ Delete</button>
                        </div>
                      ))}
                    </div>
                  }
                </div>
              );
            })}
          </div>
        )}

        {/* --- TAB 3: CITIZEN TRACKING --- */}
        {activeTab === "tracking" && (
          <div>
            {/* Stat Cards (Now Dark Mode) */}
            <div className="stats-container">
              <div className="stat-card" style={{ flexDirection: "column", textAlign: "center", padding: "30px" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#94a3b8", fontWeight: "500" }}>Total Users</h4>
                <h2 style={{ margin: 0, color: "#ffffff", fontSize: "36px" }}>{tracking.total_users}</h2>
              </div>
              <div className="stat-card" style={{ flexDirection: "column", textAlign: "center", padding: "30px" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#94a3b8", fontWeight: "500" }}>Citizens</h4>
                <h2 style={{ margin: 0, color: "#38bdf8", fontSize: "36px" }}>{tracking.total_citizens}</h2>
              </div>
              <div className="stat-card" style={{ flexDirection: "column", textAlign: "center", padding: "30px" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#94a3b8", fontWeight: "500" }}>Admins</h4>
                <h2 style={{ margin: 0, color: "#f472b6", fontSize: "36px" }}>{tracking.total_admins}</h2>
              </div>
              <div className="stat-card" style={{ flexDirection: "column", textAlign: "center", padding: "30px" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#94a3b8", fontWeight: "500" }}>Total Logins</h4>
                <h2 style={{ margin: 0, color: "#34d399", fontSize: "36px" }}>{tracking.total_logins}</h2>
              </div>
            </div>

            {/* User Tracking Table (Now Dark Mode) */}
            <div className="complaint-table">
              <div style={{ padding: "20px 25px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <h3 style={{ margin: 0, color: "white" }}>User Activity Log</h3>
              </div>
              <div className="table-header" style={{ display: "grid", gridTemplateColumns: "2fr 3fr 1fr 1fr 2fr" }}>
                <span>Name</span><span>Email</span><span>Role</span><span>Logins</span><span>Last Active</span>
              </div>
              {tracking.users.length === 0 ? <p style={{ padding: "30px", color: "#94a3b8" }}>No users found.</p> : 
                tracking.users.map((u) => (
                  <div key={u.id} className="table-row" style={{ display: "grid", gridTemplateColumns: "2fr 3fr 1fr 1fr 2fr" }}>
                    <span style={{ fontWeight: "600", color: "white" }}>{u.name}</span>
                    <span style={{ color: "#94a3b8" }}>{u.email}</span>
                    <span style={{ color: u.role === "admin" ? "#f472b6" : "#38bdf8", fontWeight: "bold" }}>{u.role.toUpperCase()}</span>
                    <span style={{ fontWeight: "600", color: "#e2e8f0" }}>{u.login_count} times</span>
                    <span style={{ color: "#94a3b8", fontSize: "14px" }}>{u.last_login}</span>
                  </div>
                ))
              }
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
export default AdminDashboard;