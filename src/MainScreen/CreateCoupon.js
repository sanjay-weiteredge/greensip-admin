import React, { useState } from "react";
import InputField from "../components/InputField";
import { useNavigate } from "react-router-dom";

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

const CreateCoupon = () => {
  const [form, setForm] = useState({
    code: "",
    description: "",
    expiry: "",
    pointRequired: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send form data to backend
    alert("Coupon created! (Demo only)");
    navigate("/coupon");
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <h2 style={{ color: "green", marginBottom: 0, textAlign: "center", gridColumn: "1 / span 2" }}>Create Coupon</h2>
      <div style={gridStyle}>
        <InputField
          label="Code"
          placeholder="Enter coupon code"
          name="code"
          value={form.code}
          onChange={handleChange}
          required
        />
        <InputField
          label="Description"
          placeholder="Enter description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <InputField
          label="Expiry"
          placeholder="YYYY-MM-DD"
          name="expiry"
          value={form.expiry}
          onChange={handleChange}
          required
          type="date"
        />
        <InputField
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
        >
          Create
        </button>
      </div>
    </form>
  );
};

export default CreateCoupon; 