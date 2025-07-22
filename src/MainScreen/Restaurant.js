import React, { useState } from "react";

const initialRestaurants = [
    { id: 1, name: "Green Leaf Diner", email: "contact@greenleaf.com", contact: "9876543210", address: "123 Maple St, Springfield" },
    { id: 2, name: "Urban Bites", email: "info@urbanbites.com", contact: "9123456780", address: "456 Oak Ave, Riverdale" },
    { id: 3, name: "Sunset Grill", email: "hello@sunsetgrill.com", contact: "9988776655", address: "789 Pine Rd, Centerville" },
    { id: 4, name: "Oceanic Eats", email: "support@oceaniceats.com", contact: "9090909090", address: "321 Elm St, Metropolis" },
    { id: 5, name: "Mountain View Cafe", email: "mountain@viewcafe.com", contact: "9001122334", address: "654 Cedar Ave, Gotham" },
    { id: 6, name: "City Spice", email: "cityspice@food.com", contact: "9112233445", address: "987 Birch Blvd, Star City" },
    { id: 7, name: "Riverbank Restaurant", email: "riverbank@dine.com", contact: "9223344556", address: "159 Spruce Dr, Smallville" },
    { id: 8, name: "The Food Court", email: "info@foodcourt.com", contact: "9334455667", address: "753 Willow Ln, Hill Valley" },
    { id: 9, name: "Taste Junction", email: "contact@tastejunction.com", contact: "9445566778", address: "852 Aspen Ct, River City" },
    { id: 10, name: "Bistro Bliss", email: "hello@bistrobliss.com", contact: "9556677889", address: "951 Poplar St, Emerald City" },
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

const searchIconStyle = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#b7e3bc",
    fontSize: "20px",
    pointerEvents: "none",
};

const Restaurant = () => {
    const [restaurants, setRestaurants] = useState(initialRestaurants);
    const [deleteRestaurantId, setDeleteRestaurantId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newVendor, setNewVendor] = useState({ name: '', email: '', password: '', phone: '', address: '' });
    const [addError, setAddError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleDeleteClick = (restaurantId) => {
        setDeleteRestaurantId(restaurantId);
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
        setDeleteRestaurantId(null);
    };

    const handleConfirmDelete = () => {
        setRestaurants((prev) => prev.filter((r) => r.id !== deleteRestaurantId));
        setShowModal(false);
        setDeleteRestaurantId(null);
    };

    const handleAddVendorChange = (e) => {
        const { name, value } = e.target;
        setNewVendor((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddVendor = (e) => {
        e.preventDefault();
        // Basic validation
        if (!newVendor.name || !newVendor.email || !newVendor.password || !newVendor.phone || !newVendor.address) {
            setAddError('All fields are required.');
            return;
        }
        setRestaurants((prev) => [
            ...prev,
            {
                id: prev.length ? prev[prev.length - 1].id + 1 : 1,
                name: newVendor.name,
                email: newVendor.email,
                contact: newVendor.phone,
                address: newVendor.address,
            },
        ]);
        setShowAddModal(false);
        setNewVendor({ name: '', email: '', password: '', phone: '', address: '' });
        setAddError('');
    };

    // Filter restaurants by search query (name, email, or contact)
    const filteredRestaurants = restaurants.filter((r) => {
        const q = search.toLowerCase();
        return (
            r.name.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q) ||
            r.contact.toLowerCase().includes(q)
        );
    });

    return (
        <div style={containerStyle}>
            <div style={headerRowStyle}>
                <h3 style={{ color: "green", margin: 0 }}>Business Partners</h3>
                <div style={{ display: "flex", alignItems: "center" }}>
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
                <button style={createButtonStyle} onClick={() => setShowAddModal(true)}>Create Vendor</button>
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
                        <th style={thStyle}>Address</th>
                        <th style={thStyle}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRestaurants.map((r) => (
                        <tr key={r.id}>
                            <td style={tdStyle}>{r.id}</td>
                            <td style={tdStyle}>{r.name}</td>
                            <td style={tdStyle}>{r.email}</td>
                            <td style={tdStyle}>{r.contact}</td>
                            <td style={tdStyle}>{r.address}</td>
                            <td style={tdStyle}>
                                <div style={actionStyle}>
                                    <button
                                        style={deleteIconStyle}
                                        title="Delete"
                                        onClick={() => handleDeleteClick(r.id)}
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
                        <p style={{ marginBottom: "24px" }}>Are you sure you want to delete this business partner?</p>
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
            {/* Add Vendor Modal Popup */}
            {showAddModal && (
                <div style={{
                    ...modalOverlayStyle,
                    zIndex: 1200,
                    background: 'rgba(0,0,0,0.10)',
                }}>
                    <div style={{
                        ...modalContentStyle,
                        minWidth: 700,
                        maxWidth: 800,
                        width: '95vw',
                        padding: '40px 40px 32px 40px',
                        borderRadius: 18,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                        position: 'relative',
                        background: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <h2 style={{ marginBottom: 28, color: '#219653', fontWeight: 700, fontSize: 26, textAlign: 'center', letterSpacing: 0.2 }}>Add Vendor</h2>
                        <form onSubmit={handleAddVendor} autoComplete="off" style={{ width: '100%' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 40,
                                marginBottom: 24,
                                width: '100%',
                                maxWidth: 700,
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <label style={{ fontWeight: 700, color: '#22223b', fontSize: 15, marginBottom: 2 }}>Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Enter name"
                                            value={newVendor.name}
                                            onChange={handleAddVendorChange}
                                            style={{
                                                width: '100%',
                                                padding: '13px 15px',
                                                borderRadius: 8,
                                                border: '1.5px solid #bdbdbd',
                                                fontSize: 16,
                                                background: '#fff',
                                                outline: 'none',
                                                transition: 'border 0.2s',
                                            }}
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <label style={{ fontWeight: 700, color: '#22223b', fontSize: 15, marginBottom: 2 }}>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Enter email"
                                            value={newVendor.email}
                                            onChange={handleAddVendorChange}
                                            style={{
                                                width: '100%',
                                                padding: '13px 15px',
                                                borderRadius: 8,
                                                border: '1.5px solid #bdbdbd',
                                                fontSize: 16,
                                                background: '#fff',
                                                outline: 'none',
                                                transition: 'border 0.2s',
                                            }}
                                            required
                                        />
                                    </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
                                        <label style={{ fontWeight: 700, color: '#22223b', fontSize: 15, marginBottom: 2 }}>Password</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter password"
                                            value={newVendor.password}
                                            onChange={handleAddVendorChange}
                                            style={{
                                                width: '100%',
                                                padding: '13px 15px',
                                                borderRadius: 8,
                                                border: '1.5px solid #bdbdbd',
                                                fontSize: 16,
                                                background: '#fff',
                                                outline: 'none',
                                                transition: 'border 0.2s',

                                            }}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            style={{
                                                position: 'absolute',
                                                right: 16,
                                                top: '70%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: 18,
                                                color: '#888',
                                                padding: 0, 
                                                zIndex: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? '🙈' : <span style={{fontSize: 18}}>👁️</span>}
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                  
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <label style={{ fontWeight: 700, color: '#22223b', fontSize: 15, marginBottom: 2 }}>Phone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            placeholder="Enter phone"
                                            value={newVendor.phone}
                                            onChange={handleAddVendorChange}
                                            style={{
                                                width: '100%',
                                                padding: '13px 15px',
                                                borderRadius: 8,
                                                border: '1.5px solid #bdbdbd',
                                                fontSize: 16,
                                                background: '#fff',
                                                outline: 'none',
                                                transition: 'border 0.2s',
                                            }}
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <label style={{ fontWeight: 700, color: '#22223b', fontSize: 15, marginBottom: 2 }}>Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="Enter address"
                                            value={newVendor.address}
                                            onChange={handleAddVendorChange}
                                            style={{
                                                width: '100%',
                                                padding: '13px 15px',
                                                borderRadius: 8,
                                                border: '1.5px solid #bdbdbd',
                                                fontSize: 16,
                                                background: '#fff',
                                                outline: 'none',
                                                transition: 'border 0.2s',
                                            }}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            {addError && <div style={{ color: 'red', marginTop: 2, marginBottom: 10, textAlign: 'center' }}>{addError}</div>}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 10 }}>
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); setAddError(''); }}
                                    style={{
                                        padding: '12px 36px',
                                        border: 'none',
                                        borderRadius: 10,
                                        background: '#e0e0e0',
                                        color: '#333',
                                        fontWeight: 700,
                                        fontSize: 17,
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = '#bdbdbd'}
                                    onMouseOut={e => e.currentTarget.style.background = '#e0e0e0'}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '12px 36px',
                                        border: 'none',
                                        borderRadius: 10,
                                        background: '#219653',
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: 17,
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = '#176b3f'}
                                    onMouseOut={e => e.currentTarget.style.background = '#219653'}
                                >
                                    Add Vendor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Restaurant;
