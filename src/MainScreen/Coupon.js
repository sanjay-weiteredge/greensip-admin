import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCoupons, deleteCoupon as deleteCouponApi } from "../services/coupon";

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

const createButtonStyle = {
    marginLeft: "16px",
    padding: "10px 22px",
    background: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: 400,
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(0,0,0,0.07)",
    transition: "background 0.2s",
};

const Coupon = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleteCouponId, setDeleteCouponId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [deletedCouponCode, setDeletedCouponCode] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCoupons = async () => {
            setLoading(true);
            try {
                const response = await getAllCoupons();
                const data = response.data;
                if (data.success && Array.isArray(data.coupons)) {
                    setCoupons(
                        data.coupons.map(c => ({
                            id: c.id,
                            code: c.code,
                            description: c.description,
                            expiry: c.validUntil ? c.validUntil.slice(0, 10) : "",
                            pointRequired: c.pointsRequired,
                        }))
                    );
                } else {
                    alert(data.message || "Failed to fetch coupons.");
                }
            } catch (error) {
                alert("Server error while fetching coupons.");
            } finally {
                setLoading(false);
            }
        };
        fetchCoupons();
    }, []);

    const handleDeleteClick = (couponId) => {
        setDeleteCouponId(couponId);
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
        setDeleteCouponId(null);
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setDeletedCouponCode("");
    };

    const handleConfirmDelete = async () => {
        setDeleting(true);
        try {
            const response = await deleteCouponApi(deleteCouponId);
            const data = response.data;
            if (response.status === 200 && data.success) {
                // Get the coupon code before removing it
                const deletedCoupon = coupons.find(c => c.id === deleteCouponId);
                setDeletedCouponCode(deletedCoupon ? deletedCoupon.code : "");
                
                setCoupons((prev) => prev.filter((c) => c.id !== deleteCouponId));
                setShowSuccessModal(true);
            } else {
                alert(data.message || "Failed to delete coupon.");
            }
        } catch (error) {
            alert("Server error while deleting coupon.");
        } finally {
            setShowModal(false);
            setDeleteCouponId(null);
            setDeleting(false);
        }
    };

    // Filter coupons by code or pointRequired
    const filteredCoupons = coupons.filter((c) => {
        const q = search.toLowerCase();
        return (
            c.code.toLowerCase().includes(q) ||
            c.pointRequired.toString().includes(q)
        );
    });

    return (
        <div style={containerStyle}>
            <div style={headerRowStyle}>
                <h3 style={{ color: "green", margin: 0 }}>Coupons</h3>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={searchBarWrapperStyle}>
                        <span style={searchIconStyle}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search by code or Points..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={searchInputStyle}
                        />
                    </div>
                    <button style={createButtonStyle} onClick={() => navigate('/coupon/create')}>Create Coupon</button>
                </div>
            </div>
            <hr />
            {loading ? (
                <div style={{ textAlign: "center", marginTop: 40 }}>Loading coupons...</div>
            ) : (
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Code</th>
                        <th style={thStyle}>Discription</th>
                        <th style={thStyle}>Expiry</th>
                        <th style={thStyle}>Point Required</th>
                        <th style={thStyle}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCoupons.map((c) => (
                        <tr key={c.id}>
                            <td style={tdStyle}>{c.id}</td>
                            <td style={tdStyle}>{c.code}</td>
                            <td style={tdStyle}>{c.description}</td>
                            <td style={tdStyle}>{c.expiry}</td>
                            <td style={tdStyle}>{c.pointRequired}</td>
                            <td style={tdStyle}>
                                <div style={actionStyle}>
                                    <button
                                        style={{ ...createButtonStyle, background: '#e53935', padding: '6px 10px', fontSize: '15px' }}
                                        title="Delete"
                                        onClick={() => handleDeleteClick(c.id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
            {/* Modal Popup for Delete */}
            {showModal && (
                <div style={{
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
                }}>
                    <div style={{
                        background: "white",
                        padding: "32px 24px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        minWidth: "320px",
                        textAlign: "center",
                    }}>
                        <h4 style={{ marginBottom: "16px", color: "#e53935" }}>Confirm Deletion</h4>
                        <p style={{ marginBottom: "24px" }}>Are you sure you want to delete this coupon?</p>
                        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                            <button
                                onClick={handleCancel}
                                style={{
                                    padding: "8px 20px",
                                    border: "none",
                                    borderRadius: "4px",
                                    background: "#ccc",
                                    color: "#333",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                style={{
                                    padding: "8px 20px",
                                    border: "none",
                                    borderRadius: "4px",
                                    background: "#e53935",
                                    color: "white",
                                    cursor: deleting ? "not-allowed" : "pointer",
                                    opacity: deleting ? 0.6 : 1,
                                }}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Animated Success Modal */}
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
                            🎉 Coupon Deleted Successfully!
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
                            The coupon <span style={{ color: "#4caf50", fontWeight: "600" }}>"{deletedCouponCode}"</span> has been permanently removed from the system.
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
                                    background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                                    padding: "16px 20px",
                                    borderRadius: "12px",
                                    border: "1px solid #4caf50",
                                    minWidth: "120px"
                                }}
                            >
                                <div style={{ fontSize: "24px", fontWeight: "700", color: "#2e7d32" }}>
                                    {coupons.length}
                                </div>
                                <div style={{ fontSize: "12px", color: "#666", textTransform: "uppercase" }}>
                                    Remaining
                                </div>
                            </div>
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
                                    {deletedCouponCode}
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
                                onMouseEnter={(e) => {
                                    e.target.style.transform = "translateY(-2px)";
                                    e.target.style.boxShadow = "0 6px 20px rgba(76, 175, 80, 0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "0 4px 16px rgba(76, 175, 80, 0.3)";
                                }}
                            >
                                <span>👍</span>
                                Got It!
                            </button>
                        </div>

                        {/* Decorative Elements */}
                        <div
                            style={{
                                position: "absolute",
                                top: "-10px",
                                right: "-10px",
                                width: "40px",
                                height: "40px",
                                background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                                borderRadius: "50%",
                                animation: "pulse 2s infinite"
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                bottom: "-10px",
                                left: "-10px",
                                width: "30px",
                                height: "30px",
                                background: "linear-gradient(135deg, #81c784 0%, #66bb6a 100%)",
                                borderRadius: "50%",
                                animation: "pulse 2s infinite 0.5s"
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Add CSS animations */}
            <style>
                {`
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

export default Coupon;