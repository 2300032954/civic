import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  // 1. Create state to hold the form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // 🛑 STOPS the page from refreshing
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match!");
    }

    setLoading(true);

    try {
      // 🚨 IMPORTANT: Check your routes/auth.py to see if it is /signup or /auth/signup
      const response = await fetch("https://civic-iwnn.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create account");
      }

      // Success! Redirect to login page
      alert("Account created successfully! Please log in.");
      navigate("/login");

    } catch (err) {
      setError(err.message || "Something went wrong. Is the backend awake?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🏛️ CivicConnect</div>
        <h1>Create Account</h1>
        <p className="auth-subtitle">
          Join CivicConnect and help improve your community
        </p>

        {/* Show error message if there is one */}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating Account... (Please wait)" : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <Link to="/" className="back-home">← Back to Home</Link>
      </div>
    </div>
  );
}

export default Signup;