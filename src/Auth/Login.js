import React, { useState } from "react";
import logo from "./logo.svg";
import { useNavigate } from "react-router-dom";
import { login } from "../services/Auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      localStorage.setItem('token', res.token);
      navigate("/dashboard");
    } else {
      setError(res.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.login}>
        <img src={logo} alt="Logo" style={styles.logo}/>
        <div style={styles.input}>
          <h1 style={styles.label}>Enter Email Address</h1>
          <div style={styles.inputWrapper}>
            <span style={styles.inputIcon}>📧</span>
            <input
              type="email"
              placeholder="Enter Email Address"
              style={styles.inputField}
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <h1 style={styles.label}>Enter Password</h1>
          <div style={styles.inputWrapper}>
            <span style={styles.inputIcon}>🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              style={styles.inputField}
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.1rem",
                color: "#64748b",
                marginLeft: 4,
                outline: "none"
              }}
              tabIndex={-1}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          <button onClick={handleLogin} style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  login: {
    width: "470px",
    height:"470px",
    margin: "auto",
    padding: "48px 32px 32px 32px",
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1.5px solid #e5e7eb",
    zIndex: 1
  },
  logo: {
    width: "180px",
    marginBottom: "28px",
    borderRadius: "50%",
  },
  input: {
    width: "100%",
    marginBottom: "18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  label: {
    fontSize: "1.08rem",
    margin: "10px 0 6px 0",
    color: "#22223b",
    fontWeight: 600,
    alignSelf: "flex-start"
  },
  inputWrapper: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    background: "#f3f4f6",
    borderRadius: "7px",
    border: "1px solid #e5e7eb",
    marginBottom: "14px",
    padding: "0 10px"
  },
  inputIcon: {
    fontSize: "1.1rem",
    color: "#64748b",
    marginRight: "8px"
  },
  inputField: {
    flex: 1,
    padding: "11px 8px",
    border: "none",
    borderRadius: "7px",
    fontSize: "1rem",
    outline: "none",
    background: "transparent",
    transition: "box-shadow 0.2s, border 0.2s"
  },
  button: {
    width: "100%",
    padding: "13px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    fontSize: "1.13rem",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "8px",
    marginBottom: "8px",
    boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
    transition: "background 0.2s, transform 0.2s"
  },

  
};

export default Login;

