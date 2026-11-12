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
      alert("❌ Network error. Is backend awake?");
    } finally {
      setUploadingDomain(null);
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
          <div><h1>Admin Data Management</h1><p>Upload Excel datasets for citizens to view.</p></div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
          {DOMAINS.map((domain) => {
            const uploaded = datasets.find((d) => d.category === domain);
            return (
              <div key={domain} style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0, color: "#1e3a8a" }}>{domain}</h3>
                  <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: uploaded ? "green" : "gray" }}>
                    {uploaded ? "✅ Data Uploaded" : "❌ No data"}
                  </p>
                </div>
                
                <div>
                  <input type="file" id={`upload-${domain}`} style={{ display: "none" }} accept=".csv, .xlsx" onChange={(e) => handleFileUpload(e, domain)} />
                  <label htmlFor={`upload-${domain}`} style={{ background: uploadingDomain === domain ? "#ccc" : "#2563eb", color: "white", padding: "10px 15px", borderRadius: "5px", cursor: uploadingDomain === domain ? "not-allowed" : "pointer", fontWeight: "bold" }}>
                    {uploadingDomain === domain ? "Uploading..." : (uploaded ? "🔄 Replace File" : "⬆️ Upload File")}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
export default AdminDashboard;