// Register.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed.");
      }

      const data = await response.json();
      setPopupMessage(data.message);
      setShowPopup(true); // Show the popup on successful registration
      setTimeout(() => {
        setShowPopup(false);
        navigate("/"); // Navigate to the home page after a delay
      }, 3000);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.inputContainer}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={handleNameChange}
            style={styles.input}
            placeholder="Enter your username"
          />
        </div>
        <div style={styles.inputContainer}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            style={styles.input}
            placeholder="Enter your email"
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
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <Popup
        message={popupMessage}
        onClose={() => setShowPopup(false)}
        isOpen={showPopup}
      />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "300px",
    margin: "100px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "center",
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
    backgroundColor: "#007bff",
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

export default Register;
