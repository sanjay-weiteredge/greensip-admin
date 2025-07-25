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
    expiryDate: "",
    pointsRequired: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setImage(files[0]);
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.code || !form.pointsRequired || !form.expiryDate) {
      setError("Code, Points Required, and Expiry Date are required.");
      return;
    }
    setLoading(true);
    try {
      const couponData = {
        code: form.code,
        description: form.description,
        pointsRequired: form.pointsRequired,
        expiryDate: form.expiryDate,
      };
      const data = await createCoupon(couponData, image);
      if (data.success) {
        setSuccess("Coupon created successfully!");
        setTimeout(() => navigate("/coupon"), 1200);
      } else {
        setError(data.message || "Failed to create coupon.");
      }
    } catch (error) {
      setError("Server error while creating coupon.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form style={formStyle} onSubmit={handleSubmit} encType="multipart/form-data">
      <h2 style={{ color: "green", marginBottom: 0, textAlign: "center", gridColumn: "1 / span 2" }}>Create Coupon</h2>
      {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
      {success && <div style={{ color: "green", textAlign: "center" }}>{success}</div>}
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
          />
        </div>
        <div style={fieldContainerStyle}>
          <label htmlFor="coupon-expiryDate" style={labelStyle}>Expiry Date</label>
          <InputField
            id="coupon-expiryDate"
            label="Expiry Date"
            placeholder="YYYY-MM-DD"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            required
            type="date"
          />
        </div>
        <div style={fieldContainerStyle}>
          <label htmlFor="coupon-pointsRequired" style={labelStyle}>Points Required</label>
          <InputField
            id="coupon-pointsRequired"
            label="Points Required"
            placeholder="Enter points required"
            name="pointsRequired"
            value={form.pointsRequired}
            onChange={handleChange}
            required
            type="number"
            min="0"
          />
        </div>
        <div style={fieldContainerStyle}>
          <label htmlFor="coupon-image" style={labelStyle}>Coupon Image</label>
          <input
            id="coupon-image"
            type="file"
            name="couponImage"
            accept="image/*"
            onChange={handleChange}
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" style={{ marginTop: 8, maxWidth: 120, maxHeight: 120, borderRadius: 8, border: '1px solid #ccc' }} />
          )}
        </div>
      </div>
      <div style={buttonRowStyle}>
        <button
          type="button"
          style={{ ...buttonStyle, background: "#ccc", color: "#333", fontWeight: "400" }}
          onClick={() => navigate("/coupon")}
          disabled={loading}
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