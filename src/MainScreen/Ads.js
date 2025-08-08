import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAdsComponent from '../components/UserAdsComponent';
import MachineAdsComponent from '../components/MachineAdsComponent';
import { adsService } from '../services/adsApi';

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

// Table styles
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

const actionStyle = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    justifyContent: "center",
};

const deleteIconStyle = {
    cursor: "pointer",
    fontSize: "18px",
    color: "#e53935",
    background: "#f5524d",
    border: "1.5px solid rgb(196, 23, 20)",
    borderRadius: "4px",
    padding: "2px 6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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

const Ads = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('user');
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAds, setTotalAds] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('');
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [deletedAdTitle, setDeletedAdTitle] = useState('');

  // Fetch ads from API
  const fetchAds = async (page = 1, searchTerm = '', sort = 'Newest', showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      
      const response = await adsService.getAllAds({
        page,
        limit: 10,
        search: searchTerm,
        sortBy: sort
      });
      
      if (response.success) {
        setAds(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalAds(response.pagination.total);
        setCurrentPage(response.pagination.page);
      } else {
        setError('Failed to fetch ads');
      }
    } catch (err) {
      console.error('Error fetching ads:', err);
      setError('Failed to load ads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load ads on component mount
  useEffect(() => {
    fetchAds();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAds(1, search, sortBy, false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, sortBy]);

  const handleUserClick = () => {
    setActiveSection('user');
  };

  const handleMachinesClick = () => {
    setActiveSection('machines');
  };

  const handleCreateUserAd = () => {
    setCreateType('user');
    setShowCreateModal(true);
  };

  const handleCreateMachineAd = () => {
    setCreateType('machine');
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setCreateType('');
    // Refresh ads after creating
    fetchAds();
  };

  const handlePageChange = (newPage) => {
    fetchAds(newPage, search, sortBy, false);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleDeleteClick = async (adId) => {
    try {
      // Find the ad to get its title for the success message
      const adToDelete = ads.find(ad => ad.id === adId);
      const adTitle = adToDelete ? adToDelete.title : 'Ad';
      
      const response = await adsService.deleteAd(adId);
      if (response.success) {
        // Show success modal
        setDeletedAdTitle(adTitle);
        setShowDeleteSuccessModal(true);
        
        // Auto-hide modal after 2 seconds
        setTimeout(() => {
          setShowDeleteSuccessModal(false);
          setDeletedAdTitle('');
        }, 2000);
        
        // Refresh the current page after deletion
        fetchAds(currentPage, search, sortBy, false);
      } else {
        setError(response.message || 'Failed to delete ad');
      }
    } catch (err) {
      console.error('Error deleting ad:', err);
      setError('Failed to delete ad. Please try again.');
    }
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
          Ad's Management ({totalAds})
        </h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button style={createButtonStyle} onClick={handleCreateUserAd}>
            Create User Ad
          </button>
          <button style={createButtonStyle} onClick={handleCreateMachineAd}>
            Create Machine Ad
          </button>
        </div>
      </div>
      
      <hr style={{ border: "1px solid #b7e3bc", margin: "16px 0" }} />
      
      {/* Search and Sort Controls */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
        <select 
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1.5px solid #b7e3bc',
            borderRadius: '6px',
            background: '#fff',
            fontSize: '14px'
          }}
        >
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
        </select>
        <div style={searchBarWrapperStyle}>
          <span style={searchIconStyle}>🔍</span>
          <input
            type="text"
            placeholder="Search by title or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={searchInputStyle}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ffcdd2',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading ads...</div>
        </div>
      )}

      {/* Ads Table */}
      {!loading && ads.length > 0 && (
        <>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Image</th>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Company</th>
                <th style={thStyle}>Duration</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Created</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad, index) => {
                const rowNumber = (currentPage - 1) * 10 + index + 1;
                return (
                  <tr key={ad.id}>
                    <td style={tdStyle}>{rowNumber}</td>
                    <td style={tdStyle}>
                      {ad.imageUrl && (
                        <img 
                          src={ad.imageUrl} 
                          alt={ad.title}
                          style={{ 
                            width: '60px', 
                            height: '40px', 
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }} 
                        />
                      )}
                    </td>
                    <td style={tdStyle}>{ad.title}</td>
                    <td style={tdStyle}>{ad.companyName}</td>
                    <td style={tdStyle}>{ad.duration} days</td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: ad.isActive ? '#e8f5e8' : '#ffebee',
                        color: ad.isActive ? '#2e7d32' : '#c62828'
                      }}>
                        {ad.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {new Date(ad.createdAt).toLocaleDateString()}
                    </td>
                    <td style={tdStyle}>
                      <div style={actionStyle}>
                        <button
                          style={deleteIconStyle}
                          title="Delete"
                          onClick={() => handleDeleteClick(ad.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              marginTop: '20px',
              padding: '10px'
            }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #b7e3bc',
                  background: currentPage === 1 ? '#f0f0f0' : '#fff',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  color: currentPage === 1 ? '#999' : '#333'
                }}
              >
                Previous
              </button>
              
              <span style={{ fontSize: '14px', color: '#666' }}>
                Page {currentPage} of {totalPages}
              </span>
              
        <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #b7e3bc',
                  background: currentPage === totalPages ? '#f0f0f0' : '#fff',
                  borderRadius: '4px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  color: currentPage === totalPages ? '#999' : '#333'
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && ads.length === 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
          textAlign: 'center',
          minHeight: '400px'
        }}>
          <div style={{
            fontSize: '120px',
            marginBottom: '24px',
            animation: 'bounce 2s infinite',
            color: '#b7e3bc'
          }}>
            📢
          </div>
          
          <h2 style={{
            fontSize: '28px',
            color: '#333',
            marginBottom: '12px',
            fontWeight: '600'
          }}>
            {search ? 'No ads found' : 'No ads yet'}
          </h2>
          
          <p style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '32px',
            maxWidth: '400px',
            lineHeight: '1.5'
          }}>
            {search 
              ? `No ads match your search "${search}". Try adjusting your search terms.`
              : 'There are currently no ads in the system. Create your first ad to get started.'
            }
          </p>
          
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  padding: '12px 24px',
                  background: '#b7e3bc',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(183, 227, 188, 0.3)'
                }}
              >
                Clear Search
        </button>
            )}
            
        <button 
              onClick={() => fetchAds()}
              style={{
                padding: '12px 24px',
                background: '#6AB320',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(106, 179, 32, 0.3)'
              }}
            >
              Refresh
        </button>
      </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
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
          backdropFilter: "blur(8px)"
        }}>
          <div style={{
            background: "white",
            padding: "32px",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            minWidth: "600px",
            width: "90%",
            maxWidth: "800px",
            maxHeight: "90vh",
            overflow: "auto",
            position: "relative"
          }}>
            <button
              onClick={handleCloseModal}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#666"
              }}
            >
              ✕
            </button>
            
            <h2 style={{
              marginBottom: "24px",
              color: "#2e7d32",
              fontSize: "24px",
              fontWeight: "700",
              textAlign: "center"
            }}>
              Create {createType === 'user' ? 'User' : 'Machine'} Ad
            </h2>
            
            {createType === 'user' ? (
              <UserAdsComponent onSuccess={handleCloseModal} />
            ) : (
              <MachineAdsComponent onSuccess={handleCloseModal} />
            )}
          </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {showDeleteSuccessModal && (
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
            maxWidth: "450px",
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
              Ad Deleted Successfully!
            </h3>
            
            <p style={{
              color: "#666",
              fontSize: "16px",
              lineHeight: "1.5",
              marginBottom: "24px",
              animation: "fadeInUp 0.5s ease-out 0.3s both"
            }}>
              "{deletedAdTitle}" has been permanently removed from the system.
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

      {/* CSS Animation */}
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
          
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
    </div>
  );
};

export default Ads;