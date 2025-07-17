import { useContext, useEffect, useState } from "react";
import NavTemplate from "./NavTemplate.js";
import PageBody from "./PageBody.js";
import { Divider } from "@mui/material";
import { FaCamera, FaEdit } from "react-icons/fa";
import { UserContext, useUser } from "./store/index.js";

const UserProfile = () => {
  const { updateUser } = useContext(UserContext);
  const { userInfo } = useUser(); 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [image, setImage] = useState(null);
  const [editableFields, setEditableFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
  });

  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      setEmail(userInfo.email || "");
      setPhoneNumber(userInfo.phoneNumber || "");
      setImage(userInfo.photo || null);
    }
  }, [userInfo]);

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

  // Remove handleOnClickSave API call, just update local state
  const handleOnClickSave = () => {
    // No API call, just keep the current local state as 'saved'
    // Optionally, you could show a message here
  };

  const handleOnClickCancel = () => {
    if (userInfo) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      setEmail(userInfo.email || "");
      setPhoneNumber(userInfo.phoneNumber || "");
      setImage(userInfo.photo || null);
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
              { label: "First Name", value: firstName, setValue: setFirstName, field: "firstName" },
              { label: "Last Name", value: lastName, setValue: setLastName, field: "lastName" },
              { label: "Email", value: email, setValue: setEmail, field: "email" },
              { label: "Phone Number", value: phoneNumber, setValue: setPhoneNumber, field: "phoneNumber" },
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
