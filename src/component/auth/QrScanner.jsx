import React, { useState, useRef, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';
import { FaPlay, FaStop, FaTimes, FaCheckCircle } from 'react-icons/fa';
import UserService from '../service/UserService';
import '../../styles/QrScanner.css';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const processed = useRef(false);
  const qrReaderRef = useRef(null);
// Cleanup video stream when scanning stops
  useEffect(() => {
    if (!scanning && qrReaderRef.current) {
      const videoElem = qrReaderRef.current.querySelector('video');
      if (videoElem?.srcObject) {
        videoElem.srcObject.getTracks().forEach((track) => track.stop());
        videoElem.srcObject = null;
      }
    }
  }, [scanning]);

  const startScan = async () => {
    setUserInfo(null);
    processed.current = false;
    setScanning(true);

    if (!UserService.isAdmin()) {
      alert('Access denied. Only admins can use this page.');
      setScanning(false);
      return;
    }
  };

  const stopScan = () => {
    setScanning(false);
    if (qrReaderRef.current) {
      const videoElem = qrReaderRef.current.querySelector('video');
      if (videoElem?.srcObject) {
        videoElem.srcObject.getTracks().forEach((track) => track.stop());
        videoElem.srcObject = null;
      }
    }
  };

  // Handle the QR code scan result
  const handleResult = async (result, error) => {
    if (result?.text && !processed.current) {
      processed.current = true;
      const email = result.text;

      try {
        const res = await axios.post('/attendance/scan', null, {
          params: { email }
        });
        setUserInfo(res.data);
      } catch (e) {
        setUserInfo({
          email,
          message: e.response?.data?.message || 'Error in check-in',
        });
      }

      stopScan();
    }
  };

  const handleError = (error) => {
    console.error('QR Scan Error:', error);
    if (error.name === 'NotAllowedError' || error.name === 'NotFoundError') {
      alert('Camera access denied or not found. Please check permissions.');
      stopScan();
    }
  };

  if (!UserService.isAdmin()) {
    return (
      <div className="qr-scanner-container">
        <h1 className="scanner-title">Scan QR to Check In!</h1>
        <p>Please scan your QR code with the admin's device.</p>
      </div>
    );
  }

  return (
    <div className="qr-scanner-container">
      <h1 className="scanner-title">Scan QR to Check In!</h1>

      {!scanning && (
        <button className="scan-btn" onClick={startScan}>
          <FaPlay /> Start Scan
        </button>
      )}

      {scanning && (
        <div className="scanner-box">
          <QrReader
            ref={qrReaderRef}
            onResult={handleResult}
            onError={handleError}
            constraints={{ facingMode: 'environment', width: { ideal: 400 }, height: { ideal: 300 } }}
            scanDelay={300}
            style={{ width: '100%', height: 'auto', borderRadius: '8px', overflow: 'hidden' }}
          />
          <button className="stop-btn" onClick={stopScan}>
            <FaStop /> Stop
          </button>
        </div>
      )}
{/* Popup for user info after scan */}
      {userInfo && (
        <div className="popup-container">
          <div className="popup-content">
            {userInfo.profileImageUrl && (
              <img
                src={userInfo.profileImageUrl}
                alt="Profile"
                className="profile-img"
              />
            )}
            <h2>{userInfo.fullName || 'Hello Teacher!'}</h2>
            {userInfo.message && (
              <p className={userInfo.message.includes('Error') ? 'error-msg' : 'success-msg'}>
                {userInfo.message.includes('Error') ? <FaTimes /> : <FaCheckCircle />}
                {userInfo.message}
              </p>
            )}
            <button className="close-btn" onClick={() => setUserInfo(null)}>
              <FaTimes /> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;