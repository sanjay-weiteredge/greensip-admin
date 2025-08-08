import React, { useEffect, useState } from "react";
import { generateBarcodes, getAllBarcodes } from "../services/barcode";
import { useNavigate } from "react-router-dom";

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
    const [form, setForm] = useState({ count: 1, batchId: "", type: "code128" });
    const [generating, setGenerating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState("");
    const [error, setError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [generatedCount, setGeneratedCount] = useState(0);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [printMode, setPrintMode] = useState("all"); // "all" or "batch"
    const [selectedBatchId, setSelectedBatchId] = useState("");
    const navigate = useNavigate();
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
        setForm({ count: 1, batchId: "", type: "code128" });
        setShowModal(true);
        setSuccessMsg("");
        setError("");
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setGenerating(false);
        setSuccessMsg("");
        setError("");
        setShowSuccessModal(false);
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
                setGeneratedCount(parseInt(form.count));
                setShowSuccessModal(true);
                setForm({ count: 1, batchId: "", type: "code128" });
                
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

    const handleViewBarcodes = () => {
        setShowSuccessModal(false);
        setShowModal(false);
        navigate('/barcode');
    };

    const handlePrintBarcodes = () => {
        setShowPrintModal(true);
    };

    const handleClosePrintModal = () => {
        setShowPrintModal(false);
        setPrintMode("all");
        setSelectedBatchId("");
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        let barcodesToPrint = [];
        
        if (printMode === "batch" && selectedBatchId) {
            // Filter barcodes by selected batch ID
            barcodesToPrint = barcodes.filter(barcode => 
                barcode.batchId && barcode.batchId.toString() === selectedBatchId
            );
        } else {
            // Print all barcodes (or filtered if search is active)
            barcodesToPrint = filteredBarcodes.length > 0 ? filteredBarcodes : barcodes;
        }
        
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Barcodes for Printing</title>
                <style>
                    @media print {
                        @page {
                            size: A4;
                            margin: 10mm;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                        }
                    }
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background: white;
                    }
                    .print-header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #333;
                        padding-bottom: 10px;
                    }
                    .print-header h1 {
                        margin: 0;
                        color: #333;
                        font-size: 24px;
                    }
                    .print-header p {
                        margin: 5px 0;
                        color: #666;
                        font-size: 14px;
                    }
                    .barcode-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    .barcode-item {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                        background: #f9f9f9;
                        border-radius: 8px;
                        page-break-inside: avoid;
                    }
                    .barcode-image {
                        max-width: 100%;
                        height: 60px;
                        margin-bottom: 10px;
                    }
                    .barcode-code {
                        font-size: 12px;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 5px;
                        word-break: break-all;
                    }
                    .barcode-details {
                        font-size: 10px;
                        color: #666;
                        line-height: 1.3;
                    }
                    .barcode-batch {
                        font-size: 10px;
                        color: #888;
                        margin-top: 3px;
                    }
                    .page-break {
                        page-break-before: always;
                    }
                    @media print {
                        .no-print {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="print-header">
                    <h1>📦 Product Barcodes</h1>
                    <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                    <p>Total Barcodes: ${barcodesToPrint.length}</p>
                </div>
                
                <div class="barcode-grid">
                    ${barcodesToPrint.map((barcode, index) => `
                        <div class="barcode-item ${index > 0 && index % 9 === 0 ? 'page-break' : ''}">
                            ${barcode.barcodeImage ? 
                                `<img src="data:image/png;base64,${barcode.barcodeImage}" alt="barcode" class="barcode-image" />` : 
                                '<div style="height: 60px; background: #eee; display: flex; align-items: center; justify-content: center; color: #999;">No Image</div>'
                            }
                            
                            <div class="barcode-details">
                               
                                Status: ${barcode.isUsed ? 'Used' : 'Available'}<br>
                                
                            </div>
                            <div class="barcode-batch">Batch: ${barcode.batchId || 'N/A'}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="no-print" style="text-align: center; margin-top: 30px; padding: 20px;">
                    <button onclick="window.print()" style="padding: 10px 20px; background: #4caf50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
                        🖨️ Print Barcodes
                    </button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">
                        ❌ Close
                    </button>
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
    };

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
                    <button 
                        style={{
                            ...createButtonStyle,
                            background: "#2196f3",
                            marginLeft: "8px"
                        }} 
                        onClick={() => handlePrintBarcodes()}
                        disabled={filteredBarcodes.length === 0}
                    >
                        📄 Print All Barcodes
                    </button>
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
                        
                            <th style={thStyle}>Status</th>
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
                            filteredBarcodes.map((b, index) => (
                                <tr key={b.id}>
                                    <td style={tdStyle}>{index + 1}</td>
                                    <td style={tdStyle}>{b.code}</td>
                                    <td style={tdStyle}>{b.batchId}</td>
                                   
                                    <td style={tdStyle}>{b.isUsed ? "Used" : "Not Used"}</td>
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
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      backdropFilter: "blur(2px)",
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "32px 28px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        minWidth: "460px",
        width: "90%",
        maxWidth: "500px",
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      <h3 style={{ marginBottom: "20px", color: "#4caf50", fontSize: "20px" }}>
        🎯 Generate Barcodes
      </h3>

      <form onSubmit={handleGenerate}>
        <div style={{ marginBottom: 16, textAlign: "left" }}>
          <label style={{ fontWeight: 500 }}>Count (1-100)</label>
          <input
            type="number"
            name="count"
            min={1}
            max={100}
            value={form.count}
            onChange={handleFormChange}
            required
            style={{
              width: "80%",
              marginTop: 6,
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: 16, textAlign: "left" }}>
          <label style={{ fontWeight: 500 }}>Batch ID (positive integer)</label>
          <input
            type="number"
            name="batchId"
            min={1}
            value={form.batchId}
            onChange={handleFormChange}
            required
            style={{
              width: "80%",
              marginTop: 6,
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
        </div>

        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        {successMsg && <div style={{ color: "green", marginBottom: 12 }}>{successMsg}</div>}

        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "12px" }}>
          <button
            type="button"
            onClick={handleCloseModal}
            style={{
              padding: "10px 24px",
              border: "none",
              borderRadius: "6px",
              background: "#e0e0e0",
              color: "#333",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#d5d5d5")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#e0e0e0")}
            disabled={generating}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: "10px 24px",
              border: "none",
              borderRadius: "6px",
              background: generating ? "#a5d6a7" : "#4caf50",
              color: "white",
              fontWeight: 600,
              cursor: generating ? "not-allowed" : "pointer",
              transition: "background 0.3s",
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
                         🎉 Barcodes Created Successfully!
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
                         {generatedCount} barcode{generatedCount > 1 ? 's' : ''} have been generated with{" "}
                         <span style={{ color: "#4caf50", fontWeight: "600" }}>Code 128</span> format.
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
                                 {generatedCount}
                             </div>
                             <div style={{ fontSize: "12px", color: "#666", textTransform: "uppercase" }}>
                                 Generated
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
                                 Code 128
                             </div>
                             <div style={{ fontSize: "12px", color: "#666", textTransform: "uppercase" }}>
                                 Format
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
                             onClick={handleCloseModal}
                             style={{
                                 padding: "14px 28px",
                                 border: "2px solid #e0e0e0",
                                 borderRadius: "12px",
                                 background: "white",
                                 color: "#666",
                                 cursor: "pointer",
                                 fontSize: "16px",
                                 fontWeight: "600",
                                 transition: "all 0.3s ease",
                                 display: "flex",
                                 alignItems: "center",
                                 gap: "8px"
                             }}
                             onMouseEnter={(e) => {
                                 e.target.style.background = "#f5f5f5";
                                 e.target.style.transform = "translateY(-2px)";
                             }}
                             onMouseLeave={(e) => {
                                 e.target.style.background = "white";
                                 e.target.style.transform = "translateY(0)";
                             }}
                         >
                             <span>✋</span>
                             Stay Here
                         </button>
                         <button
                             onClick={handleViewBarcodes}
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
                             <span>👁️</span>
                             View All Barcodes
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

         {/* Print Modal */}
         {showPrintModal && (
             <div
                 style={{
                     position: "fixed",
                     top: 0,
                     left: 0,
                     width: "100vw",
                     height: "100vh",
                     background: "rgba(0,0,0,0.5)",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     zIndex: 1000,
                     backdropFilter: "blur(2px)",
                 }}
             >
                 <div
                     style={{
                         background: "#fff",
                         padding: "32px 28px",
                         borderRadius: "12px",
                         boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                         minWidth: "460px",
                         width: "90%",
                         maxWidth: "500px",
                         fontFamily: "sans-serif",
                         textAlign: "center",
                     }}
                 >
                     <h3 style={{ marginBottom: "20px", color: "#2196f3", fontSize: "20px" }}>
                         🖨️ Print Barcodes
                     </h3>

                                           <div style={{ marginBottom: "24px", textAlign: "left" }}>
                          <p style={{ margin: "0 0 16px 0", color: "#666", lineHeight: "1.5" }}>
                              Choose what you want to print:
                          </p>
                          
                          {/* Print Mode Selection */}
                          <div style={{ marginBottom: "20px" }}>
                              <div style={{ marginBottom: "12px" }}>
                                  <label style={{ display: "flex", alignItems: "center", marginBottom: "8px", cursor: "pointer" }}>
                                      <input
                                          type="radio"
                                          name="printMode"
                                          value="all"
                                          checked={printMode === "all"}
                                          onChange={(e) => setPrintMode(e.target.value)}
                                          style={{ marginRight: "8px" }}
                                      />
                                      <span style={{ fontWeight: "500" }}> Print All Barcodes</span>
                                  </label>
                                  <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                      <input
                                          type="radio"
                                          name="printMode"
                                          value="batch"
                                          checked={printMode === "batch"}
                                          onChange={(e) => setPrintMode(e.target.value)}
                                          style={{ marginRight: "8px" }}
                                      />
                                      <span style={{ fontWeight: "500" }}> Print by Batch ID</span>
                                  </label>
                              </div>
                              
                              {/* Batch ID Selection */}
                              {printMode === "batch" && (
                                  <div style={{ marginTop: "12px", padding: "12px", background: "#f8f9fa", borderRadius: "6px", border: "1px solid #dee2e6" }}>
                                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#495057" }}>
                                          Select Batch ID:
                                      </label>
                                      <select
                                          value={selectedBatchId}
                                          onChange={(e) => setSelectedBatchId(e.target.value)}
                                          style={{
                                              width: "100%",
                                              padding: "8px 12px",
                                              borderRadius: "4px",
                                              border: "1px solid #ced4da",
                                              fontSize: "14px"
                                          }}
                                      >
                                          <option value="">Choose a batch ID...</option>
                                          {Array.from(new Set(barcodes.map(b => b.batchId).filter(Boolean))).sort().map(batchId => (
                                              <option key={batchId} value={batchId}>
                                                  Batch {batchId} ({barcodes.filter(b => b.batchId && b.batchId.toString() === batchId.toString()).length} barcodes)
                                              </option>
                                          ))}
                                      </select>
                                  </div>
                              )}
                          </div>
                          
                          <div style={{ background: "#f5f5f5", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
                              <h4 style={{ margin: "0 0 8px 0", color: "#333" }}> Print Details:</h4>
                              <ul style={{ margin: 0, paddingLeft: "20px", color: "#666" }}>
                                  <li>Page Size: A4</li>
                                  <li>Layout: 3 barcodes per row</li>
                                  <li>Total Barcodes: {
                                      printMode === "batch" && selectedBatchId 
                                          ? barcodes.filter(b => b.batchId && b.batchId.toString() === selectedBatchId).length
                                          : (filteredBarcodes.length > 0 ? filteredBarcodes.length : barcodes.length)
                                  }</li>
                                  <li>Pages: {Math.ceil(
                                      (printMode === "batch" && selectedBatchId 
                                          ? barcodes.filter(b => b.batchId && b.batchId.toString() === selectedBatchId).length
                                          : (filteredBarcodes.length > 0 ? filteredBarcodes.length : barcodes.length)
                                      ) / 9)
                                  }</li>
                              </ul>
                          </div>

                          <div style={{ background: "#e3f2fd", padding: "12px", borderRadius: "6px", border: "1px solid #2196f3" }}>
                              <p style={{ margin: 0, fontSize: "14px", color: "#1976d2" }}>
                                  💡 <strong>Tip:</strong> Each barcode includes the code, status, and batch information for easy identification.
                              </p>
                          </div>
                      </div>

                     <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                         <button
                             type="button"
                             onClick={handleClosePrintModal}
                             style={{
                                 padding: "10px 24px",
                                 border: "none",
                                 borderRadius: "6px",
                                 background: "#e0e0e0",
                                 color: "#333",
                                 fontWeight: "600",
                                 cursor: "pointer",
                                 transition: "background 0.3s",
                             }}
                             onMouseOver={(e) => (e.currentTarget.style.background = "#d5d5d5")}
                             onMouseOut={(e) => (e.currentTarget.style.background = "#e0e0e0")}
                         >
                             Cancel
                         </button>
                                                   <button
                              onClick={handlePrint}
                              disabled={printMode === "batch" && !selectedBatchId}
                              style={{
                                  padding: "10px 24px",
                                  border: "none",
                                  borderRadius: "6px",
                                  background: (printMode === "batch" && !selectedBatchId) ? "#ccc" : "#2196f3",
                                  color: "white",
                                  fontWeight: "600",
                                  cursor: (printMode === "batch" && !selectedBatchId) ? "not-allowed" : "pointer",
                                  transition: "background 0.3s",
                              }}
                              onMouseOver={(e) => {
                                  if (!(printMode === "batch" && !selectedBatchId)) {
                                      e.currentTarget.style.background = "#1976d2";
                                  }
                              }}
                              onMouseOut={(e) => {
                                  if (!(printMode === "batch" && !selectedBatchId)) {
                                      e.currentTarget.style.background = "#2196f3";
                                  }
                              }}
                          >
                              🖨️ Generate & Print
                          </button>
                     </div>
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

export default Barcode;