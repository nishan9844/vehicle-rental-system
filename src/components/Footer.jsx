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
                    <li><Link to="/details">Help Center</Link></li>
                    <li><Link to="/terms">Terms of Service</Link></li>
                    <li><Link to="/details">Privacy Policy</Link></li>
                    <li><Link to="/details">Insurance</Link></li>
                </ul>
            </div>

            <div className="footer-col">
                <h4>CONTACT</h4>
                <ul>
                    <li><span>1234 Luxury Drive</span></li>
                    <li><span>San Francisco, CA 94107</span></li>
                    <li><span>+1 (555) 123-4567</span></li>
                    <li><span>vehicle@example.com</span></li>
                </ul>
            </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
            <div className="copyright">© 2026 Vental. All rights reserved.</div>
        </div>
    </footer>
);