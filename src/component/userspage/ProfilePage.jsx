import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaIdCard, FaCamera, FaLock } from 'react-icons/fa';
import '../../styles/ProfilePage.css';
import { Link } from 'react-router-dom';
import NotificationDialog from '../common/NotificationDialog';

function ProfilePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [profileInfo, setProfileInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState('');
    const [showLightbox, setShowLightbox] = useState(false);
    const [notification, setNotification] = useState({
        isOpen: false,
        message: '',
        isSuccess: false
    });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        // if we come from anther page
        if (location.state?.showSuccessNotification) {
            setNotification({
                isOpen: true,
                message: 'Password updated successfully!',
                isSuccess: true
            });
           
            navigate('/profile', { replace: true, state: {} });
        }
        fetchProfileInfo();
    }, [location.state, navigate]);

    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Fetching profile with token:', token);
            const response = await UserService.getYourProfile(token);
            if (response.teachers) {
                setProfileInfo(response.teachers);
                if (response.teachers.id) {
                    try {
                        const imageUrl = await UserService.getProfilePicture(response.teachers.id, token);
                        setProfileImage(imageUrl);
                    } catch (imageError) {
                        console.error('Error fetching profile picture:', imageError.response ? imageError.response.data : imageError.message);
                        setProfileImage(null);
                    }
                }
            } else {
                setProfileInfo({});
            }
        } catch (error) {
            console.error('Error fetching profile information:', error.response ? error.response.data : error.message);
            setError('Error loading profile. Please try again.');
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('Authentication error, staying on profile page');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = async (e, retryFile = null) => {
        const file = retryFile || e?.target?.files[0];
        if (file) {
            setSelectedFile(file);
            //it is create a url for browser
            setProfileImage(URL.createObjectURL(file));
            const token = localStorage.getItem('token');
            try {
                await UserService.uploadProfilePicture(file, profileInfo.id, token);
                setNotification({
                    isOpen: true,
                    message: 'Profile picture uploaded successfully!',
                    isSuccess: true
                });
                setSelectedFile(null);
                fetchProfileInfo();
            } catch (error) {
                console.error('Error uploading profile picture:', error);
                setNotification({
                    isOpen: true,
                    message: 'Failed to upload profile picture.',
                    isSuccess: false
                });
                setProfileImage(null);
            }
        }
    };

    const handleRetry = () => {
        if (selectedFile) {
            handleImageChange(null, selectedFile);
        }
        closeNotification();
    };

    const closeNotification = () => {
        setNotification({ isOpen: false, message: '', isSuccess: false });
    };

    const handleImageClick = () => {
        if (profileImage) {
            setShowLightbox(true);
        }
    };

    const closeLightbox = () => {
        setShowLightbox(false);
    };

    if (loading) return <p className="loading-message">Loading profile...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="user-profile-wrapper">
            <div className="user-profile-section">
                <div className="user-photo-card">
                    <div className="user-image-frame" onClick={handleImageClick}>
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="user-image" onError={() => console.log('Image failed to load:', profileImage)} />
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
                    {profileInfo.role === 'USER' && (
                        <Link to="/update-password" className="edit-password-btn">
                            <FaLock /> Update Password
                        </Link>
                    )}
                </div>
            </div>

            {showLightbox && profileImage && (
                <div className="lightbox" onClick={closeLightbox}>
                    <img src={profileImage} alt="Profile Large" className="lightbox-image" />
                </div>
            )}

            <NotificationDialog
                isOpen={notification.isOpen}
                message={notification.message}
                isSuccess={notification.isSuccess}
                onClose={closeNotification}
                onRetry={notification.isSuccess ? null : handleRetry}
            />
        </div>
    );
}

export default ProfilePage;