import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DOMAINS = [
  "Roads", "Education", "Healthcare", "Sanitation", 
  "Water Supply", "Electricity", "Transport", "Other"
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("complaints"); // "complaints" or "datasets"
  
  // States for Datasets
  const [datasets, setDatasets] = useState([]);
  const [uploadingDomain, setUploadingDomain] = useState(null);
  
  // States for Complaints
  const [complaints, setComplaints] = useState([]);

  // Fetch Datasets
  const fetchDatasets = () => {
    fetch("https://civic-iwnn.onrender.com/api/admin/datasets")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setDatasets(data); });
  };

  // Fetch All Complaints
  const fetchComplaints = () => {
    fetch("https://civic-iwnn.onrender.com/api/admin/complaints")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setComplaints(data); });
  };

  useEffect(() => {
    fetchDatasets();
    fetchComplaints();
  }, []);

  // Handle File Upload
  const handleFileUpload = async (event, domainName) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingDomain(domainName);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", domainName);

    try {
      const res = await fetch("https://civic-iwnn.onrender.com/api/admin/upload-dataset", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert(`✅ ${domainName} dataset uploaded successfully!`);
        fetchDatasets();
      } else {
        alert("❌ Upload failed.");
      }
    } catch (err) {
      alert("❌ Network error.");
    } finally {
      setUploadingDomain(null);
    }
  };

  // Handle Delete Dataset
  const handleDeleteDataset = async (datasetId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      const res = await fetch(`https://civic-iwnn.onrender.com/api/admin/datasets/${datasetId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("🗑️ File deleted successfully.");
        fetchDatasets();
      } else {
        alert("❌ Failed to delete file.");
      }
    } catch (err) {
      alert("❌ Network error.");
    }
  };

  // Handle Complaint Status Update
  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const res = await fetch(`https://civic-iwnn.onrender.com/api/admin/complaints/${complaintId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        // Update the UI instantly without reloading
        setComplaints(complaints.map(c => c.id === complaintId ? { ...c, status: newStatus } : c));
      } else {
        alert("❌ Failed to update status.");
      }
    } catch (err) {
      alert("❌ Network error.");
    }
  };

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-logo">🏛️ Admin Panel</div>
        <nav>
          <Link to="/admin" className="active">📊 Dashboard</Link>
          <Link to="/">🚪 Logout</Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Admin Control Center</h1>
            <p>Manage user complaints and upload public datasets.</p>
          </div>
        </header>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button 
            onClick={() => setActiveTab("complaints")} 
            style={{ padding: "10px 20px", background: activeTab === "complaints" ? "#2563eb" : "#e5e7eb", color: activeTab === "complaints" ? "white" : "black", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
          >
            📝 Manage Complaints
          </button>
          <button 
            onClick={() => setActiveTab("datasets")} 
            style={{ padding: "10px 20px", background: activeTab === "datasets" ? "#2563eb" : "#e5e7eb", color: activeTab === "datasets" ? "white" : "black", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
          >
            📁 Manage Datasets
          </button>
        </div>

        {/* --- TAB 1: COMPLAINTS --- */}
        {activeTab === "complaints" && (
          <div className="complaint-table" style={{ background: "white", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <div className="table-header" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1.5fr", fontWeight: "bold", borderBottom: "2px solid #e5e7eb", paddingBottom: "10px", marginBottom: "10px" }}>
              <span>Issue</span>
              <span>Category</span>
              <span>Reported By</span>
              <span>Status (Click to Change)</span>
            </div>
            
            {complaints.length === 0 ? (
              <p style={{ textAlign: "center", padding: "20px", color: "gray" }}>No complaints reported yet.</p>
            ) : (
              complaints.map((c) => (
                <div key={c.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1.5fr", alignItems: "center", borderBottom: "1px solid #f3f4f6", padding: "15px 0" }}>
                  <span style={{ fontWeight: "bold" }}>{c.title}</span>
                  <span>{c.category}</span>
                  <span style={{ fontSize: "14px", color: "gray" }}>{c.user_email}</span>
                  
                  {/* Status Dropdown */}
                  <select 
                    value={c.status} 
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    style={{ 
                      padding: "8px", 
                      borderRadius: "5px", 
                      border: "1px solid #ccc",
                      background: c.status === "Pending" ? "#fef3c7" : c.status === "In Progress" ? "#dbeafe" : "#dcfce7",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    <option value="Pending">⏳ Pending</option>
                    <option value="In Progress">🔄 In Progress</option>
                    <option value="Resolved">✅ Resolved</option>
                  </select>
                </div>
              ))
            )}
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

                  {domainFiles.length === 0 ? (
                    <p style={{ color: "gray", fontSize: "14px" }}>No files uploaded yet.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {domainFiles.map((file) => (
                        <div key={file.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9fafb", padding: "10px 15px", borderRadius: "5px", border: "1px solid #e5e7eb" }}>
                          <span style={{ fontSize: "14px", fontWeight: "bold" }}>📄 {file.name}</span>
                          <button onClick={() => handleDeleteDataset(file.id)} style={{ background: "transparent", border: "none", color: "#e11d48", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>
                            🗑️ Delete
                          </button>
                        </div>
                      ))}
                    </div>
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
export default AdminDashboard;