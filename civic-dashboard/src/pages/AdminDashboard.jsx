import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DOMAINS = [
  "Roads", "Education", "Healthcare", "Sanitation", 
  "Water Supply", "Electricity", "Transport", "Other"
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("complaints"); // "complaints", "datasets", or "tracking"
  
  // States for Datasets
  const [datasets, setDatasets] = useState([]);
  const [uploadingDomain, setUploadingDomain] = useState(null);
  
  // States for Complaints
  const [complaints, setComplaints] = useState([]);

  // States for Tracking
  const [tracking, setTracking] = useState({ total_users: 0, total_citizens: 0, total_admins: 0, total_logins: 0, users: [] });

  // Fetch Data Functions
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

  // Handlers
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

  // Helper for Sidebar Button Styling
  const sidebarBtnStyle = (tabName) => ({
    background: "transparent",
    border: "none",
    color: "white",
    textAlign: "left",
    padding: "15px 20px",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    fontWeight: activeTab === tabName ? "bold" : "normal",
    backgroundColor: activeTab === tabName ? "#2563eb" : "transparent",
    borderRadius: "8px",
    marginBottom: "5px",
    transition: "0.2s"
  });

  return (
    <div className="dashboard-page">
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">🏛️ Admin Panel</div>
        
        <nav style={{ display: "flex", flexDirection: "column", padding: "0 10px" }}>
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

        {/* LOGOUT AT THE BOTTOM */}
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
          <div className="complaint-table" style={{ background: "white", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <div className="table-header" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1.5fr", fontWeight: "bold", borderBottom: "2px solid #e5e7eb", paddingBottom: "10px", marginBottom: "10px" }}>
              <span>Issue</span><span>Category</span><span>Reported By</span><span>Status</span>
            </div>
            {complaints.length === 0 ? <p style={{ textAlign: "center", padding: "20px", color: "gray" }}>No complaints reported yet.</p> : 
              complaints.map((c) => (
                <div key={c.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1.5fr", alignItems: "center", borderBottom: "1px solid #f3f4f6", padding: "15px 0" }}>
                  <span style={{ fontWeight: "bold" }}>{c.title}</span><span>{c.category}</span><span style={{ fontSize: "14px", color: "gray" }}>{c.user_email}</span>
                  <select value={c.status} onChange={(e) => handleStatusChange(c.id, e.target.value)} style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc", background: c.status === "Pending" ? "#fef3c7" : c.status === "In Progress" ? "#dbeafe" : "#dcfce7", fontWeight: "bold", cursor: "pointer" }}>
                    <option value="Pending">⏳ Pending</option><option value="In Progress">🔄 In Progress</option><option value="Resolved">✅ Resolved</option>
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
                <div key={domain} style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #e5e7eb", paddingBottom: "10px", marginBottom: "15px" }}>
                    <h3 style={{ margin: 0, color: "#1e3a8a" }}>{domain}</h3>
                    <div>
                      <input type="file" id={`upload-${domain}`} style={{ display: "none" }} accept=".csv, .xlsx" onChange={(e) => handleFileUpload(e, domain)} />
                      <label htmlFor={`upload-${domain}`} style={{ background: uploadingDomain === domain ? "#ccc" : "#2563eb", color: "white", padding: "8px 15px", borderRadius: "5px", cursor: uploadingDomain === domain ? "not-allowed" : "pointer", fontWeight: "bold" }}>
                        {uploadingDomain === domain ? "Uploading..." : "⬆️ Upload New File"}
                      </label>
                    </div>
                  </div>
                  {domainFiles.length === 0 ? <p style={{ color: "gray", fontSize: "14px" }}>No files uploaded yet.</p> : 
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {domainFiles.map((file) => (
                        <div key={file.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9fafb", padding: "10px 15px", borderRadius: "5px", border: "1px solid #e5e7eb" }}>
                          <span style={{ fontSize: "14px", fontWeight: "bold" }}>📄 {file.name}</span>
                          <button onClick={() => handleDeleteDataset(file.id)} style={{ background: "transparent", border: "none", color: "#e11d48", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>🗑️ Delete</button>
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
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "15px", marginBottom: "20px" }}>
              <div style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", textAlign: "center" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "gray" }}>Total Users</h4>
                <h2 style={{ margin: 0, color: "#1e3a8a", fontSize: "32px" }}>{tracking.total_users}</h2>
              </div>
              <div style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", textAlign: "center" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "gray" }}>Citizens</h4>
                <h2 style={{ margin: 0, color: "#2563eb", fontSize: "32px" }}>{tracking.total_citizens}</h2>
              </div>
              <div style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", textAlign: "center" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "gray" }}>Admins</h4>
                <h2 style={{ margin: 0, color: "#e11d48", fontSize: "32px" }}>{tracking.total_admins}</h2>
              </div>
              <div style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", textAlign: "center" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "gray" }}>Total Logins</h4>
                <h2 style={{ margin: 0, color: "#16a34a", fontSize: "32px" }}>{tracking.total_logins}</h2>
              </div>
            </div>

            {/* User Tracking Table */}
            <div className="complaint-table" style={{ background: "white", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
              <h3 style={{ margin: "0 0 15px 0", color: "#1e3a8a" }}>User Activity Log</h3>
              <div className="table-header" style={{ display: "grid", gridTemplateColumns: "2fr 3fr 1fr 1fr 2fr", fontWeight: "bold", borderBottom: "2px solid #e5e7eb", paddingBottom: "10px", marginBottom: "10px" }}>
                <span>Name</span><span>Email</span><span>Role</span><span>Logins</span><span>Last Active</span>
              </div>
              {tracking.users.length === 0 ? <p>No users found.</p> : 
                tracking.users.map((u) => (
                  <div key={u.id} style={{ display: "grid", gridTemplateColumns: "2fr 3fr 1fr 1fr 2fr", alignItems: "center", borderBottom: "1px solid #f3f4f6", padding: "15px 0" }}>
                    <span style={{ fontWeight: "bold" }}>{u.name}</span>
                    <span style={{ color: "gray" }}>{u.email}</span>
                    <span style={{ color: u.role === "admin" ? "#e11d48" : "#2563eb", fontWeight: "bold" }}>{u.role.toUpperCase()}</span>
                    <span style={{ fontWeight: "bold" }}>{u.login_count} times</span>
                    <span style={{ color: "gray", fontSize: "14px" }}>{u.last_login}</span>
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