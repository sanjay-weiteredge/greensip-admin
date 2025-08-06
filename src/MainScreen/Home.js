import React from "react";
import {
  FaUserFriends,
  FaPlay,
  FaTrashAlt,
  FaBuilding,
  FaTools,
  FaQuestionCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";

// Dashboard data with icons
const cardData = [
  { label: "Registered Users", count: 120, icon: <FaUserFriends />, color: "#4caf50" },
  { label: "Ads Play", count: 45, icon: <FaPlay />, color: "#2196f3" },
  { label: "Bottle Destroyed", count: 32, icon: <FaTrashAlt />, color: "#f44336" },
  { label: "Total Business Partners", count: 8, icon: <FaBuilding />, color: "#9c27b0" },
  { label: "Total Machines", count: 10, icon: <FaTools />, color: "#ff9800" },
  { label: "Query Raised", count: 0, icon: <FaQuestionCircle />, color: "#607d8b" },
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
const HoverCard = ({ label, count, icon, color, delay }) => {
  return (
    <motion.div
      className="dashboard-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
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
      <Counter value={count} />
      <p style={{ marginTop: 8, color: "#444", fontSize: 14, textAlign: "center" }}>{label}</p>
    </motion.div>
  );
};

// Main component
const Home = () => {
  return (
    <div
      style={{
        padding: "40px 24px",
        background: "linear-gradient(to bottom right, #e8f5e9, #e3f2fd)",
        minHeight: "100vh",
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          fontSize: "30px",
          fontWeight: "bold",
          color: "#2e7d32",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        Dashboard Overview
      </motion.h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "32px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {cardData.map((card, index) => (
          <HoverCard
            key={card.label}
            label={card.label}
            count={card.count}
            icon={card.icon}
            color={card.color}
            delay={index * 0.15}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
