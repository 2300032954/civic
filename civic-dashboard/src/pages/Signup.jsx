import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          🏛️ CivicConnect
        </div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join CivicConnect and help improve your community
        </p>

        <form>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
          />

          <button type="submit" className="auth-btn">
            Create Account
          </button>

        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}

export default Signup;