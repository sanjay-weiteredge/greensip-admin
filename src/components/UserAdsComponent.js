import React, { useState } from 'react';

const formContainerStyle = {
    padding: "32px",
    borderRadius: "12px",
    marginTop: "35px",
    maxWidth: "800px",
    margin:"auto",
};

const formGroupStyle = {
    marginBottom: "24px",
};

const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#2c3e50",
    fontSize: "14px",
    letterSpacing: "0.5px",
};

const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "2px solid #e1e8ed",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    transition: "all 0.3s ease",
    background: "#fafbfc",
    color: "#2c3e50",
};

const fileInputStyle = {
    ...inputStyle,
    padding: "12px 16px",
    background: "#f8f9fa",
    border: "2px dashed #cbd5e0",
    cursor: "pointer",
};

const submitButtonStyle = {
    padding: "16px 32px",
    background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
    transition: "all 0.3s ease",
    marginTop: "32px",
    width: "auto",
    minWidth: "200px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    textTransform: "uppercase",
    letterSpacing: "1px",
};

const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    marginBottom: "24px",
};

const fullWidthStyle = {
    gridColumn: "1 / -1",
};

const UserAdsComponent = () => {
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    image: null,
    duration: ''
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <form onSubmit={handleSubmit} style={formContainerStyle}>
            
      <div style={gridContainerStyle}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Ad's Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            style={inputStyle}
            placeholder="Enter ad's title"
            required
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Ad's Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            style={inputStyle}
            placeholder="Enter company name"
            required
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Image Upload</label>
          <input
            type="file"
            name="image"
            onChange={handleInputChange}
            style={fileInputStyle}
            accept="image/*"
            required
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Ad's Duration (in days)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            style={inputStyle}
            placeholder="Enter duration in days"
            min="1"
            required
          />
        </div>
      </div>

      <button type="submit" style={submitButtonStyle}>
        Submit User Ad
      </button>
    </form>
  );
};

export default UserAdsComponent; 