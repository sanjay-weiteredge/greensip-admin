import React from "react";
import NavTemplate from "../components/NavTemplate.js";
import PageBody from "../components/PageBody.js";
import Home from "./Home.js";

const DashBoardPage = () => {

  return (
    <>
   
      <NavTemplate tab={"DashBoard"}>
      <PageBody>
        <Home/>
      </PageBody>
      </NavTemplate>
    
    </>
  );
};

export default DashBoardPage;
