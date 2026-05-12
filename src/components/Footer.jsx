import React from 'react';
import { Link } from 'react-router-dom';
import '../css/footer.css';
export const Footer = () => (
    <footer className="footer">
        <div className="footer-top">
            <div className="footer-brand">
                <div className="logo">Vental</div>
                <p>Premium vehicle rental service with a wide selection of luxury and everyday vehicles for all your driving needs.</p>
            </div>

            <div className="footer-col">
                <h4>QUICK LINKS</h4>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/listing">Browse Vehicles</Link></li>
                    <li><Link to="/listing">list vehicles</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                </ul>
            </div>

            <div className="footer-col">
                <h4>RESOURCES</h4>
                <ul>
                    <li><Link to="/about">Help Center</Link></li>
                    <li><Link to="/terms">Terms of Service</Link></li>
                </ul>
            </div>

            <div className="footer-col">
                <h4>CONTACT</h4>
                <ul>
                    <li><span>Kathmandu, Nepal</span></li>
                    <li><span>Naxal, Herald College</span></li>
                    <li><a href="tel:+9779800000000">+977 9800000000</a></li>
                    <li><a href="mailto:info@vental.com">info@vental.com</a></li>
                </ul>
            </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
            <div className="copyright">© 2026 Vental. All rights reserved.</div>
        </div>
    </footer>
);