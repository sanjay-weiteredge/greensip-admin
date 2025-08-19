import React from "react";
import NavTemplate from "../components/NavTemplate.js";
import PageBody from "../components/PageBody.js";
import Home from "./Home.js";
import Location from "./location.js";

const LocationManagement = () => {

  return (
    <>
   
      <NavTemplate tab={"Machine"}>
      <PageBody>
      <Location/>
      </PageBody>
      </NavTemplate>
    
    </>
  );
};

export default LocationManagement;
