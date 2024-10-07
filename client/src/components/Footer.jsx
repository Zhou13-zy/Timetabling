import React from 'react';
import './styled/Footer.css'; 
import iconImage from '../assets/logo.svg'; 

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section brand">
        <p className="footer-icon">
          <img src={iconImage} alt="Footer Icon" />
        </p>
        <p className="footer-title">Timetabling</p>
      </div>
      <div className="footer-section">
        <h3 className="footer-heading">Generate</h3>
        <ul className="footer-list">
          <li><a href="/import-timetable" className="footer-link">Upload File</a></li>
          <li><a href="/generate" className="footer-link">Generate</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3 className="footer-heading">Manage</h3>
        <ul className="footer-list">
          <li><a href="/manage-property" className="footer-link">Manage Timetable</a></li>
          <li><a href="/generate" className="footer-link">Export</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3 className="footer-heading">My profile</h3>
        <ul className="footer-list">
          <li><a href="/profile" className="footer-link">My profile</a></li>
          <li><a href="/change-pwd" className="footer-link">Change Password</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3 className="footer-heading">Account</h3>
        <ul className="footer-list">
          <li><a href="/reset-pwd" className="footer-link">Reset Password</a></li>
          <li><a href="/forget-pwd" className="footer-link">Forgot Password</a></li>
        </ul>
      </div>
    </footer>
  );
}
