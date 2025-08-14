import React, { useState, useEffect } from "react";
import { createLocation, getAllLocations, deleteLocation } from "../services/locationApi";

const Location = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        fullAddress: '',
        coordinates: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLocationId, setDeleteLocationId] = useState(null);
    const [deletingLocationId, setDeletingLocationId] = useState(null);
    const [deletedLocationName, setDeletedLocationName] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Styles matching User.js template
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
        background: "#e3f0ff",
        color: "#1976d2",
        cursor: "pointer",
        fontWeight: 500,
        fontSize: "15px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    };

    const deleteIconStyle = {
        cursor: "pointer",
        fontSize: "18px",
        color: "#e53935",
        background: "#f5524d",
        border: "1.5px solid rgb(196, 23, 20)",
        borderRadius: "4px",
        padding: "2px 6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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

    const formCardStyle = {
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "20px",
        overflow: "hidden",
    };

    const formHeaderStyle = {
        background: "#b7e3bc",
        padding: "16px 20px",
        borderBottom: "1px solid #a0d8a0",
    };

    const formBodyStyle = {
        padding: "20px",
    };

    const formTitleStyle = {
        margin: 0,
        color: "#333",
        fontSize: "18px",
        fontWeight: "600",
    };

    const formRowStyle = {
        display: "flex",
        gap: "20px",
        marginBottom: "20px",
    };

    const formGroupStyle = {
        flex: "1",
    };

    const formLabelStyle = {
        display: "block",
        marginBottom: "8px",
        fontWeight: "500",
        color: "#333",
        fontSize: "14px",
    };

    const formControlStyle = {
        width: "100%",
        padding: "10px 12px",
        border: "1.5px solid #b7e3bc",
        borderRadius: "6px",
        fontSize: "14px",
        outline: "none",
        transition: "border-color 0.3s ease",
        boxSizing: "border-box",
    };

    const textareaStyle = {
        ...formControlStyle,
        resize: "vertical",
        minHeight: "80px",
    };

    const formTextStyle = {
        fontSize: "12px",
        color: "#666",
        marginTop: "5px",
        fontStyle: "italic",
    };

    const btnGroupStyle = {
        display: "flex",
        gap: "12px",
        justifyContent: "flex-end",
    };

    const btnStyle = {
        padding: "10px 20px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        transition: "all 0.3s ease",
    };

    const btnPrimaryStyle = {
        ...btnStyle,
        background: "#6AB320",
        color: "white",
    };

    const btnSecondaryStyle = {
        ...btnStyle,
        background: "#6c757d",
        color: "white",
    };

    const btnOutlineStyle = {
        ...btnStyle,
        background: "transparent",
        border: "1.5px solid #b7e3bc",
        color: "#6c757d",
    };

    const addButtonStyle = {
        ...btnStyle,
        background: "#6AB320",
        color: "white",
        padding: "12px 24px",
        fontSize: "16px",
        fontWeight: "600",
    };

    // Fetch locations on component mount
    useEffect(() => {
        fetchLocations();
    }, [currentPage, searchTerm]);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const response = await getAllLocations({
                page: currentPage,
                limit: 10,
                search: searchTerm,
                isActive: 'all'
            });

            if (response.success) {
                setLocations(response.data.locations);
                setTotalPages(response.data.pagination.totalPages);
                setTotalItems(response.data.pagination.totalItems);
            }
        } catch (error) {
            setError('Failed to fetch locations: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            
            const response = await createLocation(formData);
            
            if (response.success) {
                setSuccess('Location created successfully!');
                setFormData({
                    name: '',
                    location: '',
                    fullAddress: '',
                    coordinates: ''
                });
                setShowCreateForm(false);
                fetchLocations();
            }
        } catch (error) {
            setError('Failed to create location: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (locationId) => {
        
        setDeleteLocationId(locationId);
        setShowDeleteModal(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteLocationId(null);
    };

    const handleConfirmDelete = async () => {
        try {
            setDeletingLocationId(deleteLocationId);
            setShowDeleteModal(false);
            
            const locationToDelete = locations.find(l => l.id === deleteLocationId);
            setDeletedLocationName(locationToDelete ? locationToDelete.name : "");
            
            const response = await deleteLocation(deleteLocationId);
            
            if (response.success) {
                setShowSuccessModal(true);
                fetchLocations(currentPage, searchTerm, false);
            } else {
                setError(response.message || 'Failed to delete location');
            }
        } catch (error) {
            setError('Failed to delete location: ' + error.message);
        } finally {
            setDeletingLocationId(null);
            setDeleteLocationId(null);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchLocations();
    };

    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setDeletedLocationName("");
    };

    // Empty state when no locations found
    if (!loading && locations.length === 0 && !showCreateForm) {
        return (
            <div style={containerStyle}>
                <div style={headerRowStyle}>
                    <h3 style={{ color: "green", margin: 0 }}>Locations</h3>
                    <button 
                        style={addButtonStyle}
                        onClick={() => setShowCreateForm(true)}
                    >
                        Add New Location
                    </button>
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
                        📍
                    </div>
                    
                    {/* Main Message */}
                    <h2 style={{
                        fontSize: '28px',
                        color: '#333',
                        marginBottom: '12px',
                        fontWeight: '600'
                    }}>
                        {searchTerm ? 'No locations found' : 'No locations yet'}
                    </h2>
                    
                    {/* Sub Message */}
                    <p style={{
                        fontSize: '16px',
                        color: '#666',
                        marginBottom: '32px',
                        maxWidth: '400px',
                        lineHeight: '1.5'
                    }}>
                        {searchTerm 
                            ? `No locations match your search "${searchTerm}". Try adjusting your search terms.`
                            : 'There are currently no locations in the system. Add your first location to get started.'
                        }
                    </p>
                    
                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
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
                            >
                                Clear Search
                            </button>
                        )}
                        
                        <button
                            onClick={() => setShowCreateForm(true)}
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
                        >
                            Add First Location
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={headerRowStyle}>
                <h3 style={{ color: "green", margin: 0 }}>Locations ({totalItems})</h3>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={searchBarWrapperStyle}>
                        <span style={searchIconStyle}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name, location, or address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={searchInputStyle}
                        />
                    </div>
                    <button 
                        style={addButtonStyle}
                        onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                        {showCreateForm ? 'Cancel' : 'Add New Location'}
                    </button>
                </div>
            </div>
            <hr />

            {/* Success/Error Messages */}
            {success && (
                <div style={{
                    padding: '12px 20px',
                    marginBottom: '1rem',
                    backgroundColor: '#d4edda',
                    borderColor: '#c3e6cb',
                    color: '#155724',
                    border: '1px solid transparent',
                    borderRadius: '5px',
                    position: 'relative'
                }}>
                    {success}
                    <button 
                        type="button" 
                        style={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            padding: '12px 20px',
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: 'inherit'
                        }}
                        onClick={clearMessages}
                    >
                        ×
                    </button>
                </div>
            )}
            {error && (
                <div style={{
                    padding: '12px 20px',
                    marginBottom: '1rem',
                    backgroundColor: '#f8d7da',
                    borderColor: '#f5c6cb',
                    color: '#721c24',
                    border: '1px solid transparent',
                    borderRadius: '5px',
                    position: 'relative'
                }}>
                    {error}
                    <button 
                        type="button" 
                        style={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            padding: '12px 20px',
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: 'inherit'
                        }}
                        onClick={clearMessages}
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Create Location Form */}
            {showCreateForm && (
                <div style={formCardStyle}>
                    <div style={formHeaderStyle}>
                        <h5 style={formTitleStyle}>Create New Location</h5>
                    </div>
                    <div style={formBodyStyle}>
                        <form onSubmit={handleSubmit}>
                            <div style={formRowStyle}>
                                <div style={formGroupStyle}>
                                    <label style={formLabelStyle}>Name *</label>
                                    <input
                                        type="text"
                                        style={formControlStyle}
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div style={formGroupStyle}>
                                    <label style={formLabelStyle}>Location *</label>
                                    <input
                                        type="text"
                                        style={formControlStyle}
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={formGroupStyle}>
                                <label style={formLabelStyle}>Full Address *</label>
                                <textarea
                                    style={textareaStyle}
                                    name="fullAddress"
                                    value={formData.fullAddress}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                ></textarea>
                            </div>
                            <div style={formGroupStyle}>
                                <label style={formLabelStyle}>Coordinates * (format: latitude,longitude)</label>
                                <input
                                    type="text"
                                    style={formControlStyle}
                                    name="coordinates"
                                    value={formData.coordinates}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 17.4478,78.3603"
                                    required
                                />
                                <small style={formTextStyle}>
                                    Enter coordinates in format: latitude,longitude (e.g., 17.4478,78.3603)
                                </small>
                            </div>
                            <div style={btnGroupStyle}>
                                <button 
                                    type="submit" 
                                    style={btnPrimaryStyle}
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Create Location'}
                                </button>
                                <button 
                                    type="button" 
                                    style={btnSecondaryStyle}
                                    onClick={() => setShowCreateForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Locations List */}
            {!showCreateForm && (
                <>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <div style={{ fontSize: '18px', color: '#666' }}>Loading locations...</div>
                        </div>
                    ) : (
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>Name</th>
                                    <th style={thStyle}>Location</th>
                                    <th style={thStyle}>Full Address</th>
                                    <th style={thStyle}>Coordinates</th>
                                    <th style={thStyle}>Created</th>
                                    <th style={thStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {locations.map((location, index) => {
                                    const rowNumber = (currentPage - 1) * 10 + index + 1;
                                    
                                    return (
                                        <tr key={location.id}>
                                            <td style={tdStyle}>{rowNumber}</td>
                                            <td style={tdStyle}>{location.name}</td>
                                            <td style={tdStyle}>{location.location}</td>
                                            <td style={tdStyle}>{location.fullAddress}</td>
                                            <td style={tdStyle}>{location.coordinates}</td>
                                            <td style={tdStyle}>{new Date(location.createdAt).toLocaleDateString()}</td>
                                            <td style={tdStyle}>
                                                <div style={actionStyle}>
                                                  
                                                    <button
                                                        style={{
                                                            ...deleteIconStyle,
                                                            opacity: deletingLocationId === location.id ? 0.6 : 1,
                                                            cursor: deletingLocationId === location.id ? 'not-allowed' : 'pointer'
                                                        }}
                                                        title="Delete"
                                                        onClick={() => handleDeleteClick(location.id)}
                                                        disabled={deletingLocationId === location.id}
                                                    >
                                                        {deletingLocationId === location.id ? '⏳' : '🗑️'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

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
                                onClick={() => setCurrentPage(currentPage - 1)}
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
                                onClick={() => setCurrentPage(currentPage + 1)}
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
                </>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h4 style={{ marginBottom: "16px", color: "#e53935" }}>Confirm Deletion</h4>
                        <p style={{ marginBottom: "24px" }}>Are you sure you want to delete this location?</p>
                        <div style={modalButtonGroupStyle}>
                            <button
                                onClick={handleCancelDelete}
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
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2000,
                        backdropFilter: "blur(8px)",
                        animation: "fadeIn 0.3s ease-out"
                    }}
                >
                    <div
                        style={{
                            background: "linear-gradient(135deg, #ffffff 0%, #f8fff8 100%)",
                            padding: "40px 32px",
                            borderRadius: "20px",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                            minWidth: "480px",
                            width: "90%",
                            maxWidth: "520px",
                            textAlign: "center",
                            position: "relative",
                            animation: "slideInUp 0.5s ease-out",
                            border: "2px solid #e8f5e8"
                        }}
                    >
                        {/* Success Icon Animation */}
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                                borderRadius: "50%",
                                margin: "0 auto 24px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                animation: "bounceIn 0.8s ease-out",
                                boxShadow: "0 8px 32px rgba(76, 175, 80, 0.4)"
                            }}
                        >
                            <span style={{ fontSize: "36px", color: "white", animation: "pulse 2s infinite" }}>
                                ✅
                            </span>
                        </div>

                        {/* Success Message */}
                        <h2
                            style={{
                                color: "#2e7d32",
                                margin: "0 0 16px 0",
                                fontSize: "28px",
                                fontWeight: "700",
                                animation: "slideInUp 0.6s ease-out 0.2s both"
                            }}
                        >
                            🎉 Location Deleted Successfully!
                        </h2>

                        <p
                            style={{
                                color: "#666",
                                fontSize: "18px",
                                margin: "0 0 32px 0",
                                lineHeight: "1.5",
                                animation: "slideInUp 0.6s ease-out 0.4s both"
                            }}
                        >
                            The location <span style={{ color: "#4caf50", fontWeight: "600" }}>"{deletedLocationName}"</span> has been permanently removed from the system.
                        </p>

                        {/* Stats Cards */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "16px",
                                marginBottom: "32px",
                                animation: "slideInUp 0.6s ease-out 0.6s both"
                            }}
                        >
                         
                            <div
                                style={{
                                    background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                                    padding: "16px 20px",
                                    borderRadius: "12px",
                                    border: "1px solid #ff9800",
                                    minWidth: "120px"
                                }}
                            >
                                <div style={{ fontSize: "24px", fontWeight: "700", color: "#f57c00" }}>
                                    {deletedLocationName}
                                </div>
                                <div style={{ fontSize: "12px", color: "#666", textTransform: "uppercase" }}>
                                    Deleted
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "16px",
                                animation: "slideInUp 0.6s ease-out 0.8s both"
                            }}
                        >
                            <button
                                onClick={handleCloseSuccessModal}
                                style={{
                                    padding: "14px 28px",
                                    border: "none",
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                                    color: "white",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    transition: "all 0.3s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    boxShadow: "0 4px 16px rgba(76, 175, 80, 0.3)"
                                }}
                            >
                                <span>👍</span>
                                Got It!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS animations */}
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
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes slideInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px) scale(0.9);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                    
                    @keyframes bounceIn {
                        0% {
                            opacity: 0;
                            transform: scale(0.3);
                        }
                        50% {
                            opacity: 1;
                            transform: scale(1.05);
                        }
                        70% {
                            transform: scale(0.9);
                        }
                        100% {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                `}
            </style>
        </div>
    );
};

export default Location;