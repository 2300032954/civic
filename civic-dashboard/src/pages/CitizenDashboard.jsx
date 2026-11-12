import { Link } from "react-router-dom";

function CitizenDashboard() {
  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          🏛️ CivicConnect
        </div>

        <nav>

          <Link to="/dashboard" className="active">
            🏠 Dashboard
          </Link>

          <Link to="/report">
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

        {/* Header */}
        <header className="dashboard-header">

          <div>
            <h1>Citizen Dashboard</h1>
            <p>
              Welcome back! Track your complaints and civic issues.
            </p>
          </div>

          <div className="user-profile">
            👤 Citizen
          </div>

        </header>


        {/* Statistics */}
        <section className="stats-container">

          <div className="stat-card">
            <span className="stat-icon">📝</span>
            <div>
              <p>Total Complaints</p>
              <h2>12</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">⏳</span>
            <div>
              <p>Pending</p>
              <h2>4</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🔄</span>
            <div>
              <p>In Progress</p>
              <h2>3</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div>
              <p>Resolved</p>
              <h2>5</h2>
            </div>
          </div>

        </section>


        {/* Quick Actions */}
        <section className="dashboard-section">

          <h2>Quick Actions</h2>

          <div className="quick-actions">

            <Link to="/report" className="action-card">
              <span>📝</span>
              <div>
                <h3>Report an Issue</h3>
                <p>Report a civic problem in your area.</p>
              </div>
            </Link>

            <Link to="/complaints" className="action-card">
              <span>📋</span>
              <div>
                <h3>View My Complaints</h3>
                <p>Track the status of your complaints.</p>
              </div>
            </Link>

          </div>

        </section>


        {/* Recent Complaints */}
        <section className="dashboard-section">

          <div className="section-header">

            <h2>Recent Complaints</h2>

            <Link to="/complaints">
              View All
            </Link>

          </div>


          <div className="complaint-table">

            <div className="table-header">
              <span>Complaint</span>
              <span>Category</span>
              <span>Date</span>
              <span>Status</span>
            </div>


            <div className="table-row">

              <span>
                Pothole near main road
              </span>

              <span>Road</span>

              <span>15 Sep 2026</span>

              <span className="status pending">
                Pending
              </span>

            </div>


            <div className="table-row">

              <span>
                Street light not working
              </span>

              <span>Electricity</span>

              <span>12 Sep 2026</span>

              <span className="status progress">
                In Progress
              </span>

            </div>


            <div className="table-row">

              <span>
                Garbage collection issue
              </span>

              <span>Sanitation</span>

              <span>08 Sep 2026</span>

              <span className="status resolved">
                Resolved
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default CitizenDashboard;