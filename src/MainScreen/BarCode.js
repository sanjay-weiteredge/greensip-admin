import React, { useEffect, useState } from "react";
import { generateBarcodes, getAllBarcodes } from "../services/barcode";

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

const dummyBarcodes = [
    { id: 1, code: "BCODE001", batchId: "BATCH01", type: "TypeA", isUsed: false, createdAt: new Date().toISOString(), barcodeImage: null },
    { id: 2, code: "BCODE002", batchId: "BATCH01", type: "TypeA", isUsed: true, createdAt: new Date().toISOString(), barcodeImage: null },
    { id: 3, code: "BCODE003", batchId: "BATCH02", type: "TypeB", isUsed: false, createdAt: new Date().toISOString(), barcodeImage: null },
    { id: 4, code: "BCODE004", batchId: "BATCH02", type: "TypeB", isUsed: true, createdAt: new Date().toISOString(), barcodeImage: null },
];

const Barcode = () => {
    const [barcodes, setBarcodes] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ count: 1, batchId: "", type: "" });
    const [generating, setGenerating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState("");
    const [error, setError] = useState("");

    // Validation function
    const validateForm = () => {
        const { count, batchId, type } = form;
        
        if (!count || count < 1 || count > 100) {
            setError("Count must be between 1 and 100");
            return false;
        }
        
        if (!batchId || batchId.trim() === "") {
            setError("Batch ID is required");
            return false;
        }
        
        if (!type || type.trim() === "") {
            setError("Type is required");
            return false;
        }
        
        // Validate batchId is a positive integer
        const batchIdNum = parseInt(batchId);
        if (isNaN(batchIdNum) || batchIdNum <= 0) {
            setError("Batch ID must be a positive integer");
            return false;
        }
        
        // Validate type format (alphanumeric and common barcode types)
        const validTypes = ['code128','code39', 'ean13', 'ean8', 'upca', 'upce', 'qr'];
        if (!validTypes.includes(type.toLowerCase())) {
            setError("Type must be one of: code128,code39, ean13, ean8, upca, upce, qr");
            return false;
        }
        
        return true;
    };

    // Fetch barcodes from API
    useEffect(() => {
        const fetchBarcodes = async () => {
            try {
                setLoading(true);
                const response = await getAllBarcodes();
                if (response.success) {
                    setBarcodes(response.barcodes || []);
                } else {
                    setError(response.message || "Failed to fetch barcodes");
                }
            } catch (error) {
                setError(error.message || "Network error while fetching barcodes");
            } finally {
                setLoading(false);
            }
        };

        fetchBarcodes();
    }, []);

    const handleOpenModal = () => {
        setForm({ count: 1, batchId: "", type: "" });
        setShowModal(true);
        setSuccessMsg("");
        setError("");
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setGenerating(false);
        setSuccessMsg("");
        setError("");
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (error) setError("");
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setGenerating(true);
        setError("");
        setSuccessMsg("");
        
        try {
            const response = await generateBarcodes({
                count: parseInt(form.count),
                batchId: parseInt(form.batchId),
                type: form.type.toLowerCase()
            });
            
            if (response.success) {
                setSuccessMsg(`${form.count} barcodes generated successfully!`);
                setForm({ count: 1, batchId: "", type: "" });
                
                // Refresh the barcodes list
                const refreshResponse = await getAllBarcodes();
                if (refreshResponse.success) {
                    setBarcodes(refreshResponse.barcodes || []);
                }
            } else {
                setError(response.message || "Failed to generate barcodes");
            }
        } catch (error) {
            setError(error.message || "Network error while generating barcodes");
        } finally {
            setGenerating(false);
        }
    };

    // Filter barcodes by code, batchId, or type
    const filteredBarcodes = barcodes.filter((b) => {
        const q = search.toLowerCase();
        return (
            b.code.toLowerCase().includes(q) ||
            (b.batchId && b.batchId.toString().toLowerCase().includes(q)) ||
            (b.type && b.type.toLowerCase().includes(q))
        );
    });

    return (
        <div style={containerStyle}>
            <div style={headerRowStyle}>
                <h3 style={{ color: "green", margin: 0 }}>Barcodes</h3>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={searchBarWrapperStyle}>
                        <span style={searchIconStyle}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search by code, batchId, or type..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={searchInputStyle}
                        />
                    </div>
                    <button style={createButtonStyle} onClick={handleOpenModal}>Generate Barcode</button>
                </div>
            </div>
            <hr />
            {loading ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                    Loading barcodes...
                </div>
            ) : error ? (
                <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
                    {error}
                </div>
            ) : (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Code</th>
                            <th style={thStyle}>Batch ID</th>
                            <th style={thStyle}>Type</th>
                            <th style={thStyle}>Used?</th>
                            <th style={thStyle}>Created At</th>
                            <th style={thStyle}>Barcode Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBarcodes.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ ...tdStyle, textAlign: "center", color: "#666" }}>
                                    {search ? "No barcodes found matching your search." : "No barcodes available."}
                                </td>
                            </tr>
                        ) : (
                            filteredBarcodes.map((b) => (
                                <tr key={b.id}>
                                    <td style={tdStyle}>{b.id}</td>
                                    <td style={tdStyle}>{b.code}</td>
                                    <td style={tdStyle}>{b.batchId}</td>
                                    <td style={tdStyle}>{b.type}</td>
                                    <td style={tdStyle}>{b.isUsed ? "Yes" : "No"}</td>
                                    <td style={tdStyle}>{b.createdAt ? new Date(b.createdAt).toLocaleString() : ""}</td>
                                    <td style={tdStyle}>
                                        {b.barcodeImage ? (
                                            <img src={`data:image/png;base64,${b.barcodeImage}`} alt="barcode" style={{ height: 40 }} />
                                        ) : (
                                            <span style={{ color: '#aaa' }}>N/A</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
            {/* Modal Popup for Generate Barcode */}
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
                        minWidth: "340px",
                        textAlign: "center",
                    }}>
                        <h4 style={{ marginBottom: "16px", color: "#4caf50" }}>Generate Barcodes</h4>
                        <form onSubmit={handleGenerate}>
                            <div style={{ marginBottom: 16 }}>
                                <label>Count (1-100): </label>
                                <input
                                    type="number"
                                    name="count"
                                    min={1}
                                    max={100}
                                    value={form.count}
                                    onChange={handleFormChange}
                                    required
                                    style={{ width: 80, marginLeft: 8, padding: "4px 8px" }}
                                />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label>Batch ID (positive integer): </label>
                                <input
                                    type="number"
                                    name="batchId"
                                    min={1}
                                    value={form.batchId}
                                    onChange={handleFormChange}
                                    required
                                    style={{ width: 120, marginLeft: 8, padding: "4px 8px" }}
                                />
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <label>Type: </label>
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleFormChange}
                                    required
                                    style={{ width: 140, marginLeft: 8, padding: "4px 8px" }}
                                >
                                    <option value="">Select Type</option>
                                    <option value="Code128">Code 128</option>
                                    <option value="Code39">Code 39</option>
                                    <option value="Ean13">EAN-13</option>
                                    <option value="Ean8">EAN-8</option>
                                    <option value="upca">UPC-A</option>
                                    <option value="upce">UPC-E</option>
                                    <option value="qr">QR Code</option>
                                </select>
                            </div>
                            {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
                            {successMsg && <div style={{ color: "green", marginBottom: 8 }}>{successMsg}</div>}
                            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    style={{
                                        padding: "8px 20px",
                                        border: "none",
                                        borderRadius: "4px",
                                        background: "#ccc",
                                        color: "#333",
                                        cursor: "pointer",
                                    }}
                                    disabled={generating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: "8px 20px",
                                        border: "none",
                                        borderRadius: "4px",
                                        background: "#4caf50",
                                        color: "white",
                                        cursor: generating ? "not-allowed" : "pointer",
                                    }}
                                    disabled={generating}
                                >
                                    {generating ? "Generating..." : "Generate"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Barcode;