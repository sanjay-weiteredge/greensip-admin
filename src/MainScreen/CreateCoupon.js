import React, { useState } from "react";
import InputField from "../components/InputField";
import { useNavigate } from "react-router-dom";
import { createCoupon } from "../services/coupon";

const formStyle = {
  maxWidth: "100%",
  height: "100vh",
  margin: "auto",
  padding: "50px",
  background: "#f3fbf3",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridTemplateRows: "auto auto",
  gap: "18px",
  marginTop: "18px",
  width : "80%",
  margin: "0 auto",
};

const buttonRowStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
};

const buttonStyle = {
  padding: "10px 22px",
  border: "none",
  borderRadius: "6px",
  fontWeight: 600,
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 1px 2px rgba(0,0,0,0.07)",
  transition: "background 0.2s",
};

const fieldContainerStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "8px",
};
const labelStyle = {
  fontWeight: 600,
  fontSize: "1.05rem",
  marginBottom: "6px",
  color: "#22223b",
  letterSpacing: "0.01em",
};

const CreateCoupon = () => {
  const [form, setForm] = useState({
    code: "",
    description: "",
    expiry: "",
    pointRequired: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createCoupon(form);
      const data = response.data;
      if (data.success) {
        alert("Coupon created successfully!");
        navigate("/coupon");
      } else {
        alert(data.message || "Failed to create coupon.");
      }
    } catch (error) {
      alert("Server error while creating coupon.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <h2 style={{ color: "green", marginBottom: 0, textAlign: "center", gridColumn: "1 / span 2" }}>Create Coupon</h2>
      <div style={gridStyle}>
        <div style={fieldContainerStyle}>
          <label htmlFor="coupon-code" style={labelStyle}>Code</label>
          <InputField
            id="coupon-code"
            label="Code"
            placeholder="Enter coupon code"
            name="code"
            value={form.code}
            onChange={handleChange}
            required
          />
        </div>
        <div style={fieldContainerStyle}>
          <label htmlFor="coupon-description" style={labelStyle}>Description</label>
          <InputField
            id="coupon-description"
            label="Description"
            placeholder="Enter description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div style={fieldContainerStyle}>
          <label htmlFor="coupon-expiry" style={labelStyle}>Expiry</label>
          <InputField
            id="coupon-expiry"
            label="Expiry"
            placeholder="YYYY-MM-DD"
            name="expiry"
            value={form.expiry}
            onChange={handleChange}
            required
            type="date"
          />
        </div>
        <div style={fieldContainerStyle}>
          <label htmlFor="coupon-pointRequired" style={labelStyle}>Point Required</label>
          <InputField
            id="coupon-pointRequired"
            label="Point Required"
            placeholder="Enter points required"
            name="pointRequired"
            value={form.pointRequired}
            onChange={handleChange}
            required
            type="number"
            min="0"
          />
        </div>
      </div>
      <div style={buttonRowStyle}>
        <button
          type="button"
          style={{ ...buttonStyle, background: "#ccc", color: "#333" , fontWeight: "400" }}
          onClick={() => navigate("/coupon")}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{ ...buttonStyle, background: "#4caf50", color: "#fff", fontWeight: "400" }}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
};

export default CreateCoupon; 