import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import UserDetailsModal from "../components/UserDetailsModal";
import { getUsers, deleteUser } from "../services/userApi";



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
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [sortBy, setSortBy] = useState('Newest');

    // Fetch users from API
    const fetchUsers = async (page = 1, searchTerm = '', sort = 'Newest', showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            }
            setError(null);
            
            const response = await getUsers({
                page,
                limit: 10,
                search: searchTerm,
                sortBy: sort
            });
            
            if (response.success) {
                setUsers(response.data);
                setTotalPages(response.pagination.totalPages);
                setTotalUsers(response.pagination.total);
                setCurrentPage(response.pagination.page);
            } else {
                setError('Failed to fetch users');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    };

    // Load users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers(1, search, sortBy, false); // Don't show loading for search
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search, sortBy]);

    const handleDeleteClick = (userId) => {
        setDeleteUserId(userId);
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
        setDeleteUserId(null);
    };

    const handleConfirmDelete = async () => {
        try {
            setDeletingUserId(deleteUserId);
            setShowModal(false);
            
            const response = await deleteUser(deleteUserId);
            
            if (response.success) {
                setShowSuccessModal(true);
                // Refresh the current page after deletion
                fetchUsers(currentPage, search, sortBy, false);
            } else {
                setError(response.message || 'Failed to delete user');
            }
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Failed to delete user. Please try again.');
        } finally {
            setDeletingUserId(null);
            setDeleteUserId(null);
        }
    };

    const handleViewClick = (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const handleCloseUserModal = () => {
        setShowUserModal(false);
        setSelectedUser(null);
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const handlePageChange = (newPage) => {
        fetchUsers(newPage, search, sortBy, false); // Don't show loading for pagination
    };

    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy);
    };

    // Only show loading state on initial load
    if (initialLoad && loading) {
        return (
            <div style={containerStyle}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <div style={{ fontSize: '18px', color: '#666' }}>Loading users...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={containerStyle}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <div style={{ fontSize: '18px', color: '#e53935' }}>{error}</div>
                    <button 
                        onClick={() => fetchUsers()}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            background: '#b7e3bc',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Empty state when no users found
    if (!loading && users.length === 0) {
        return (
            <div style={containerStyle}>
                <div style={headerRowStyle}>
                    <h3 style={{ color: "green", margin: 0 }}>Users</h3>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <select 
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                border: '1.5px solid #b7e3bc',
                                borderRadius: '6px',
                                background: '#fff',
                                fontSize: '14px'
                            }}
                        >
                            <option value="Newest">Newest</option>
                            <option value="Oldest">Oldest</option>
                            <option value="A-Z">A-Z</option>
                            <option value="Z-A">Z-A</option>
                        </select>
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
                </div>
                <hr />
                
                {/* Animated Empty State */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '80px 20px',
                    textAlign: 'center',
                    minHeight: '400px'
                }}>
                    {/* Animated Icon */}
                    <div style={{
                        fontSize: '120px',
                        marginBottom: '24px',
                        animation: 'bounce 2s infinite',
                        color: '#b7e3bc'
                    }}>
                        👥
                    </div>
                    
                    {/* Main Message */}
                    <h2 style={{
                        fontSize: '28px',
                        color: '#333',
                        marginBottom: '12px',
                        fontWeight: '600'
                    }}>
                        {search ? 'No users found' : 'No users yet'}
                    </h2>
                    
                    {/* Sub Message */}
                    <p style={{
                        fontSize: '16px',
                        color: '#666',
                        marginBottom: '32px',
                        maxWidth: '400px',
                        lineHeight: '1.5'
                    }}>
                        {search 
                            ? `No users match your search "${search}". Try adjusting your search terms.`
                            : 'There are currently no users in the system. Users will appear here once they register.'
                        }
                    </p>
                    
                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                style={{
                                    padding: '12px 24px',
                                    background: '#b7e3bc',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#333',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 2px 8px rgba(183, 227, 188, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(183, 227, 188, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 2px 8px rgba(183, 227, 188, 0.3)';
                                }}
                            >
                                Clear Search
                            </button>
                        )}
                        
                        <button
                            onClick={() => fetchUsers()}
                            style={{
                                padding: '12px 24px',
                                background: '#6AB320',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(106, 179, 32, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(106, 179, 32, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(106, 179, 32, 0.3)';
                            }}
                        >
                            Refresh
                        </button>
                    </div>
                </div>
                
                {/* CSS Animation */}
                <style>
                    {`
                        @keyframes bounce {
                            0%, 20%, 50%, 80%, 100% {
                                transform: translateY(0);
                            }
                            40% {
                                transform: translateY(-10px);
                            }
                            60% {
                                transform: translateY(-5px);
                            }
                        }
                        
                        @keyframes fadeIn {
                            from {
                                opacity: 0;
                                transform: translateY(20px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                        
                        .empty-state {
                            animation: fadeIn 0.6s ease-out;
                        }
                    `}
                </style>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={headerRowStyle}>
                <h3 style={{ color: "green", margin: 0 }}>Users ({totalUsers})</h3>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <select 
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            border: '1.5px solid #b7e3bc',
                            borderRadius: '6px',
                            background: '#fff',
                            fontSize: '14px'
                        }}
                    >
                        <option value="Newest">Newest</option>
                        <option value="Oldest">Oldest</option>
                        <option value="A-Z">A-Z</option>
                        <option value="Z-A">Z-A</option>
                    </select>
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
            </div>
            <hr />
            
            {/* Show subtle loading indicator only for search/sort changes */}
            {loading && !initialLoad && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '10px',
                    fontSize: '14px', 
                    color: '#666',
                    background: '#f9f9f9',
                    borderRadius: '4px',
                    margin: '10px 0'
                }}>
                    Updating...
                </div>
            )}
            
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
                    {users.map((user, index) => {
                        // Calculate the row number based on current page and items per page
                        const rowNumber = (currentPage - 1) * 10 + index + 1;
                        
                        return (
                            <tr key={user.id}>
                                <td style={tdStyle}>{rowNumber}</td>
                                <td style={tdStyle}>{user.name}</td>
                                <td style={tdStyle}>{user.email}</td>
                                <td style={tdStyle}>{user.phone}</td>
                                <td style={tdStyle}>
                                    <div style={actionStyle}>
                                        <button style={viewButtonStyle} onClick={() => handleViewClick(user)}>View</button>
                                        <button
                                            style={{
                                                ...deleteIconStyle,
                                                opacity: deletingUserId === user.id ? 0.6 : 1,
                                                cursor: deletingUserId === user.id ? 'not-allowed' : 'pointer'
                                            }}
                                            title="Delete"
                                            onClick={() => handleDeleteClick(user.id)}
                                            disabled={deletingUserId === user.id}
                                        >
                                            {deletingUserId === user.id ? '⏳' : '🗑️'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            
            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '20px',
                    padding: '10px'
                }}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #b7e3bc',
                            background: currentPage === 1 ? '#f0f0f0' : '#fff',
                            borderRadius: '4px',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            color: currentPage === 1 ? '#999' : '#333'
                        }}
                    >
                        Previous
                    </button>
                    
                    <span style={{ fontSize: '14px', color: '#666' }}>
                        Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #b7e3bc',
                            background: currentPage === totalPages ? '#f0f0f0' : '#fff',
                            borderRadius: '4px',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            color: currentPage === totalPages ? '#999' : '#333'
                        }}
                    >
                        Next
                    </button>
                </div>
            )}
            
            {/* Modal Popup for Delete Confirmation */}
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

            {/* Success Modal */}
            {showSuccessModal && (
                <div style={modalOverlayStyle}>
                    <div style={{
                        ...modalContentStyle,
                        background: "white",
                        padding: "32px 24px",
                        minWidth: "320px",
                        textAlign: "center"
                    }}>
                        <div style={{
                            fontSize: "48px",
                            marginBottom: "16px",
                            color: "#4caf50"
                        }}>
                            ✅
                        </div>
                        <h4 style={{ marginBottom: "16px", color: "#4caf50" }}>Success!</h4>
                        <p style={{ marginBottom: "24px", color: "#666" }}>User deleted successfully.</p>
                        <div style={modalButtonGroupStyle}>
                            <button
                                onClick={handleCloseSuccessModal}
                                style={{
                                    padding: "8px 20px",
                                    border: "none",
                                    borderRadius: "4px",
                                    background: "#4caf50",
                                    color: "white",
                                    cursor: "pointer"
                                }}
                            >
                                OK
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