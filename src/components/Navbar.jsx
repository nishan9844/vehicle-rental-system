import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
                    <span className="logo-text">Vental</span>
                </Link>

                <button 
                    className={`hamburger ${isOpen ? "active" : ""}`} 
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>

                {isOpen && <div className="nav-overlay" onClick={toggleMenu}></div>}

                <div className={`nav-menu ${isOpen ? "open" : ""}`}>
                    <ul className="nav-links">
                        <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
                        <li><Link to="/listing" onClick={toggleMenu}>brands</Link></li>
                        <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
                    </ul>

                    <div className="nav-auth">
                        <Link to="/signin" onClick={toggleMenu}><button className="btn-login">Login</button></Link>
                        <Link to="/signup" onClick={toggleMenu}><button className="btn-signup">Sign up</button></Link>
                    </div>
                </div>
            </div>
        </header>
    );
};