import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import "../../styles/Footer.css";

const FooterComponent = () => {
    return (
        <footer className="footer">
            <span>Kateb University | All Rights Reserved {new Date().getFullYear()}</span>
            <div className="footer-icons">
                <a href="https://www.facebook.com/kateb.edu.af/" target="_blank" rel="noopener noreferrer">
                    <FaFacebook />
                </a>
                <a href="https://x.com/UniversityKateb" target="_blank" rel="noopener noreferrer">
                    <FaTwitter />
                </a>
                <a href="https://www.instagram.com/katebuniversity/channel/" target="_blank" rel="noopener noreferrer">
                    <FaInstagram />
                </a>
            </div>
        </footer>
    );
};

export default FooterComponent;