// Login.tsx
import React, { useState, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to log in. Please check your credentials.");
      }

      const data = await response.json();
      console.log(data.data.access_token);
      if (data.data.access_token) {
        localStorage.setItem("token", data.data.access_token);
        navigate("/dashboard");
      } else {
        throw new Error("Token not provided.");
      }
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.inputContainer}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={handleEmailChange}
            style={styles.input}
            placeholder="Enter your username"
          />
        </div>
        <div style={styles.inputContainer}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            style={styles.input}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <div style={styles.registerContainer}>
          <p style={styles.registerText}>Don't have an account?</p>
          <button
            onClick={() => navigate("/register")} // Navigate to the register page
            style={styles.registerButton}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    width: "300px",
    margin: "100px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "center", // Explicitly type textAlign
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputContainer: {
    marginBottom: "15px",
  },
  input: {
    width: "90%",
    padding: "8px",
    marginTop: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default Login;
