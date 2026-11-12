import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          🏛️ CivicConnect
        </div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to your CivicConnect account
        </p>

        <form>

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
          />

          <button type="submit" className="auth-btn">
            Login
          </button>

        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">Create Account</Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}

export default Login;