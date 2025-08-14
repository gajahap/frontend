import React, { useState, useContext, useEffect } from "react";
import { Container, Card, Form, Spinner } from "react-bootstrap";
import { UserContext } from "../../../context/UserContext";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import "./Login.css";
import logo from "../../../assets/image/gap.png";
import { Toaster, toast } from "react-hot-toast";

const Login = () => {
  useEffect(() => {
    document.title = "Login | Marketing GAP App";
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    force_login: true,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(UserContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      setIsLoading(true);
      await login(formData);

      toast.success("✅ Login berhasil!", {
        duration: 2000,
        style: {
          background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        },
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.errors || {});
        toast.error(error.response.data.message || "Terjadi kesalahan.", {
          style: {
            background: "linear-gradient(135deg, #E53935, #B71C1C)",
            color: "#fff",
            borderRadius: "12px",
            fontWeight: "bold",
          },
        });
      } else {
        toast.error("Tidak dapat menghubungi server.", {
          style: {
            background: "linear-gradient(135deg, #E53935, #B71C1C)",
            color: "#fff",
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-bg">
      {/* 🔔 Toaster untuk semua popup */}
      <Toaster position="top-center" reverseOrder={false} />

      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="login-form border-0 shadow-lg p-4 text-center">
          <img
            src={logo}
            alt="Logo"
            className="login-logo animate-logo mx-auto d-block mb-3"
          />
          <h2 className="fw-bold mb-3 login-title">Login Marketing App</h2>
          <p className="text-muted mb-4">
            Silakan masukkan Username dan Password
          </p>

          <Form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="form-group mb-3 input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className={`form-control ${
                  errors.username ? "input-error" : ""
                }`}
                required
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username[0]}</div>
              )}
            </div>

            {/* Password */}
            <div className="form-group mb-3 input-with-icon">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`form-control ${
                  errors.password ? "input-error" : ""
                }`}
                autoComplete="off"
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
              {errors.password && (
                <div className="invalid-feedback">{errors.password[0]}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-login w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <FaSignInAlt className="me-2" />
                  Login
                </>
              )}
            </button>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
