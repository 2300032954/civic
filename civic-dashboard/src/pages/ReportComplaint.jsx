import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function ReportComplaint() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // 🛑 THE SECURITY GUARD: Kick Admins out of Citizen pages
  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocation("Geolocation is not supported by this browser.");
      return;
    }
    setLocation("Getting location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLocation(`Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`);
      },
      () => {
        setLocation("Unable to get your location.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      alert("You must be logged in to report an issue.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("https://civic-iwnn.onrender.com/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          category: category,
          user_email: user.email,
        }),
      });

      if (response.ok) {
        alert("Complaint submitted successfully!");
        navigate("/dashboard"); 
      } else {
        alert("Failed to submit complaint.");
      }
    } catch (error) {
      alert("Network error. Is the backend awake? (Wait 50 seconds and try again)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-logo">🏛️ CivicConnect</div>
        <nav>
          <Link to="/dashboard">🏠 Dashboard</Link>
          <Link to="/report" className="active">📝 Report Issue</Link>
          <Link to="/complaints">📋 My Complaints</Link>
          <Link to="/analytics">📊 Public Data</Link>
        </nav>
        <div className="sidebar-bottom">
          <Link to="/">🚪 Logout</Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="page-heading">
          <h1>Report a Civic Issue</h1>
          <p>Help improve your community by reporting a public issue.</p>
        </div>

        <div className="complaint-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Issue Title</label>
              <input type="text" placeholder="Example: Large pothole near main road" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="" disabled>Select issue category</option>
                <option>Road & Infrastructure</option>
                <option>Street Lights</option>
                <option>Garbage & Sanitation</option>
                <option>Water Supply</option>
                <option>Drainage</option>
                <option>Public Transport</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea rows="5" placeholder="Describe the issue in detail..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>

            <div className="form-group">
              <label>Upload Photo (UI Only)</label>
              <div className="upload-box">
                {!photo ? (
                  <>
                    <div className="upload-icon">📷</div>
                    <p>Upload a photo of the issue</p>
                    <label className="upload-btn">
                      Choose Photo
                      <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
                    </label>
                  </>
                ) : (
                  <div className="photo-preview">
                    <img src={photo} alt="Complaint" />
                    <label className="upload-btn">
                      Change Photo
                      <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Location (Optional)</label>
              <div className="location-input">
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter issue location" />
                <button type="button" className="location-btn" onClick={getLocation}>
                  📍 Get Location
                </button>
              </div>
            </div>

            <button type="submit" className="submit-complaint-btn" disabled={loading}>
              {loading ? "Submitting... (Please wait)" : "Submit Complaint"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ReportComplaint;