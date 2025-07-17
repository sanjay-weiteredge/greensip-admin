import React from "react";
import NavTemplate from "../components/NavTemplate.js";
import PageBody from "../components/PageBody.js";

import Restaurant from "./Restaurant.js";

const RestaurantPage = () => {
 
  return (
    <>
   
      <NavTemplate tab={"Business Partner"}>
      <PageBody>
        <Restaurant/>
      </PageBody>
      </NavTemplate>
    
    </>
  );
};

export default RestaurantPage;
