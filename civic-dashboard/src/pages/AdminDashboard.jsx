import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("complaints");
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all complaints
    fetch("https://civic-iwnn.onrender.com/api/admin/complaints")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setComplaints(data);
      })
      .catch(err => console.log(err));

    // Fetch all users
    fetch("https://civic-iwnn.onrender.com/api/admin/users")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">🏛️ CivicConnect Admin</div>
        <nav>
          <Link to="/admin" className="active">📊 Overview</Link>
          <Link to="/">🚪 Logout</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Admin Control Center</h1>
            <p>Manage complaints, track citizens, and upload public datasets.</p>
          </div>
          <div className="user-profile" style={{ background: "#e11d48", color: "white" }}>
            👑 Admin
          </div>
        </header>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button onClick={() => setActiveTab("complaints")} className={`auth-btn ${activeTab === "complaints" ? "" : "bg-gray-200"}`} style={{ width: "auto", padding: "10px 20px", background: activeTab === "complaints" ? "#2563eb" : "#cbd5e1", color: activeTab === "complaints" ? "white" : "black" }}>
            View All Complaints
          </button>
          <button onClick={() => setActiveTab("citizens")} className="auth-btn" style={{ width: "auto", padding: "10px 20px", background: activeTab === "citizens" ? "#2563eb" : "#cbd5e1", color: activeTab === "citizens" ? "white" : "black" }}>
            Citizen Tracking
          </button>
          <button onClick={() => setActiveTab("datasets")} className="auth-btn" style={{ width: "auto", padding: "10px 20px", background: activeTab === "datasets" ? "#2563eb" : "#cbd5e1", color: activeTab === "datasets" ? "white" : "black" }}>
            Upload Datasets
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <div className="dashboard-section">
            
            {/* 1. Complaints Tab */}
            {activeTab === "complaints" && (
              <div className="complaint-table">
                <div className="table-header">
                  <span>Complaint</span>
                  <span>Category</span>
                  <span>Status</span>
                  <span>Reported By</span>
                </div>
                {complaints.length === 0 ? <p style={{padding: "20px"}}>No complaints found.</p> : 
                  complaints.map(c => (
                    <div className="table-row" key={c.id}>
                      <span>{c.title}</span>
                      <span>{c.category}</span>
                      <span className={`status ${c.status.toLowerCase().replace(" ", "-")}`}>{c.status}</span>
                      <span>{c.user_email}</span>
                    </div>
                  ))
                }
              </div>
            )}

            {/* 2. Citizen Tracking Tab */}
            {activeTab === "citizens" && (
              <div className="complaint-table">
                <div className="table-header">
                  <span>Name</span>
                  <span>Email</span>
                  <span>Role</span>
                </div>
                {users.map(u => (
                  <div className="table-row" key={u.id}>
                    <span>{u.name}</span>
                    <span>{u.email}</span>
                    <span style={{ fontWeight: "bold", color: u.role === "admin" ? "#e11d48" : "#2563eb" }}>
                      {u.role.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Dataset Upload Tab (UI Only) */}
            {activeTab === "datasets" && (
              <div style={{ background: "white", padding: "30px", borderRadius: "10px", textAlign: "center", border: "2px dashed #cbd5e1" }}>
                <h3>Upload Public Dataset (CSV)</h3>
                <p style={{ color: "gray", marginBottom: "20px" }}>This data will be used for the Public Analytics Dashboard.</p>
                <input type="file" accept=".csv" style={{ marginBottom: "20px" }} />
                <button className="auth-btn" style={{ maxWidth: "200px" }} onClick={() => alert("Dataset uploaded successfully! (UI Demo)")}>
                  Upload Dataset
                </button>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;