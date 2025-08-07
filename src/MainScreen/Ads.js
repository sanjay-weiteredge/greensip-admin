import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAdsComponent from '../components/UserAdsComponent';
import MachineAdsComponent from '../components/MachineAdsComponent';

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

const buttonContainerStyle = {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    marginTop: "25px",
};

const buttonStyle = {
    padding: "12px 24px",
    background: "grey",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: 500,
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(0,0,0,0.07)",
    transition: "background 0.2s",
};

const activeButtonStyle = {
    ...buttonStyle,
    background: "#2e7d32",
    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
};

const buttonHoverStyle = {
    ...buttonStyle,
    background: "#45a049",
};

const Ads = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('user');

  const handleUserClick = () => {
    setActiveSection('user');
  };

  const handleMachinesClick = () => {
    setActiveSection('machines');
  };

  const renderForm = () => {
    if (!activeSection) return null;

    if (activeSection === 'user') {
      return <UserAdsComponent />;
    } else {
      return <MachineAdsComponent />;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerRowStyle}>
        <h3 style={{ color: "green", margin: 0, fontSize: "24px", fontWeight: "700" }}>
          Ad's Management
        </h3>
      </div>
      
      <hr style={{ border: "1px solid #b7e3bc", margin: "16px 0" }} />
      
      <div style={{ ...buttonContainerStyle, justifyContent: "center" }}>
        <button 
          style={activeSection === 'user' ? activeButtonStyle : buttonStyle}
          onMouseEnter={(e) => {
            if (activeSection !== 'user') {
              e.target.style.background = buttonHoverStyle.background;
            }
          }}
          onMouseLeave={(e) => {
            if (activeSection !== 'user') {
              e.target.style.background = buttonStyle.background;
            }
          }}
          onClick={handleUserClick}
        >
          User
        </button>
        <button 
          style={activeSection === 'machines' ? activeButtonStyle : buttonStyle}
          onMouseEnter={(e) => {
            if (activeSection !== 'machines') {
              e.target.style.background = buttonHoverStyle.background;
            }
          }}
          onMouseLeave={(e) => {
            if (activeSection !== 'machines') {
              e.target.style.background = buttonStyle.background;
            }
          }}
          onClick={handleMachinesClick}
        >
          Machines
        </button>
      </div>

      {renderForm()}
    </div>
  );
};

export default Ads;