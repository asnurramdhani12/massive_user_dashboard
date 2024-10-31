import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<{
    username: string;
    email: string;
    password: string;
  }>({
    username: "",
    email: "",
    password: "",
  });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:3000/api/v1/admin/user",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch users.");
        }

        const data = await response.json();
        setUsers(data.data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleAddUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://127.0.0.1:3000/api/v1/admin/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser), // Ensure newUser has correct values
      });

      if (response.ok) {
        const addedUser = await response.json();
        setUsers([...users, addedUser.data]);
        setNewUser({ username: "", email: "", password: "" }); // Reset to empty after successful addition
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add user.");
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await fetch(
      `http://127.0.0.1:3000/api/v1/admin/user/${userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      setUsers(users.filter((user) => user.id !== userId));
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Failed to delete user.");
    }
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setNewUser({ username: user.username, email: user.email, password: "" }); // Pre-fill the form
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const updatedUser = { ...editUser, ...newUser };
    const body = {
      username: updatedUser.username,
      email: updatedUser.email,
      ...(newUser.password && { password: newUser.password }), // Only include password if provided
    };

    const response = await fetch(
      `http://127.0.0.1:3000/api/v1/admin/user/${editUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const updatedData = await response.json();
      setUsers(
        users.map((user) =>
          user.id === updatedData.data.id ? updatedData.data : user
        )
      );
      setNewUser({ username: "", email: "", password: "" });
      setEditUser(null); // Clear edit mode
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Failed to update user.");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </header>
      <div style={styles.content}>
        <aside style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Menu</h2>
          <ul style={styles.menuList}>
            <li style={styles.menuItem}>Profile</li>
            <li style={styles.menuItem}>Settings</li>
            <li style={styles.menuItem}>Notifications</li>
            <li style={styles.menuItem}>Help</li>
          </ul>
        </aside>
        <main style={styles.main}>
          <h2 style={styles.sectionTitle}>User Management</h2>
          {error && <p style={styles.error}>{error}</p>}
          <div style={styles.formContainer}>
            <input
              type="text"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              placeholder="Name"
              style={styles.input}
            />
            <input
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              placeholder="Email"
              style={styles.input}
            />
            <input
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              placeholder="Password (optional)"
              style={styles.input}
            />
            <button
              onClick={editUser ? handleUpdateUser : handleAddUser}
              style={styles.button}
            >
              {editUser ? "Update User" : "Add User"}
            </button>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>ID</th>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Email</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={styles.tableCell}>{user.id}</td>
                  <td style={styles.tableCell}>{user.username}</td>
                  <td style={styles.tableCell}>{user.email}</td>
                  <td style={styles.tableCell}>
                    <button
                      onClick={() => handleEditUser(user)}
                      style={styles.actionButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={styles.actionButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#007bff",
    color: "#fff",
  },
  title: {
    margin: 0,
  },
  logoutButton: {
    padding: "10px 15px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  content: {
    display: "flex",
    flex: 1,
  },
  sidebar: {
    width: "200px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRight: "1px solid #ccc",
  },
  sidebarTitle: {
    marginTop: 0,
  },
  menuList: {
    listStyleType: "none",
    padding: 0,
  },
  menuItem: {
    padding: "10px 0",
    cursor: "pointer",
    color: "#007bff",
  },
  main: {
    flex: 1,
    padding: "20px",
  },
  sectionTitle: {
    margin: "0 0 10px 0",
  },
  formContainer: {
    marginBottom: "20px",
  },
  input: {
    marginRight: "10px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  actionButton: {
    marginRight: "5px",
    padding: "5px 10px",
    backgroundColor: "#17a2b8",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#f1f1f1",
  },
  tableCell: {
    padding: "10px",
    border: "1px solid #ddd",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default Dashboard;
