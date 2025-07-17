import { width } from "@mui/system";
import React, { useState } from "react";

const cardData = [
  { label: "Registered Users", count: 120 },
  { label: "Adds Play", count: 45 },
  { label: "Bottle Destroyed", count: 32 },
  { label: "Total Restaurants", count: 8 },
  { label: "Total Machines", count: 10 },
];

const queryData = [{ label: "Query Raised", count: 0 }];

const HoverCard = ({ label, count }) => {
  const [hovered, setHovered] = useState(false);

  const cardStyle = {
    margin: "10px",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: hovered
      ? "0 4px 16px rgba(0,0,0,0.2)"
      : "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "box-shadow 0.3s, transform 0.3s",
    transform: hovered ? "translateY(-8px)" : "none",
    width: "220px",
    maxWidth: "90%", 
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h2>{count}</h2>
      <p>{label}</p>
    </div>
  );
};

const Home = () => {
  return (
    <>
      <h3 style={{ padding: "16px", color: "green" }}>Dashboard</h3>
      <hr />
      <div style={gridStyle}>
        {cardData.map((card) => (
          <HoverCard key={card.label} label={card.label} count={card.count} />
        ))}
      </div>
      <br />
      <hr />
      <div style={gridStyle}>
        {queryData.map((query) => (
          <HoverCard key={query.label} label={query.label} count={query.count} />
        ))}
      </div>
    </>
  );
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridTemplateRows: "repeat(2, 1fr)",
  gap: "32px",
  marginTop: "20px",
  justifyContent: "center", 
  justifyItems: "center", 
}


export default Home;
