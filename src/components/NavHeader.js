import { Box, Stack } from "@mui/material";
import { styled } from "@mui/system";
import Profile from "./Profile.js";
import CustomeButton from "./CustomeButton.js";
import Image from "./Image .js";
import { useState, useEffect, useContext } from "react";

import logoImage from "../assets/image/SpeakllerLogo.svg";
import profileimage from "../assets/image/Profile.png";
import notificationIcon from "../assets/image/Notification.png";
import { useNavigate } from "react-router-dom";
import { useUser } from "./store/index.js";
import { UserContext } from "./store/index.js";


const HeaderWrapper = styled(Stack)`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0px 30px;
  justify-content: space-between;
  background-color: #6AB320;
`;

const UserIconWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const StyledImage = styled("img")`
  height: 33px;
  width: 33px;
  cursor: pointer;
  padding-right: 10px;
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 0.8;
  }
`;

const LogoImage = styled("img")`
  height: 50px;
  width: 150px;
  cursor: pointer;
`;

const ProfileImage = styled("img")`
  height: 35px;
  width: 35px;
  cursor: pointer;
  border-radius: 50%;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const NavHeader = () => {
  const { updateUser } = useContext(UserContext);

  const { userInfo } = useUser();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/Profile');
  };

  // Robust fallback for profile image
  let profileImgSrc = "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg";
  if (userInfo) {
    if (userInfo.profileImage) profileImgSrc = userInfo.profileImage;
    else if (userInfo.photo) profileImgSrc = userInfo.photo;
  }

  return (
    <HeaderWrapper direction="row">
      {/* <LogoImage src={logoImage} alt="Logo" onClick={()=>{navigate("/dashboard")}} /> */}
      <h1>GreenSip</h1>
      <UserIconWrapper>
        {/* <StyledImage src={notificationIcon} alt="notification" /> */}
        <Profile />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right', marginRight: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#222' }}>
              {userInfo && (userInfo.username || userInfo.userName) ? (userInfo.username || userInfo.userName) : 'User'}
            </div>
            <div style={{ fontSize: 13, color: '#555' }}>
              {userInfo && userInfo.email ? userInfo.email : ''}
            </div>
          </div>
          <ProfileImage
            src={profileImgSrc}
            alt="Profile"
            onClick={handleProfileClick}
          />
        </div>
      </UserIconWrapper>
    </HeaderWrapper>
  );
};

export default NavHeader;
