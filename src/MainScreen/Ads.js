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
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  // Fetch ads from API based on active section
  const fetchAds = async (page = 1, searchTerm = '', sort = 'Newest', showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      
      let response;
      const params = {
        page,
        limit: 10,
        sortBy: sort
      };

      if (activeSection === 'user') {
        response = await adsService.getAllAds(params);
      } else {
        response = await adsService.getAllMachineAds(params);
      }
      
      if (response.success) {
        // Handle different response structures
        if (activeSection === 'user') {
          setAds(response.data || []);
          setTotalPages(response.pagination?.totalPages || 1);
          setTotalAds(response.pagination?.total || 0);
          setCurrentPage(response.pagination?.page || 1);
        } else {
          // Machine ads response structure
          setAds(response.data?.machineAds || []);
          setTotalPages(response.data?.pagination?.totalPages || 1);
          setTotalAds(response.data?.pagination?.totalItems || 0);
          setCurrentPage(response.data?.pagination?.currentPage || 1);
        }
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

  // Load ads on component mount and when active section changes
  useEffect(() => {
    fetchAds();
  }, [activeSection]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAds(1, search, sortBy, false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, sortBy, activeSection]);

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

  const handleDeleteConfirm = (ad) => {
    setAdToDelete(ad);
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteConfirmYes = async () => {
    if (!adToDelete) return;
    
    try {
      let response;
      if (activeSection === 'user') {
        response = await adsService.deleteAd(adToDelete.id);
      } else {
        response = await adsService.deleteMachineAd(adToDelete.id);
      }

      if (response.success) {
        // Show success modal
        setDeletedAdTitle(adToDelete.title);
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
    } finally {
      setShowDeleteConfirmModal(false);
      setAdToDelete(null);
    }
  };

  const handleDeleteConfirmNo = () => {
    setShowDeleteConfirmModal(false);
    setAdToDelete(null);
  };

  const handleViewAd = (ad) => {
    setSelectedAd(ad);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedAd(null);
  };

  const renderForm = () => {
    if (!activeSection) return null;

    if (activeSection === 'user') {
      return <UserAdsComponent />;
    } else {
      return <MachineAdsComponent />;
    }
  };

  // Helper function to get media URL
  const getMediaUrl = (ad) => {
    if (activeSection === 'user') {
      return ad.imageUrl;
    } else {
      // For machine ads, check both image and video
      return ad.image || ad.video;
    }
  };

  // Helper function to get media type
  const getMediaType = (ad) => {
    if (activeSection === 'user') {
      return 'image';
    } else {
      return ad.video ? 'video' : 'image';
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

      {/* Ad Type Selector - Dropdown */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        alignItems: 'center', 
        marginBottom: '20px',
        marginTop: '25px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#2c3e50',
            marginRight: '8px'
          }}>
            Ad Type:
          </label>
          <select
            value={activeSection}
            onChange={(e) => {
              const newSection = e.target.value;
              setActiveSection(newSection);
              setCurrentPage(1);
              setSearch('');
            }}
            style={{
              padding: '10px 16px',
              border: '1.5px solid #b7e3bc',
              borderRadius: '6px',
              background: '#fff',
              fontSize: '14px',
              fontWeight: '500',
              color: '#2c3e50',
              cursor: 'pointer',
              minWidth: '150px',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <option value="user">User Ads</option>
            <option value="machines">Machine Ads</option>
          </select>
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
          <div style={{ fontSize: '18px', color: '#666' }}>Loading {activeSection === 'user' ? 'user' : 'machine'} ads...</div>
        </div>
      )}

      {/* Ads Table */}
      {!loading && ads.length > 0 && (
        <>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Media</th>
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
                const mediaUrl = getMediaUrl(ad);
                const mediaType = getMediaType(ad);
                
                return (
                  <tr key={ad.id}>
                    <td style={tdStyle}>{rowNumber}</td>
                    <td style={tdStyle}>
                      {mediaUrl && (
                        mediaType === 'video' ? (
                          <video 
                            src={mediaUrl} 
                            style={{ 
                              width: '60px', 
                              height: '40px', 
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }}
                            muted
                          />
                        ) : (
                          <img 
                            src={mediaUrl} 
                            alt={ad.title}
                            style={{ 
                              width: '60px', 
                              height: '40px', 
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }} 
                          />
                        )
                      )}
                    </td>
                    <td style={tdStyle}>{ad.title}</td>
                    <td style={tdStyle}>{ad.companyName}</td>
                    <td style={tdStyle}>
                      {activeSection === 'user' ? ad.duration : ad.adsDuration} days
                    </td>
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
                          style={{
                            cursor: "pointer",
                            fontSize: "16px",
                            color: "#2196f3",
                            background: "#e3f2fd",
                            border: "1.5px solid #2196f3",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            marginRight: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                          title="View Details"
                          onClick={() => handleViewAd(ad)}
                        >
                          👁️
                        </button>
                        <button
                          style={deleteIconStyle}
                          title="Delete"
                          onClick={() => handleDeleteConfirm(ad)}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
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
            <button
              onClick={handleDeleteConfirmNo}
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
              color: "#c62828",
              fontSize: "24px",
              fontWeight: "700",
              textAlign: "center"
            }}>
              Confirm Deletion
            </h2>
            
            <p style={{
              color: "#666",
              fontSize: "16px",
              lineHeight: "1.5",
              marginBottom: "24px",
              animation: "fadeInUp 0.5s ease-out 0.2s both"
            }}>
              Are you sure you want to delete "{adToDelete?.title}"? This action cannot be undone.
            </p>
            
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px"
            }}>
              <button
                onClick={handleDeleteConfirmYes}
                style={{
                  padding: "12px 24px",
                  background: "#e53935",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 500,
                  fontSize: "16px",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.07)",
                  transition: "background 0.2s"
                }}
              >
                Yes, Delete
              </button>
              <button
                onClick={handleDeleteConfirmNo}
                style={{
                  padding: "12px 24px",
                  background: "#4caf50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 500,
                  fontSize: "16px",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.07)",
                  transition: "background 0.2s"
                }}
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Ad Modal */}
      {showViewModal && selectedAd && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
          backdropFilter: "blur(10px)",
          animation: "fadeIn 0.3s ease-out"
        }}>
          <div style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            padding: "0",
            borderRadius: "24px",
            boxShadow: "0 32px 64px rgba(0,0,0,0.4), 0 16px 32px rgba(0,0,0,0.2)",
            minWidth: "900px",
            width: "95%",
            maxWidth: "1400px",
            maxHeight: "95vh",
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(255,255,255,0.2)"
          }}>
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)",
              padding: "24px 32px",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.1)"
            }}>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: "700",
                  letterSpacing: "0.5px"
                }}>
                  Ad Details
                </h2>
                <p style={{
                  margin: "4px 0 0 0",
                  fontSize: "14px",
                  opacity: 0.9,
                  fontWeight: "400"
                }}>
                  {activeSection === 'user' ? 'User Advertisement' : 'Machine Advertisement'}
                </p>
              </div>
              <button
                onClick={handleCloseViewModal}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "white",
                  transition: "all 0.2s ease",
                  backdropFilter: "blur(10px)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.2)";
                  e.target.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                  e.target.style.transform = "scale(1)";
                }}
              >
                ✕
              </button>
            </div>
            
            {/* Content */}
            <div style={{
              padding: "32px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "48px",
              alignItems: "start",
              maxHeight: "calc(95vh - 120px)",
              overflow: "auto"
            }}>
              {/* Left Column - Media */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                <div style={{
                  width: "100%",
                  maxWidth: "500px",
                  marginBottom: "24px"
                }}>
                  <div style={{
                    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                    padding: "20px",
                    borderRadius: "16px",
                    border: "1px solid #dee2e6",
                    marginBottom: "16px"
                  }}>
                    <h3 style={{
                      margin: "0 0 16px 0",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#495057",
                      textAlign: "center",
                      letterSpacing: "0.5px"
                    }}>
                      Media Preview
                    </h3>
                    
                    <div style={{
                      width: "100%",
                      height: "320px",
                      overflow: "hidden",
                      borderRadius: "12px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                      border: "3px solid #ffffff",
                      background: "#000",
                      position: "relative"
                    }}>
                      {getMediaUrl(selectedAd) && (
                        getMediaType(selectedAd) === 'video' ? (
                          <video 
                            src={getMediaUrl(selectedAd)} 
                            style={{ 
                              width: "100%", 
                              height: "100%", 
                              objectFit: "contain",
                              borderRadius: "9px"
                            }}
                            controls
                            autoPlay={false}
                            
                          />
                        ) : (
                          <img 
                            src={getMediaUrl(selectedAd)} 
                            alt={selectedAd.title}
                            style={{ 
                              width: "100%", 
                              height: "100%", 
                              objectFit: "contain",
                              borderRadius: "9px"
                            }}
                          />
                        )
                      )}
                    </div>
                  </div>
                  
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px"
                  }}>
                    <span style={{
                      padding: "8px 16px",
                      background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#1976d2",
                      border: "1px solid #90caf9",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      {getMediaType(selectedAd) === 'video' ? 'Video Ad' : 'Image Ad'}
                    </span>
                    <span style={{
                      padding: "8px 16px",
                      background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#2e7d32",
                      border: "1px solid #a5d6a7",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      {activeSection === 'user' ? 'User' : 'Machine'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Details */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px"
              }}>
                <div style={{
                  background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                  padding: "24px",
                  borderRadius: "16px",
                  border: "1px solid #dee2e6"
                }}>
                  <h3 style={{
                    margin: "0 0 20px 0",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#495057",
                    borderBottom: "2px solid #dee2e6",
                    paddingBottom: "12px",
                    letterSpacing: "0.5px"
                  }}>
                    Ad Information
                  </h3>
                  
                  <div style={{
                    display: "grid",
                    gap: "16px"
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      background: "white",
                      borderRadius: "12px",
                      border: "1px solid #e9ecef",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                    }}>
                      <span style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#6c757d",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        Title
                      </span>
                      <span style={{
                        fontSize: "16px",
                        color: "#2c3e50",
                        fontWeight: "500",
                        textAlign: "right",
                        maxWidth: "60%",
                        lineHeight: "1.4"
                      }}>
                        {selectedAd.title}
                      </span>
                    </div>
                    
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      background: "white",
                      borderRadius: "12px",
                      border: "1px solid #e9ecef",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                    }}>
                      <span style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#6c757d",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        Company
                      </span>
                      <span style={{
                        fontSize: "16px",
                        color: "#2c3e50",
                        fontWeight: "500",
                        textAlign: "right",
                        maxWidth: "60%",
                        lineHeight: "1.4"
                      }}>
                        {selectedAd.companyName}
                      </span>
                    </div>
                    
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      background: "white",
                      borderRadius: "12px",
                      border: "1px solid #e9ecef",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                    }}>
                      <span style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#6c757d",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        Duration
                      </span>
                      <span style={{
                        fontSize: "16px",
                        color: "#2c3e50",
                        fontWeight: "500",
                        textAlign: "right"
                      }}>
                        {activeSection === 'user' ? selectedAd.duration : selectedAd.adsDuration} days
                      </span>
                    </div>
                    
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      background: "white",
                      borderRadius: "12px",
                      border: "1px solid #e9ecef",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                    }}>
                      <span style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#6c757d",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        Status
                      </span>
                      <span style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: selectedAd.isActive 
                          ? "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)" 
                          : "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
                        color: selectedAd.isActive ? '#2e7d32' : '#c62828',
                        border: `1px solid ${selectedAd.isActive ? '#a5d6a7' : '#ef9a9a'}`,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        {selectedAd.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      background: "white",
                      borderRadius: "12px",
                      border: "1px solid #e9ecef",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                    }}>
                      <span style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#6c757d",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        Created
                      </span>
                      <span style={{
                        fontSize: "16px",
                        color: "#2c3e50",
                        fontWeight: "500",
                        textAlign: "right"
                      }}>
                        {new Date(selectedAd.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Additional Info Section */}
                <div style={{
                  background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1px solid #ffcc02"
                }}>
                  <h4 style={{
                    margin: "0 0 12px 0",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#e65100",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    📊 Ad Statistics
                  </h4>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px"
                  }}>
                    <div style={{
                      textAlign: "center",
                      padding: "12px",
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.3)"
                    }}>
                      <div style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#e65100"
                      }}>
                        {activeSection === 'user' ? selectedAd.duration : selectedAd.adsDuration}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#bf360c",
                        fontWeight: "500"
                      }}>
                        Days Active
                      </div>
                    </div>
                    <div style={{
                      textAlign: "center",
                      padding: "12px",
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.3)"
                    }}>
                      <div style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#e65100"
                      }}>
                        {selectedAd.isActive ? 'Live' : 'Paused'}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#bf360c",
                        fontWeight: "500"
                      }}>
                        Current Status
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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