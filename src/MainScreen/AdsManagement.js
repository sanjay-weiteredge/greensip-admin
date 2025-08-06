import React from "react";
import NavTemplate from "../components/NavTemplate";
import PageBody from "../components/PageBody";
import Ads from "./Ads";

const AdsManagement = () => {
  return (
    <>
   
      <NavTemplate tab={"Ads Management"}>
      <PageBody>
        <Ads/>
      </PageBody>
      </NavTemplate>
    
    </>
  );
};

export default AdsManagement;