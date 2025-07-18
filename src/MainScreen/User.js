import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import UserDetailsModal from "../components/UserDetailsModal";

const initialUsers = [
    { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com", contact: "9876543210", image: "https://randomuser.me/api/portraits/women/1.jpg", gender: "Female", address: "123 Maple St, Springfield" },
    { id: 2, name: "Bob Smith", email: "bob.smith@example.com", contact: "9123456780", image: "https://randomuser.me/api/portraits/men/2.jpg", gender: "Male", address: "456 Oak Ave, Riverdale" },
    { id: 3, name: "Charlie Brown", email: "charlie.brown@example.com", contact: "9988776655", image: "https://randomuser.me/api/portraits/men/3.jpg", gender: "Male", address: "789 Pine Rd, Centerville" },
    { id: 4, name: "Diana Prince", email: "diana.prince@example.com", contact: "9090909090", image: "https://randomuser.me/api/portraits/women/4.jpg", gender: "Female", address: "321 Elm St, Metropolis" },
    { id: 5, name: "Ethan Hunt", email: "ethan.hunt@example.com", contact: "9001122334", image: "https://randomuser.me/api/portraits/men/5.jpg", gender: "Male", address: "654 Cedar Ave, Gotham" },
    { id: 6, name: "Fiona Gallagher", email: "fiona.gallagher@example.com", contact: "9112233445", image: "https://randomuser.me/api/portraits/women/6.jpg", gender: "Female", address: "987 Birch Blvd, Star City" },
    { id: 7, name: "George Miller", email: "george.miller@example.com", contact: "9223344556", image: "https://randomuser.me/api/portraits/men/7.jpg", gender: "Male", address: "159 Spruce Dr, Smallville" },
    { id: 8, name: "Hannah Lee", email: "hannah.lee@example.com", contact: "9334455667", image: "https://randomuser.me/api/portraits/women/8.jpg", gender: "Female", address: "753 Willow Ln, Hill Valley" },
    { id: 9, name: "Ian Curtis", email: "ian.curtis@example.com", contact: "9445566778", image: "https://randomuser.me/api/portraits/men/9.jpg", gender: "Male", address: "852 Aspen Ct, River City" },
    { id: 10, name: "Julia Roberts", email: "julia.roberts@example.com", contact: "9556677889", image: "https://randomuser.me/api/portraits/women/10.jpg", gender: "Female", address: "951 Poplar St, Emerald City" },
];

const tableStyle = {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    marginTop: "16px",
    background: "#f3fbf3", 
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    borderRadius: "8px",
    overflow: "hidden",
};

const thStyle = {
    padding: "18px 8px",
    background: "#b7e3bc", 
    color: "#111",
    fontWeight: 700,
    fontSize: "18px",
    border: "none",
    textAlign: "center",
};

const tdStyle = {
    padding: "16px 8px",
    background: "#f3fbf3", 
    color: "#111",
    fontWeight: 400,
    fontSize: "16px",
    border: "none",
    borderBottom: "1px solid #b7e3bc", 
    textAlign: "center",
};

const actionStyle = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    justifyContent: "center",
};
const viewButtonStyle = {
    padding: "4px 18px",
    border: "none",
    borderRadius: "6px",
    background: "#e3f0ff", // light blue
    color: "#1976d2", // blue text
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "15px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
};
const deleteIconStyle = {
    cursor: "pointer",
    fontSize: "18px",
    color: "#e53935",
    background:"#f5524d", // white background
    border: "1.5px solid rgb(196, 23, 20)", // red border
    borderRadius: "4px",
    padding: "2px 6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const containerStyle = {
    padding: "16px",
    background: "#f3fbf3", // page background
    minHeight: "100vh",
};

const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
};

const modalContentStyle = {
    background: "white",
    padding: "32px 24px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    minWidth: "320px",
    textAlign: "center",
};

const modalButtonGroupStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
};

const modalCancelButtonStyle = {
    padding: "8px 20px",
    border: "none",
    borderRadius: "4px",
    background: "#ccc",
    color: "#333",
    cursor: "pointer",
};

const modalDeleteButtonStyle = {
    padding: "8px 20px",
    border: "none",
    borderRadius: "4px",
    background: "#e53935",
    color: "white",
    cursor: "pointer",
};

const headerRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
};

const searchBarWrapperStyle = {
    position: "relative",
    display: "inline-block",
    minWidth: "260px",
};

const searchInputStyle = {
    padding: "8px 16px 8px 38px", // left padding for icon
    border: "1.5px solid #b7e3bc",
    borderRadius: "6px",
    fontSize: "16px",
    outline: "none",
    background: "#fff",
    color: "#222",
    width: "100%",
    boxSizing: "border-box",
};

const searchIconStyle = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#b7e3bc",
    fontSize: "20px",
    pointerEvents: "none",
};

const User = () => {
    const [users, setUsers] = useState(initialUsers);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);

    const handleDeleteClick = (userId) => {
        setDeleteUserId(userId);
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
        setDeleteUserId(null);
    };

    const handleConfirmDelete = () => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deleteUserId));
        setShowModal(false);
        setDeleteUserId(null);
    };

    const handleViewClick = (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const handleCloseUserModal = () => {
        setShowUserModal(false);
        setSelectedUser(null);
    };

    // Filter users by search query (name, email, or contact)
    const filteredUsers = users.filter((user) => {
        const q = search.toLowerCase();
        return (
            user.name.toLowerCase().includes(q) ||
            user.email.toLowerCase().includes(q) ||
            user.contact.toLowerCase().includes(q)
        );
    });

    return (
        <div style={containerStyle}>
            <div style={headerRowStyle}>
                <h3 style={{ color: "green", margin: 0 }}>Users</h3>
                <div style={searchBarWrapperStyle}>
                <span style={searchIconStyle}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by name, email, or contact..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={searchInputStyle}
                    />
                </div>
            </div>
            <hr />
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Contact</th>
                        <th style={thStyle}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td style={tdStyle}>{user.id}</td>
                            <td style={tdStyle}>{user.name}</td>
                            <td style={tdStyle}>{user.email}</td>
                            <td style={tdStyle}>{user.contact}</td>
                            <td style={tdStyle}>
                                <div style={actionStyle}>
                                    <button style={viewButtonStyle} onClick={() => handleViewClick(user)}>View</button>
                                    <button
                                        style={deleteIconStyle}
                                        title="Delete"
                                        onClick={() => handleDeleteClick(user.id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Modal Popup for Delete */}
            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h4 style={{ marginBottom: "16px", color: "#e53935" }}>Confirm Deletion</h4>
                        <p style={{ marginBottom: "24px" }}>Are you sure you want to delete this user?</p>
                        <div style={modalButtonGroupStyle}>
                            <button
                                onClick={handleCancel}
                                style={modalCancelButtonStyle}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                style={modalDeleteButtonStyle}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal Popup for User Details */}
            <UserDetailsModal user={selectedUser} open={showUserModal} onClose={handleCloseUserModal} />
        </div>
    );
};

export default User;