import React, { useState } from 'react';
import { adsService } from '../services/adsApi';

const formContainerStyle = {
    padding: "32px",
    borderRadius: "12px",
    marginTop: "35px",
    maxWidth: "800px",
    margin: "auto",
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

const MachineAdsComponent = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    media: null,
    adsDuration: '',
    startDate: '',
    endDate: '',
    mediaType: 'image'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    
    // Clear messages when user starts typing
    setError('');
    setSuccess('');
  };

  const handleMediaTypeChange = (e) => {
    const mediaType = e.target.value;
    setFormData(prev => ({
      ...prev,
      mediaType,
      media: null // Reset media when type changes
    }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Ad title is required');
      return false;
    }
    if (!formData.companyName.trim()) {
      setError('Company name is required');
      return false;
    }
    if (!formData.media) {
      setError('Media file is required');
      return false;
    }
    if (!formData.adsDuration || formData.adsDuration <= 0) {
      setError('Ad duration must be greater than 0');
      return false;
    }
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start >= end) {
        setError('End date must be after start date');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('media', formData.media);
      formDataToSend.append('adsDuration', formData.adsDuration);
      formDataToSend.append('mediaType', formData.mediaType);
      
      if (formData.startDate) {
        formDataToSend.append('startDate', formData.startDate);
      }
      if (formData.endDate) {
        formDataToSend.append('endDate', formData.endDate);
      }

      const response = await adsService.createMachineAd(formDataToSend);
      
      if (response.success) {
        setSuccess('Machine ad created successfully!');
        // Reset form
        setFormData({
          title: '',
          companyName: '',
          media: null,
          adsDuration: '',
          startDate: '',
          endDate: '',
          mediaType: 'image'
        });
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500); // Give user time to see success message
        }
      } else {
        setError(response.message || 'Failed to create machine ad');
      }
    } catch (error) {
      console.error('Error creating machine ad:', error);
      setError(error.message || 'An error occurred while creating the machine ad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formContainerStyle}>
      {error && (
        <div style={{
          padding: "12px",
          marginBottom: "20px",
          backgroundColor: "#fee",
          border: "1px solid #fcc",
          borderRadius: "8px",
          color: "#c33",
          fontSize: "14px"
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{
          padding: "12px",
          marginBottom: "20px",
          backgroundColor: "#efe",
          border: "1px solid #cfc",
          borderRadius: "8px",
          color: "#3c3",
          fontSize: "14px"
        }}>
          {success}
        </div>
      )}

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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Media Type</label>
          <select
            name="mediaType"
            value={formData.mediaType}
            onChange={handleMediaTypeChange}
            style={inputStyle}
            disabled={loading}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>
            {formData.mediaType === 'video' ? 'Video' : 'Image'} Upload
          </label>
          <input
            type="file"
            name="media"
            onChange={handleInputChange}
            style={fileInputStyle}
            accept={formData.mediaType === 'video' ? 'video/*' : 'image/*'}
            required
            disabled={loading}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Ad's Duration (in days)</label>
          <input
            type="number"
            name="adsDuration"
            value={formData.adsDuration}
            onChange={handleInputChange}
            style={inputStyle}
            placeholder="Enter duration in days"
            min="1"
            required
            disabled={loading}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Start Date (Optional)</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            style={inputStyle}
            disabled={loading}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>End Date (Optional)</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            style={inputStyle}
            disabled={loading}
          />
        </div>
      </div>

      <button 
        type="submit" 
        style={{
          ...submitButtonStyle,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
        disabled={loading}
      >
        {loading ? 'Creating Machine Ad...' : 'Submit Machine Ad'}
      </button>
    </form>
  );
};

export default MachineAdsComponent; 