import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./register.css"; 
import API from "../api/API";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const [validated, setValidated] = useState(false);
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

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPassword = (password) => password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    const { name, email, password, role } = formData;

    if (!name || !isValidEmail(email) || !isValidPassword(password) || !role) {
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/register", formData);
      const {token , user} = res.data;
      login(token , user);

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again with valid.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card mt-4 mb-4">
        <div className="register-header mb-4 text-center">
            <i className="fa-solid fa-bug fa-2x mb-2" style={{  color: "#f44336" }}></i>
          <h1>Create Account</h1>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit}
          className={`register-form ${validated ? "was-validated" : ""}`}
        >
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              className={`form-control ${validated && !formData.name ? "is-invalid" : ""}`}
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">Name is required.</div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              className={`form-control ${validated && !isValidEmail(formData.email) ? "is-invalid" : ""}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">Please enter a valid email.</div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className={`form-control ${validated && !isValidPassword(formData.password) ? "is-invalid" : ""}`}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">Password must be at least 6 characters.</div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              className={`form-select ${validated && !formData.role ? "is-invalid" : ""}`}
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select appropriate role</option>
              <option value="developer">Developer</option>
              <option value="admin">Admin</option>
            </select>
            <div className="invalid-feedback">Please select a role.</div>
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="register-footer">
          <p>
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
