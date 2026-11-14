import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if someone is logged in when the page loads
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  // Smart logic for "Report an Issue"
  const handleReportClick = () => {
    if (!user) {
      navigate("/login"); // Not logged in -> go to login
    } else if (user.role === "admin") {
      alert("Admins cannot report issues. Please use a Citizen account for that.");
      navigate("/admin"); // Admin -> go to admin dashboard
    } else {
      navigate("/report"); // Citizen -> go to report form
    }
  };

  // Smart logic for "Explore Data"
  const handleExploreClick = () => {
    if (!user) {
      navigate("/login"); 
    } else if (user.role === "admin") {
      navigate("/admin"); // Admin -> go to admin dashboard
    } else {
      navigate("/analytics"); // Citizen -> go to public data
    }
  };

  return (
    <div className="home-page">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          🏛️ CivicConnect
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          
          {/* Show Dashboard if logged in, otherwise show Login/Signup */}
          {user ? (
            <Link to={user.role === "admin" ? "/admin" : "/dashboard"} style={{ fontWeight: "bold", color: "#1d4ed8" }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">
          <h1>
            Making Communities
            <span> More Accountable</span>
          </h1>

          <p>
            Report civic issues, track complaints, and explore
            public data through one transparent platform.
          </p>

          <div className="hero-buttons">
            {/* Change button text based on role */}
            {user?.role === "admin" ? (
              <button className="primary-btn" onClick={() => navigate("/admin")}>
                Go to Admin Dashboard
              </button>
            ) : (
              <button className="primary-btn" onClick={handleReportClick}>
                Report an Issue
              </button>
            )}

            <button className="secondary-btn" onClick={handleExploreClick}>
              Explore Data
            </button>
          </div>
        </div>

      </section>

      {/* Features */}
      <section className="features">

        <h2>What You Can Do</h2>

        <div className="feature-container">

          <div className="feature-card">
            <div className="icon">📝</div>
            <h3>Report Issues</h3>
            <p>
              Report potholes, garbage, streetlights and
              other civic problems.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">📍</div>
            <h3>Track Complaints</h3>
            <p>
              Track the status of your complaints from
              submission to resolution.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">📊</div>
            <h3>Explore Public Data</h3>
            <p>
              Analyze public datasets through interactive
              dashboards and visualizations.
            </p>
          </div>

        </div>

      </section>

      {/* How it works */}
      <section className="how-it-works">

        <h2>How It Works</h2>

        <div className="steps">

          <div className="step">
            <span>1</span>
            <h3>Report</h3>
            <p>Submit a civic complaint with details and photos.</p>
          </div>

          <div className="step">
            <span>2</span>
            <h3>Review</h3>
            <p>Authorities review and process the complaint.</p>
          </div>

          <div className="step">
            <span>3</span>
            <h3>Resolve</h3>
            <p>Track the issue until it is resolved.</p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;