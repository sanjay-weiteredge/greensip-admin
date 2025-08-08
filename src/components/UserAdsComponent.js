import React, { useState } from 'react';
import { adsService } from '../services/adsApi';

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

const UserAdsComponent = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    image: null,
    duration: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (!formData.title || !formData.companyName || !formData.duration || !formData.image) {
      setError('All fields are required.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('companyName', formData.companyName);
      uploadData.append('duration', formData.duration);
      uploadData.append('image', formData.image);

      const response = await adsService.uploadAd(uploadData);

      if (response.success) {
        setSuccess('Ad uploaded successfully!');
        setSuccessMessage('Ad uploaded successfully!');
        setShowSuccessModal(true);
        
        setFormData({
          title: '',
          companyName: '',
          image: null,
          duration: ''
        });
     
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        
        // Auto-hide modal after 2 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          setSuccessMessage('');
        }, 2000);
        
        // Call onSuccess callback if provided (for modal integration)
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } else {
        setError(response.message || 'Failed to upload ad');
      }
    } catch (error) {
      console.error('Error uploading ad:', error);
      setError(error.message || 'Failed to upload ad. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={formContainerStyle}>
        
       
        {error && (
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #ffcdd2',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            ⚠️ {error}
          </div>
        )}

       
        {success && (
          <div style={{
            background: '#e8f5e8',
            color: '#2e7d32',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #c8e6c9',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            ✅ {success}
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
            {formData.image && (
              <div style={{
                marginTop: '8px',
                fontSize: '12px',
                color: '#4caf50',
                fontWeight: '500'
              }}>
                📎 Selected: {formData.image.name}
              </div>
            )}
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

        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            ...submitButtonStyle,
            background: isLoading ? '#ccc' : submitButtonStyle.background,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Uploading...' : 'Submit User Ad'}
        </button>
      </form>

      {/* Animated Success Modal */}
      {showSuccessModal && (
        <div style={{
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
        }}>
          <div style={{
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            textAlign: "center",
            maxWidth: "400px",
            width: "90%",
            animation: "slideIn 0.4s ease-out",
            position: "relative"
          }}>
            {/* Success Icon */}
            <div style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              animation: "bounceIn 0.6s ease-out"
            }}>
              <span style={{
                fontSize: "40px",
                color: "white",
                animation: "checkmark 0.8s ease-out 0.3s both"
              }}>
                ✓
              </span>
            </div>
            
            {/* Success Message */}
            <h3 style={{
              color: "#2e7d32",
              fontSize: "24px",
              fontWeight: "700",
              marginBottom: "12px",
              animation: "fadeInUp 0.5s ease-out 0.2s both"
            }}>
              Success!
            </h3>
            
            <p style={{
              color: "#666",
              fontSize: "16px",
              lineHeight: "1.5",
              marginBottom: "24px",
              animation: "fadeInUp 0.5s ease-out 0.3s both"
            }}>
              {successMessage}
            </p>
            
            {/* Progress Bar */}
            <div style={{
              width: "100%",
              height: "4px",
              background: "#e0e0e0",
              borderRadius: "2px",
              overflow: "hidden",
              marginTop: "20px"
            }}>
              <div style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                borderRadius: "2px",
                animation: "progressBar 2s linear"
              }} />
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideIn {
            from { 
              transform: translateY(-50px) scale(0.9);
              opacity: 0;
            }
            to { 
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }
          
          @keyframes bounceIn {
            0% { 
              transform: scale(0.3);
              opacity: 0;
            }
            50% { 
              transform: scale(1.1);
            }
            100% { 
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes checkmark {
            0% { 
              transform: scale(0);
              opacity: 0;
            }
            50% { 
              transform: scale(1.2);
            }
            100% { 
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes fadeInUp {
            from { 
              transform: translateY(20px);
              opacity: 0;
            }
            to { 
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          @keyframes progressBar {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}
      </style>
    </>
  );
};

export default UserAdsComponent; 