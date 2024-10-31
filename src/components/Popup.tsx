// Popup.tsx
import React from "react";

interface PopupProps {
  message: string;
  onClose: () => void;
  isOpen: boolean;
}

const Popup: React.FC<PopupProps> = ({ message, onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2 style={styles.header}>Success!</h2>
        <p style={styles.message}>{message}</p>
        <button style={styles.button} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    width: "400px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  header: {
    marginBottom: "10px",
  },
  message: {
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default Popup;
