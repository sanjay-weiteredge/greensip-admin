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
  const [edited, setEdited] = useState(false);

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
        setPhoneNumber(res.admin.contactNumber || "");
        setRole(res.admin.role || "");
        setImage(res.admin.profileImage || null);
        setEdited(false);
      } else {
        setError(res.message || "Failed to fetch profile");
      }
    };
    fetchProfile();
  }, []);

  // Track original values for change detection
  const originalValues = {
    userName: userInfo?.userName || userInfo?.username || "",
    lastName: userInfo?.lastName || "",
    email: userInfo?.email || "",
    phoneNumber: userInfo?.contactNumber || "",
    role: userInfo?.role || "",
    image: userInfo?.profileImage || null,
  };

  // Watch for changes in any field
  useEffect(() => {
    if (
      userName !== originalValues.userName ||
      lastName !== originalValues.lastName ||
      email !== originalValues.email ||
      phoneNumber !== originalValues.phoneNumber ||
      role !== originalValues.role ||
      (image && image !== originalValues.image) ||
      (profileImage && profileImage !== null)
    ) {
      setEdited(true);
    } else {
      setEdited(false);
    }
  }, [userName, lastName, email, phoneNumber, role, image, profileImage]);

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
        setPhoneNumber(refreshed.admin.contactNumber || "");
        setRole(refreshed.admin.role || "");
        setImage(refreshed.admin.profileImage || null);
        setProfileImage(null);
        updateUser(refreshed.admin); // <-- update context with latest user info
        setEdited(false);
      }
    } else {
      setError(res.message || "Failed to update profile");
    }
  };

  const handleOnClickCancel = () => {
    if (userInfo) {
      setUserName(userInfo.userName || userInfo.username || "");
      setLastName(userInfo.lastName || "");
      setEmail(userInfo.email || "");
      setPhoneNumber(userInfo.contactNumber || "");
      setRole(userInfo.role || "");
      setImage(userInfo.profileImage || null);
      setProfileImage(null);
      setEdited(false);
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

              <div className="input-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                {[ 
                  { label: "User Name", value: userName, setValue: setUserName, field: "userName" },                
                  { label: "Email", value: email, setValue: setEmail, field: "email" },
                  { label: "Phone Number", value: phoneNumber, setValue: setPhoneNumber, field: "phoneNumber" },
                  { label: "Role", value: role, setValue: setRole, field: "role", nonEditable: true },
                ].map(({ label, value, setValue, field, nonEditable }) => (
                  <div key={field} className="input-wrapper" style={{ position: 'relative', marginBottom: 24 }}>
                    <label className="input-label" style={{ fontSize: 14, color: '#888', marginBottom: 6, fontWeight: 500 }}>{label}</label>
                    <div className="input-field-container" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={label}
                        className="input-field"
                        style={{
                          height: 44,
                          width: '100%',
                          borderRadius: 10,
                          border: (!nonEditable && editableFields[field]) ? '1.5px solid #2563eb' : '1px solid #e5e7eb',
                          background: (!nonEditable && editableFields[field]) ? '#fff' : '#f7f8fa',
                          padding: '0 40px 0 14px',
                          fontSize: 16,
                          color: '#22223b',
                          outline: 'none',
                          boxShadow: (!nonEditable && editableFields[field]) ? '0 2px 8px rgba(37,99,235,0.08)' : 'none',
                          transition: 'border 0.2s, box-shadow 0.2s',
                        }}
                        disabled={nonEditable || !editableFields[field]}
                      />
                      {!nonEditable && (
                        <span
                          style={{
                            position: 'absolute',
                            right: 12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            color: editableFields[field] ? '#2563eb' : '#b0b0b0',
                            background: 'transparent',
                            zIndex: 2,
                          }}
                          onClick={() => toggleEdit(field)}
                        >
                          <FaEdit size={18} />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="button-container">
                <button className="save-button" onClick={handleOnClickSave} disabled={!edited}>Save & Update</button>
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
          .save-button:disabled {
  background-color: #b0b0b0 !important;
  color: #fff !important;
  cursor: not-allowed !important;
  opacity: 0.7;
}
        `}
      </style>
    </>
  );
};

export default UserProfile;
