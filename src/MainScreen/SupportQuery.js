import React, { useState } from "react";

const initialQueries = [
    { id: 1, user: "Alice Smith", contact: "alice@example.com", reason: "Unable to login", status: "Pending" },
    { id: 2, user: "Bob Johnson", contact: "bob@example.com", reason: "Payment not processed", status: "Resolved" },
    { id: 3, user: "Charlie Lee", contact: "charlie@example.com", reason: "App crashes on start", status: "Rejected" },
    { id: 4, user: "Diana Prince", contact: "diana@example.com", reason: "Feature request: Dark mode", status: "Pending" },
    { id: 5, user: "Evan Wright", contact: "evan@example.com", reason: "Incorrect profile info", status: "Pending" },
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

const containerStyle = {
    padding: "16px",
    background: "#f3fbf3",
    minHeight: "100vh",
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
    padding: "8px 16px 8px 38px",
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

const statusDropdownStyle = {
    padding: "8px 18px 8px 12px",
    borderRadius: "6px",
    border: "1.5px solid #b7e3bc",
    fontSize: "15px",
    background: "#f8fff8",
    color: "#222",
    boxShadow: "0 2px 6px rgba(183,227,188,0.15)",
    transition: "border 0.2s, box-shadow 0.2s",
    outline: "none",
    cursor: "pointer",
};

const statusColors = {
    Pending: { background: "#fffbe6", color: "#bfa100", border: "#ffe58f" },
    Resolved: { background: "#e6ffed", color: "#389e0d", border: "#b7e3bc" },
    Rejected: { background: "#fff1f0", color: "#cf1322", border: "#f5524d" },
};

const SupportQuery = () => {
    const [queries, setQueries] = useState(initialQueries);
    const [search, setSearch] = useState("");

    const handleStatusChange = (id, newStatus) => {
        setQueries((prev) =>
            prev.map((q) =>
                q.id === id ? { ...q, status: newStatus } : q
            )
        );
    };

    // Filter queries by user, contact, or reason
    const filteredQueries = queries.filter((q) => {
        const s = search.toLowerCase();
        return (
            q.user.toLowerCase().includes(s) ||
            q.contact.toLowerCase().includes(s) ||
            q.reason.toLowerCase().includes(s)
        );
    });

    return (
        <div style={containerStyle}>
            <div style={headerRowStyle}>
                <h3 style={{ color: "green", margin: 0 }}>Support Queries</h3>
                <div style={searchBarWrapperStyle}>
                    <span style={searchIconStyle}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by user, contact, or reason..."
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
                        <th style={thStyle}>User</th>
                        <th style={thStyle}>Contact</th>
                        <th style={thStyle}>Reason</th>
                        <th style={thStyle}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredQueries.map((q) => (
                        <tr key={q.id}>
                            <td style={tdStyle}>{q.user}</td>
                            <td style={tdStyle}>{q.contact}</td>
                            <td style={tdStyle}>{q.reason}</td>
                            <td style={tdStyle}>
                                <select
                                    value={q.status}
                                    onChange={e => handleStatusChange(q.id, e.target.value)}
                                    style={{
                                        ...statusDropdownStyle,
                                        background: statusColors[q.status].background,
                                        color: statusColors[q.status].color,
                                        borderColor: statusColors[q.status].border,
                                    }}
                                    onFocus={e => e.target.style.boxShadow = '0 0 0 2px #b7e3bc'}
                                    onBlur={e => e.target.style.boxShadow = statusDropdownStyle.boxShadow}
                                >
                                    <option value="Pending" style={{ background: statusColors.Pending.background, color: statusColors.Pending.color }}>
                                        Pending
                                    </option>
                                    <option value="Resolved" style={{ background: statusColors.Resolved.background, color: statusColors.Resolved.color }}>
                                        Resolved
                                    </option>
                                    <option value="Rejected" style={{ background: statusColors.Rejected.background, color: statusColors.Rejected.color }}>
                                        Rejected
                                    </option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SupportQuery;