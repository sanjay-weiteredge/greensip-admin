import React from "react";
import NavTemplate from "../components/NavTemplate.js";
import PageBody from "../components/PageBody.js";
import Barcode from "./BarCode.js";


const BarcodePage = () => {
 
  return (
    <>
   
      <NavTemplate tab={"Barcode"}>
      <PageBody>
        <Barcode/>
      </PageBody>
      </NavTemplate>
    
    </>
  );
};

export default BarcodePage;

