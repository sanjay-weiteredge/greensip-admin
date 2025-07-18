import React, { useEffect, useState } from "react";
import { getAllBarcodes, generateBarcodes } from "./apiBarcode";

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

const Barcode = () => {
    const [barcodes, setBarcodes] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ count: 1, batchId: "", type: "" });
    const [generating, setGenerating] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        fetchBarcodes();
    }, []);

    const fetchBarcodes = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getAllBarcodes();
            if (res.success) {
                setBarcodes(res.barcodes);
            } else {
                setError(res.message || "Failed to fetch barcodes");
            }
        } catch (e) {
            setError(e.message || "Failed to fetch barcodes");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setForm({ count: 1, batchId: "", type: "" });
        setShowModal(true);
        setSuccessMsg("");
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setGenerating(false);
        setSuccessMsg("");
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setGenerating(true);
        setError("");
        setSuccessMsg("");
        try {
            const res = await generateBarcodes({
                count: Number(form.count),
                batchId: form.batchId,
                type: form.type,
            });
            if (res.success) {
                setSuccessMsg(res.message);
                fetchBarcodes();
                setForm({ count: 1, batchId: "", type: "" });
            } else {
                setError(res.message || "Failed to generate barcodes");
            }
        } catch (e) {
            setError(e.message || "Failed to generate barcodes");
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
                <div style={{ textAlign: "center", margin: "32px 0" }}>Loading...</div>
            ) : error ? (
                <div style={{ color: "red", textAlign: "center", margin: "32px 0" }}>{error}</div>
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
                        {filteredBarcodes.map((b) => (
                            <tr key={b.id}>
                                <td style={tdStyle}>{b.id}</td>
                                <td style={tdStyle}>{b.code}</td>
                                <td style={tdStyle}>{b.batchId}</td>
                                <td style={tdStyle}>{b.type}</td>
                                <td style={tdStyle}>{b.isUsed ? "Yes" : "No"}</td>
                                <td style={tdStyle}>{b.createdAt ? new Date(b.createdAt).toLocaleString() : ""}</td>
                                <td style={tdStyle}>
                                    {b.barcodeImage ? (
                                        <img src={b.barcodeImage} alt="barcode" style={{ height: 40 }} />
                                    ) : (
                                        <span style={{ color: '#aaa' }}>N/A</span>
                                    )}
                                </td>
                            </tr>
                        ))}
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
                                <label>Count: </label>
                                <input
                                    type="number"
                                    name="count"
                                    min={1}
                                    value={form.count}
                                    onChange={handleFormChange}
                                    required
                                    style={{ width: 60, marginLeft: 8 }}
                                />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label>Batch ID: </label>
                                <input
                                    type="text"
                                    name="batchId"
                                    value={form.batchId}
                                    onChange={handleFormChange}
                                    required
                                    style={{ width: 120, marginLeft: 8 }}
                                />
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <label>Type: </label>
                                <input
                                    type="text"
                                    name="type"
                                    value={form.type}
                                    onChange={handleFormChange}
                                    required
                                    style={{ width: 120, marginLeft: 8 }}
                                />
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