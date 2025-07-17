import React from "react";
import NavTemplate from "../components/NavTemplate.js";
import PageBody from "../components/PageBody.js";
import User from "./User.js";


const UserPage = () => {
  return (
    <>
      <NavTemplate tab={"User"}>
        <PageBody>
          <User/>
        </PageBody>
      </NavTemplate>
    </>
  );
};

export default UserPage;
