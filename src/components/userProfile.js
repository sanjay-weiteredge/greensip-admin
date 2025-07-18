import { useContext, useEffect, useState } from "react";
import NavTemplate from "./NavTemplate.js";
import PageBody from "./PageBody.js";
import { Divider } from "@mui/material";
import { FaCamera, FaEdit } from "react-icons/fa";
import { UserContext, useUser } from "./store/index.js";
import { getAdminProfile, updateAdminProfile } from "../services/adminProfile.js";


const UserProfile = () => {
  const { updateUser } = useContext(UserContext);
  const { userInfo } = useUser(); 
  const [userName, setUserName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [image, setImage] = useState(null);
  const [editableFields, setEditableFields] = useState({
    userName: false,
    lastName: false,
    email: false,
    role: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      const res = await getAdminProfile();
      setLoading(false);
      if (res.success && res.admin) {
        setUserName(res.admin.username || "");
        setLastName(res.admin.lastName || "");
        setEmail(res.admin.email || "");
        setPhoneNumber(res.admin.phoneNumber || "");
        setRole(res.admin.role || "");
        setImage(res.admin.profileImage || null);
      } else {
        setError(res.message || "Failed to fetch profile");
      }
    };
    fetchProfile();
  }, []);

  const toggleEdit = (field) => {
    setEditableFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleOnUploadImage = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(`${reader.result}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOnClickSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    const profileData = {
      username: userName,
      lastName,
      email,
      contactNumber: phoneNumber,
      role,
      // profileImage will be handled by imageFile if present
    };
    const res = await updateAdminProfile(profileData, profileImage);
    setLoading(false);
    if (res.success) {
      setSuccess("Profile updated successfully");
      // Refresh profile data
      const refreshed = await getAdminProfile();
      if (refreshed.success && refreshed.admin) {
        setUserName(refreshed.admin.username || "");
        setLastName(refreshed.admin.lastName || "");
        setEmail(refreshed.admin.email || "");
        setPhoneNumber(refreshed.admin.phoneNumber || "");
        setRole(refreshed.admin.role || "");
        setImage(refreshed.admin.profileImage || null);
        setProfileImage(null);
      }
    } else {
      setError(res.message || "Failed to update profile");
    }
  };

  const handleOnClickCancel = () => {
    if (userInfo) {
      setUserName(userInfo.userName || "");
      setLastName(userInfo.lastName || "");
      setEmail(userInfo.email || "");
      setPhoneNumber(userInfo.contactNumber || "");
      setRole(userInfo.role || "");
      setImage(userInfo.profileImage || null);
      setProfileImage(null);
    }
  }
  
  return (
    <>
    <NavTemplate tab={"Profile"}>
    <PageBody>
        <div style={{ paddingTop: 20 }}>
          <h4 style={{ paddingLeft: 20 }}>Profile</h4>
          <Divider sx={{ borderWidth: "1px", marginTop: "10px" }} />

          {loading ? (
            <div style={{ padding: 30 }}>Loading profile...</div>
          ) : error ? (
            <div style={{ color: 'red', padding: 30 }}>{error}</div>
          ) : (
            <>
              {success && <div style={{ color: 'green', padding: 10 }}>{success}</div>}
              <div className="profile-container">
                <div className="image-wrapper">
                  <img
                    src={
                     image ||
                      "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
                    }
                    alt="Profile"
                    className="profile-image"
                  />
                  <label htmlFor="imageUpload" className="camera-icon">
                    <FaCamera size={18} color="blue" />
                  </label>
                  <input onChange={handleOnUploadImage} type="file" accept="image/*" id="imageUpload" style={{ display: "none" }} />
                </div>
              </div>

              <div className="input-container">
                {[
                  { label: "First Name", value: userName, setValue: setUserName, field: "userName" },
                  { label: "Last Name", value: lastName, setValue: setLastName, field: "lastName" },
                  { label: "Email", value: email, setValue: setEmail, field: "email" },
                  { label: "Phone Number", value: phoneNumber, setValue: setPhoneNumber, field: "phoneNumber" },
                  { label: "Role", value: role, setValue: setRole, field: "role" },
                ].map(({ label, value, setValue, field }) => (
                  <div key={field} className="input-wrapper">
                    <label className="input-label">{label}</label>
                    <div className="input-edit-container">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={label}
                        className="input-field"
                        disabled={!editableFields[field]}
                      />
                      <FaEdit className="edit-icon" onClick={() => toggleEdit(field)} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="button-container">
                <button className="save-button" onClick={handleOnClickSave}>Save & Update</button>
                <button className="cancel-button" onClick={handleOnClickCancel}>Cancel</button>
              </div>
            </>
          )}
        </div>
      </PageBody>
    </NavTemplate>

      <style>
        {`
          .profile-container {
            display: flex;
            align-items: center;
            padding: 30px;
          }
          .image-wrapper {
            position: relative;
            display: inline-block;
          }
          .profile-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #6AB320;
          }
          .camera-icon {
            position: absolute;
            bottom: 5px;
            right: 5px;
            background-color: white;
            border-radius: 50%;
            padding: 6px;
            cursor: pointer;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
          }
          .camera-icon:hover {
            background-color: #f0f0f0;
          }
          .input-container {
            display: flex;
            flex-direction: column;
            padding: 30px;
          }
          .input-field {
            height: 40px;
            width: 40%;
            margin-bottom: 20px;
            border-radius: 7px;
            padding-left: 10px;
            border: 1px solid #ccc;
          }
          .button-container {
            display: flex;
            justify-content: flex-start;
            gap: 15px;
            padding: 30px;
          }
          .save-button, .cancel-button {
            height: 40px;
            width: 200px;
            border-radius: 7px;
            border: none;
            cursor: pointer;
            font-size: 16px;
          }
          .save-button {
            background-color: #6AB320;
            color: white;
          }
          .cancel-button {
            background-color: #ccc;
            color: black;
          }
          .save-button:hover {
            background-color: green;
          }
          .cancel-button:hover {
            background-color: #b0b0b0;
          }
           .input-wrapper {
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
          }
          .input-label {
            font-size: 14px;
            margin-bottom: 5px;
            color: #333;
          }
          .input-field-container {
            display: flex;
            align-items: center;
            position: relative;
          }
          .input-field {
            height: 40px;
            width: 40%;
            border-radius: 7px;
            padding-left: 10px;
            padding-right: 40px;
            border: 1px solid #ccc;
          }
          .input-field:disabled {
            background-color: #f5f5f5;
            color: #999;
            cursor: not-allowed;
          }
          .edit-icon {
        
            right: 10px;
            cursor: pointer;
            color: #007bff;
          }
          .edit-icon:hover {
            color: #0056b3;
          }
          .button-container {
            display: flex;
            justify-content: flex-start;
            gap: 15px;
            padding: 30px;
          }
        `}
      </style>
    </>
  );
};

export default UserProfile;
