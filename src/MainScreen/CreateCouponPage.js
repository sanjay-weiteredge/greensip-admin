import React from "react";
import NavTemplate from "../components/NavTemplate";
import PageBody from "../components/PageBody";
import CreateCoupon from "./CreateCoupon";

const CreateCouponPage = () => {
  return (
    <NavTemplate tab={"Coupon"}>
      <PageBody>
        <CreateCoupon />
      </PageBody>
    </NavTemplate>
  );
};

export default CreateCouponPage; 