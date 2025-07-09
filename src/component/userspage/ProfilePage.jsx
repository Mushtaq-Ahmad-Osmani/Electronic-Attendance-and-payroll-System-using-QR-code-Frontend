import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { FaUser, FaEnvelope, FaPhone, FaEdit,FaIdCard , FaCamera } from "react-icons/fa";
import '../../styles/ProfilePage.css';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const [profileInfo, setProfileInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.getYourProfile(token);
      setProfileInfo(response.teachers);
      setProfileImage(response.profilePicture);
    } catch (error) {
      console.error('Error fetching profile information:', error);
      setError('Error loading profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const token = localStorage.getItem('token');
      try {
        await UserService.uploadProfilePicture(file, profileInfo.id, token);
        setProfileImage(URL.createObjectURL(file));
        alert('Profile picture uploaded successfully!');
        fetchProfileInfo();
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Failed to upload profile picture.');
      }
    }
  };

  if (loading) return <p className="loading-message">Loading profile...</p>;
  if (error || !profileInfo || Object.keys(profileInfo).length === 0)
    return <p className="error-message">{error || 'Error loading profile. Please try again.'}</p>;

  return (
    <div className="user-profile-wrapper">
      <div className="user-profile-section">
        <div className="user-photo-card">
          <div className="user-image-frame">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="user-image" />
            ) : (
              <div className="default-user-image">
                <FaUser className="default-user-icon" />
              </div>
            )}
          </div>
          <div className="photo-upload-area">
            <label className="photo-upload-btn">
              <FaCamera className="camera-symbol" /> {profileImage ? 'Change Photo' : 'Add Photo'}
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          </div>
        </div>
        <div className="user-info-panel">
          <h2>{profileInfo.name || 'N/A'}</h2>
          <p className="user-role-label">{profileInfo.role || 'N/A'}</p>
          <div className="user-details">
            <p>
              <FaUser className="info-icon" /> <span>{profileInfo.name || 'N/A'}</span>
            </p>
            <p>
              <FaEnvelope className="info-icon" /> <span>{profileInfo.email || 'N/A'}</span>
            </p>
            <p>
              <FaIdCard className="info-icon" /> <span>{profileInfo.id || 'N/A'}</span>
            </p>
            <p>
              <FaPhone className="info-icon" /> <span>{profileInfo.phone || 'N/A'}</span>
            </p>
          </div>
          {profileInfo.role === 'ADMIN' && (
            <Link to={`/update-user/${profileInfo.id}`} className="edit-profile-btn">
              <FaEdit /> Update Profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;