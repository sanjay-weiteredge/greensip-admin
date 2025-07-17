import React from "react";
import NavTemplate from "../components/NavTemplate.js";
import PageBody from "../components/PageBody.js";
import Coupon from "./Coupon.js";


const CouponPage = () => {
 
  return (
    <>
   
      <NavTemplate tab={"Coupon"}>
      <PageBody>
        <Coupon/>
      </PageBody>
      </NavTemplate>
    
    </>
  );
};

export default CouponPage;
