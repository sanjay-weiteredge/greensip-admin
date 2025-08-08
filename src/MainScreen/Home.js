import React, { useState, useEffect } from "react";
import {
  FaUserFriends,
  FaPlay,
  FaTrashAlt,
  FaBuilding,
  FaTools,
  FaQuestionCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { apiRequest } from '../services/api';
import { getBarcodeUsageCount } from '../services/barcode';

// Dashboard data with icons
const cardData = [
  { label: "Registered Users", count: 0, icon: <FaUserFriends />, color: "#4caf50", key: "users" },
  // { label: "Ads Play", count: 0, icon: <FaPlay />, color: "#2196f3", key: "ads" },
  { label: "Bottle Destroyed", count: 0, icon: <FaTrashAlt />, color: "#f44336", key: "barcodes" },
  { label: "Total Business Partners", count: 0, icon: <FaBuilding />, color: "#9c27b0", key: "vendors" },
  { label: "Total Machines", count: 0, icon: <FaTools />, color: "#ff9800", key: "machines" },
  { label: "Query Raised", count: 0, icon: <FaQuestionCircle />, color: "#607d8b", key: "queries" },
];

// Number animation effect
const Counter = ({ value }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    let totalDuration = 1000;
    let increment = Math.ceil(totalDuration / end);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, increment);
    return () => clearInterval(timer);
  }, [value]);

  return <span style={{ fontSize: "28px", fontWeight: "bold" }}>{count}</span>;
};

// Card with icon, animation, and styling
const HoverCard = ({ label, count, icon, color, delay, loading }) => {
  return (
    <motion.div
      className="dashboard-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: loading ? 1 : 1.05 }}
      style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        minWidth: "220px",
        minHeight: "170px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "0.3s ease-in-out",
        opacity: loading ? 0.7 : 1,
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
        style={{
          fontSize: "28px",
          color,
          marginBottom: "12px",
        }}
      >
        {icon}
      </motion.div>
      
      {loading ? (
        <div style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "#ccc",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <div style={{
            width: "20px",
            height: "20px",
            border: "2px solid #f3f3f3",
            borderTop: "2px solid #4caf50",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          Loading...
        </div>
      ) : (
        <Counter value={count} />
      )}
      
      <p style={{ 
        marginTop: 8, 
        color: loading ? "#999" : "#444", 
        fontSize: 14, 
        textAlign: "center" 
      }}>
        {label}
      </p>
    </motion.div>
  );
};


const Home = () => {
  const [dashboardData, setDashboardData] = useState(cardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

     
             const [
         usersResponse,
         adsResponse,
         vendorsResponse,
         machinesResponse,
         queriesResponse
       ] = await Promise.all([
         apiRequest('/user/user-list?page=1&limit=1', { method: 'GET' }),
         apiRequest('/ads/all?page=1&limit=1', { method: 'GET' }),
         apiRequest('/restaurant/allVendors', { method: 'GET' }),
         apiRequest('/machines/all?page=1&limit=1', { method: 'GET' }),
         apiRequest('/admin/support-requests?page=1&limit=1', { method: 'GET' })
       ]);

        
        let barcodesData = { data: { totalUsed: 0 } };
        try {
          barcodesData = await getBarcodeUsageCount();
          console.log('Barcode API Response:', barcodesData);
        } catch (error) {
          console.error('Error fetching barcode usage count:', error);
          console.log('Using fallback barcode data:', barcodesData);
        }

    
       const usersData = usersResponse.ok ? await usersResponse.json() : { pagination: { total: 0 } };
       const adsData = adsResponse.ok ? await adsResponse.json() : { pagination: { total: 0 } };
       const vendorsData = vendorsResponse.ok ? await vendorsResponse.json() : { restaurants: [] };
       const machinesData = machinesResponse.ok ? await machinesResponse.json() : { pagination: { total: 1 } };
       const queriesData = queriesResponse.ok ? await queriesResponse.json() : { pagination: { total: 0 } };

   
      const updatedData = cardData.map(card => {
        let count = 0;
        
        switch (card.key) {
          case 'users':
            count = usersData.pagination?.total || 0;
            break;
          case 'ads':
            count = adsData.pagination?.total || 0;
            break;
                     case 'barcodes':
             // Get used barcodes count from the usage-count API
             count = barcodesData.data?.totalUsed || 0;
             console.log('Barcode Usage Debug:', {
               totalUsed: barcodesData.data?.totalUsed || 0,
               totalBarcodes: barcodesData.data?.totalBarcodes || 0,
               usagePercentage: barcodesData.data?.usagePercentage || 0,
               unusedCount: barcodesData.data?.unusedCount || 0
             });
             break;
          case 'vendors':
            count = vendorsData.restaurants?.length || 0;
            break;
          case 'machines':
            count = machinesData.pagination?.total || 0;
            break;
          case 'queries':
            count = queriesData.pagination?.total || 0;
            break;
          default:
            count = 0;
        }

        return {
          ...card,
          count
        };
      });

      setDashboardData(updatedData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        padding: "40px 24px",
        background: "linear-gradient(to bottom right, #e8f5e9, #e3f2fd)",
        minHeight: "100vh",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#2e7d32",
            margin: 0,
          }}
        >
          Dashboard Overview
        </h2>
        
        {/* Refresh Button */}
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          style={{
            padding: "8px 16px",
            background: loading ? "#ccc" : "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease",
          }}
        >
          {loading ? "🔄 Loading..." : "🔄 Refresh"}
        </button>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #ffcdd2',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ⚠️ {error}
        </motion.div>
      )}

      <hr style={{ marginBottom: "20px" }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "32px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {dashboardData.map((card, index) => (
          <HoverCard
            key={card.label}
            label={card.label}
            count={card.count}
            icon={card.icon}
            color={card.color}
            delay={index * 0.15}
            loading={loading}
          />
        ))}
      </div>

      {/* Last Updated Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          textAlign: "center",
          marginTop: "40px",
          padding: "16px",
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "8px",
          fontSize: "12px",
          color: "#666",
        }}
      >
        📊 Data updates automatically every 30 seconds • Last updated: {new Date().toLocaleTimeString()}
      </motion.div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Home;
