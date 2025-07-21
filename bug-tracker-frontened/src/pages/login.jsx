import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", formData);
      const { token, user } = res.data;

      login(token, user);

      setSuccess("Login successful! Redirecting...");
      setError("");

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container container-fluid d-flex justify-content-center align-items-center">
      <div className="login-box card shadow-sm p-4">
        <div className="login-header mb-4 text-center">
          <i className="fa-solid fa-bug fa-2x mb-2" style={{ color: "#f44336" }}></i>
          <h1 className="fw-bold">Sign in</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group mb-3">
            <label htmlFor="email">Email Address</label>
            <input
              placeholder="john@email"
              type="email"
              className="form-control loginInp"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
            placeholder="Enter the password"
              type="password"
              className="form-control loginInp"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading} className="btn login-button mb-3">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {error && <div className="error-message alert alert-danger">{error}</div>}
        {success && <div className="success-message alert alert-success">{success}</div>}

        <div className="login-footer mt-4 text-center">
          <p>
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
