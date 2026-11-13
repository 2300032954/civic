import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DOMAINS = [
  "Roads", "Education", "Healthcare", "Sanitation", 
  "Water Supply", "Electricity", "Transport", "Other"
];

function AdminDashboard() {
  const [datasets, setDatasets] = useState([]);
  const [uploadingDomain, setUploadingDomain] = useState(null);

  const fetchDatasets = () => {
    fetch("https://civic-iwnn.onrender.com/api/admin/datasets")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setDatasets(data); });
  };

  useEffect(() => { fetchDatasets(); }, []);

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

  const handleDelete = async (datasetId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    
    try {
      const res = await fetch(`https://civic-iwnn.onrender.com/api/admin/datasets/${datasetId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("🗑️ File deleted successfully.");
        fetchDatasets(); // Refresh list
      } else {
        alert("❌ Failed to delete file.");
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
          <div><h1>Admin Data Management</h1><p>Upload and manage Excel datasets for each domain.</p></div>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
          {DOMAINS.map((domain) => {
            const domainFiles = datasets.filter((d) => d.category === domain);

            return (
              <div key={domain} style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                
                {/* Header of Domain Card */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #e5e7eb", paddingBottom: "10px", marginBottom: "15px" }}>
                  <h3 style={{ margin: 0, color: "#1e3a8a" }}>{domain}</h3>
                  
                  <div>
                    <input type="file" id={`upload-${domain}`} style={{ display: "none" }} accept=".csv, .xlsx" onChange={(e) => handleFileUpload(e, domain)} />
                    <label htmlFor={`upload-${domain}`} style={{ background: uploadingDomain === domain ? "#ccc" : "#2563eb", color: "white", padding: "8px 15px", borderRadius: "5px", cursor: uploadingDomain === domain ? "not-allowed" : "pointer", fontWeight: "bold" }}>
                      {uploadingDomain === domain ? "Uploading..." : "⬆️ Upload New File"}
                    </label>
                  </div>
                </div>

                {/* List of Files for this Domain */}
                {domainFiles.length === 0 ? (
                  <p style={{ color: "gray", fontSize: "14px" }}>No files uploaded yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {domainFiles.map((file) => (
                      <div key={file.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9fafb", padding: "10px 15px", borderRadius: "5px", border: "1px solid #e5e7eb" }}>
                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>📄 {file.name}</span>
                        <button onClick={() => handleDelete(file.id)} style={{ background: "transparent", border: "none", color: "#e11d48", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>
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
      </main>
    </div>
  );
}
export default AdminDashboard;