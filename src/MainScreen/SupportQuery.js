import React, { useState, useEffect } from "react";
import { getSupportRequests, updateSupportRequestStatus } from "../services/support";

const initialQueries = [
    // { id: 1, user: "Alice Smith", contact: "alice@example.com", reason: "Unable to login", status: "Pending" },
    // { id: 2, user: "Bob Johnson", contact: "bob@example.com", reason: "Payment not processed", status: "Resolved" },
    // { id: 3, user: "Charlie Lee", contact: "charlie@example.com", reason: "App crashes on start", status: "Rejected" },
    // { id: 4, user: "Diana Prince", contact: "diana@example.com", reason: "Feature request: Dark mode", status: "Pending" },
    // { id: 5, user: "Evan Wright", contact: "evan@example.com", reason: "Incorrect profile info", status: "Pending" },
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
    pending: { background: "#fffbe6", color: "#bfa100", border: "#ffe58f" },
    in_progress: { background: "#e6f7ff", color: "#1890ff", border: "#91d5ff" },
    resolved: { background: "#e6ffed", color: "#389e0d", border: "#b7e3bc" },
    rejected: { background: "#fff1f0", color: "#cf1322", border: "#f5524d" },
    closed: { background: "#f5f5f5", color: "#666", border: "#d9d9d9" },
};

const SupportQuery = () => {
    const [queries, setQueries] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        fetchSupportRequests();
    }, [pagination.page, statusFilter]);

    const fetchSupportRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                status: statusFilter || undefined
            };
            
            const response = await getSupportRequests(params);
            
            if (response.success) {
                setQueries(response.data);
                setPagination(prev => ({
                    ...prev,
                    total: response.pagination.total,
                    totalPages: response.pagination.totalPages
                }));
            } else {
                setError('Failed to fetch support requests');
            }
        } catch (err) {
            console.error('SupportQuery Error:', err);
            setError(err.message || 'Failed to fetch support requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            // Show loading state for the specific row
            setQueries((prev) =>
                prev.map((q) =>
                    q.id === id ? { ...q, status: newStatus, updating: true } : q
                )
            );
            
            // Call the API to update status
            const response = await updateSupportRequestStatus(id, newStatus);
            
            if (response.success) {
                // Update the local state with the response data
                setQueries((prev) =>
                    prev.map((q) =>
                        q.id === id ? { 
                            ...response.data, 
                            updating: false 
                        } : q
                    )
                );
                
                // Show success message (optional)
                console.log('Status updated successfully');
            } else {
                // Revert the change if API call failed
                setQueries((prev) =>
                    prev.map((q) =>
                        q.id === id ? { ...q, status: q.status, updating: false } : q
                    )
                );
                console.error('Failed to update status:', response.message);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            
            // Revert the change on error
            setQueries((prev) =>
                prev.map((q) =>
                    q.id === id ? { ...q, status: q.status, updating: false } : q
                )
            );
            
            // You could show an error message to the user here
            alert(`Failed to update status: ${error.message}`);
        }
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleStatusFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    };

    // Filter queries by user, contact, or reason
    const filteredQueries = queries.filter((q) => {
        const s = search.toLowerCase();
        return (
            (q.email && q.email.toLowerCase().includes(s)) ||
            (q.subject && q.subject.toLowerCase().includes(s)) ||
            (q.message && q.message.toLowerCase().includes(s)) ||
            (q.issueType && q.issueType.toLowerCase().includes(s))
        );
    });

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={headerRowStyle}>
                    <h3 style={{ color: "green", margin: 0 }}>Support Queries</h3>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                    fontSize: '18px',
                    color: '#666'
                }}>
                    Loading support requests...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={containerStyle}>
                <div style={headerRowStyle}>
                    <h3 style={{ color: "green", margin: 0 }}>Support Queries</h3>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    borderRadius: 12,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    margin: '40px 0',
                }}>
                    <h2 style={{ fontSize: '28px', color: '#cf1322', marginBottom: '12px', fontWeight: '600' }}>Error</h2>
                    <p style={{ color: '#666', fontSize: 17, marginBottom: 16, textAlign: 'center', maxWidth: 400 }}>
                        {error}
                    </p>
                    
                    {/* Debug Information */}
                    <div style={{
                        background: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '6px',
                        padding: '12px',
                        marginBottom: '20px',
                        maxWidth: '400px',
                        fontSize: '12px',
                        color: '#666',
                        textAlign: 'left'
                    }}>
                        <strong>Debug Info:</strong><br />
                        URL: https://greensip.hrgroupsolution.com/admin/support-requests<br />
                        Method: GET<br />
                        Status: 500 Internal Server Error<br />
                        <br />
                        <strong>Possible Issues:</strong><br />
                        • Check if the server is running<br />
                        • Verify the API endpoint exists<br />
                        • Check server logs for detailed error<br />
                        • Ensure authentication token is valid
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            style={{
                                background: '#4caf50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                padding: '12px 24px',
                                fontSize: 15,
                                fontWeight: 600,
                                boxShadow: '0 1px 2px rgba(0,0,0,0.07)',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                            onClick={fetchSupportRequests}
                        >
                            Retry
                        </button>
                        
                        <button
                            style={{
                                background: '#6c757d',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                padding: '12px 24px',
                                fontSize: 15,
                                fontWeight: 600,
                                boxShadow: '0 1px 2px rgba(0,0,0,0.07)',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                            onClick={() => {
                                console.log('Current token:', localStorage.getItem('token'));
                                console.log('Current pagination:', pagination);
                                console.log('Current status filter:', statusFilter);
                            }}
                        >
                            Debug
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={headerRowStyle}>
                <h3 style={{ color: "green", margin: 0 }}>Support Queries</h3>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <select
                        value={statusFilter}
                        onChange={e => handleStatusFilterChange(e.target.value)}
                        style={statusDropdownStyle}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <div style={searchBarWrapperStyle}>
                        <span style={searchIconStyle}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search by email, subject, or message..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={searchInputStyle}
                        />
                    </div>
                </div>
            </div>
            <hr />
            {filteredQueries.length === 0 ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80vh',
                    borderRadius: 12,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    margin: '40px 0',
                }}>
                    <img src={require('../assets/image/help_support.svg').default} alt="No queries" style={{ width: 120, marginBottom: 24, opacity: 1 }} className="bounce" />
                    <h2 style={{ fontSize: '28px',color: '#333',marginBottom: '12px',fontWeight: '600' }}>No support queries found</h2>
                    <p style={{ color: '#666', fontSize: 17, marginBottom: 28, textAlign: 'center', maxWidth: 400 }}>
                        {search || statusFilter ? 'No queries match your current filters.' : 'There are currently no support queries in the system.'}
                    </p>
                    <button
                        style={{
                            background: '#4caf50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '12px 36px',
                            fontSize: 17,
                            fontWeight: 600,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.07)',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                        }}
                        onClick={() => { setSearch(''); setStatusFilter(''); }}
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Email</th>
                                <th style={thStyle}>Issue Type</th>
                                <th style={thStyle}>Subject</th>
                                <th style={thStyle}>Message</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQueries.map((q) => (
                                <tr key={q.id}>
                                    <td style={tdStyle}>{q.email}</td>
                                    <td style={tdStyle}>{q.issueType}</td>
                                    <td style={tdStyle}>{q.subject}</td>
                                    <td style={tdStyle}>
                                        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {q.message}
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <select
                                            value={q.status}
                                            onChange={e => handleStatusChange(q.id, e.target.value)}
                                            disabled={q.updating}
                                            style={{
                                                ...statusDropdownStyle,
                                                background: statusColors[q.status]?.background || statusColors.pending.background,
                                                color: statusColors[q.status]?.color || statusColors.pending.color,
                                                borderColor: statusColors[q.status]?.border || statusColors.pending.border,
                                                opacity: q.updating ? 0.6 : 1,
                                                cursor: q.updating ? 'not-allowed' : 'pointer',
                                            }}
                                            onFocus={e => e.target.style.boxShadow = '0 0 0 2px #b7e3bc'}
                                            onBlur={e => e.target.style.boxShadow = statusDropdownStyle.boxShadow}
                                        >
                                            {q.updating && <option value="">Updating...</option>}
                                            <option value="pending">Pending</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        {q.updating && (
                                            <div style={{
                                                fontSize: '12px',
                                                color: '#666',
                                                marginTop: '4px',
                                                fontStyle: 'italic'
                                            }}>
                                                Updating...
                                            </div>
                                        )}
                                    </td>
                                    <td style={tdStyle}>
                                        {new Date(q.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                            marginTop: '20px',
                            padding: '16px'
                        }}>
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #b7e3bc',
                                    borderRadius: '6px',
                                    background: pagination.page <= 1 ? '#f5f5f5' : '#fff',
                                    color: pagination.page <= 1 ? '#ccc' : '#333',
                                    cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Previous
                            </button>
                            
                            <span style={{ fontSize: '14px', color: '#666' }}>
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages}
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #b7e3bc',
                                    borderRadius: '6px',
                                    background: pagination.page >= pagination.totalPages ? '#f5f5f5' : '#fff',
                                    color: pagination.page >= pagination.totalPages ? '#ccc' : '#333',
                                    cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SupportQuery;