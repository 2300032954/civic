import { useState } from "react";
import { Link } from "react-router-dom";

function ReportComplaint() {
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState("");

  // Photo upload
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  // Get user's location
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

        setLocation(
          `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`
        );
      },
      () => {
        setLocation("Unable to get your location.");
      }
    );
  };

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          🏛️ CivicConnect
        </div>

        <nav>
          <Link to="/dashboard">
            🏠 Dashboard
          </Link>

          <Link to="/report" className="active">
            📝 Report Issue
          </Link>

          <Link to="/complaints">
            📋 My Complaints
          </Link>

          <Link to="/analytics">
            📊 Public Data
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <Link to="/">
            🚪 Logout
          </Link>
        </div>

      </aside>


      {/* Main Content */}
      <main className="dashboard-main">

        <div className="page-heading">
          <h1>Report a Civic Issue</h1>

          <p>
            Help improve your community by reporting a public issue.
          </p>
        </div>


        <div className="complaint-form-card">

          <form>

            {/* Title */}
            <div className="form-group">

              <label>Issue Title</label>

              <input
                type="text"
                placeholder="Example: Large pothole near main road"
              />

            </div>


            {/* Category */}
            <div className="form-group">

              <label>Category</label>

              <select defaultValue="">

                <option value="" disabled>
                  Select issue category
                </option>

                <option>Road & Infrastructure</option>
                <option>Street Lights</option>
                <option>Garbage & Sanitation</option>
                <option>Water Supply</option>
                <option>Drainage</option>
                <option>Public Transport</option>
                <option>Other</option>

              </select>

            </div>


            {/* Description */}
            <div className="form-group">

              <label>Description</label>

              <textarea
                rows="5"
                placeholder="Describe the issue in detail..."
              ></textarea>

            </div>


            {/* Photo */}
            <div className="form-group">

              <label>Upload Photo</label>

              <div className="upload-box">

                {!photo ? (
                  <>
                    <div className="upload-icon">
                      📷
                    </div>

                    <p>
                      Upload a photo of the issue
                    </p>

                    <label className="upload-btn">

                      Choose Photo

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        hidden
                      />

                    </label>
                  </>
                ) : (
                  <div className="photo-preview">

                    <img
                      src={photo}
                      alt="Complaint"
                    />

                    <label className="upload-btn">

                      Change Photo

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        hidden
                      />

                    </label>

                  </div>
                )}

              </div>

            </div>


            {/* Location */}
            <div className="form-group">

              <label>Location</label>

              <div className="location-input">

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter issue location"
                />

                <button
                  type="button"
                  className="location-btn"
                  onClick={getLocation}
                >
                  📍 Get Location
                </button>

              </div>

            </div>


            {/* Submit */}
            <button
              type="submit"
              className="submit-complaint-btn"
            >
              Submit Complaint
            </button>

          </form>

        </div>

      </main>

    </div>
  );
}

export default ReportComplaint;