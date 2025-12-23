import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import axios from 'axios';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';
import UserService from '../service/UserService';
import '../../styles/QrScanner.css';

const QRScanner = () => {
  const videoRef = useRef(null);
  const [userInfo, setUserInfo] = useState(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (scanning) {
      const startScanner = async () => {
        scannerRef.current = new QrScanner(
          videoRef.current,
          async (result) => {
            if (result?.data) {
              const email = result.data;
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
          },
          { highlightScanRegion: true, highlightCodeOutline: true }
        );
        await scannerRef.current.start();
      };

      startScanner();
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
      }
    };
  }, [scanning]);

  const startScan = () => {
    setUserInfo(null);
    setScanning(true);
  };

  const stopScan = () => {
    setScanning(false);
    if (scannerRef.current) {
      scannerRef.current.stop();
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
          Start Scan
        </button>
      )}

      {scanning && (
        <div className="scanner-box">
          <video
            ref={videoRef}
            style={{ width: '100%', borderRadius: '10px' }}
            muted
            playsInline
          />
          <button className="stop-btn" onClick={stopScan}>
            Stop
          </button>
        </div>
      )}

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
