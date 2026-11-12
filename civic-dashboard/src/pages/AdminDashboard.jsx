import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("complaints");
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("Roads");

  useEffect(() => {
    fetch("https://civic-iwnn.onrender.com/api/admin/complaints").then(res => res.json()).then(data => { if (Array.isArray(data)) setComplaints(data); });
    fetch("https://civic-iwnn.onrender.com/api/admin/users").then(res => res.json()).then(data => { if (Array.isArray(data)) setUsers(data); });
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    try {
      const res = await fetch("https://civic-iwnn.onrender.com/api/admin/upload-dataset", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("Dataset uploaded and processed successfully!");
        setFile(null);
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      alert("Network error.");
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-logo">🏛️ Admin Panel</div>
        <nav>
          <Link to="/admin" className="active">📊 Overview</Link>
          <Link to="/">🚪 Logout</Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div><h1>Admin Control Center</h1></div>
        </header>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button onClick={() => setActiveTab("complaints")} style={{ padding: "10px", background: activeTab === "complaints" ? "#2563eb" : "#ccc", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Complaints</button>
          <button onClick={() => setActiveTab("citizens")} style={{ padding: "10px", background: activeTab === "citizens" ? "#2563eb" : "#ccc", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Citizens</button>
          <button onClick={() => setActiveTab("datasets")} style={{ padding: "10px", background: activeTab === "datasets" ? "#2563eb" : "#ccc", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Upload Datasets</button>
        </div>

        {activeTab === "complaints" && (
          <div className="complaint-table">
            <div className="table-header"><span>Complaint</span><span>Category</span><span>Status</span><span>Reported By</span></div>
            {complaints.map(c => (
              <div className="table-row" key={c.id}><span>{c.title}</span><span>{c.category}</span><span>{c.status}</span><span>{c.user_email}</span></div>
            ))}
          </div>
        )}

        {activeTab === "citizens" && (
          <div className="complaint-table">
            <div className="table-header"><span>Name</span><span>Email</span><span>Role</span></div>
            {users.map(u => (
              <div className="table-row" key={u.id}><span>{u.name}</span><span>{u.email}</span><span>{u.role.toUpperCase()}</span></div>
            ))}
          </div>
        )}

        {activeTab === "datasets" && (
          <div style={{ background: "white", padding: "30px", borderRadius: "10px" }}>
            <h3>Upload Public Dataset (Excel/CSV)</h3>
            <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: "10px", borderRadius: "5px" }}>
                <option value="Roads">Roads</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Water">Water Supply</option>
                <option value="Electricity">Electricity</option>
                <option value="Transport">Transport</option>
                <option value="Other">Other</option>
              </select>
              <input type="file" accept=".csv, .xlsx" onChange={(e) => setFile(e.target.files[0])} style={{ padding: "10px", border: "1px solid #ccc" }} />
              <button type="submit" disabled={loading} style={{ padding: "10px", background: "#2563eb", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                {loading ? "Processing Data..." : "Upload & Process"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;