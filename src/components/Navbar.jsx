import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo" onClick={closeMenu}>
                    <span className="logo-text">Vental</span>
                </Link>

                <button
                    className={`hamburger ${menuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>

                {menuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}

                <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
                    <ul className="nav-links">
                        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                        <li><Link to="/listing" onClick={closeMenu}>Brands</Link></li>
                        <li><Link to="/about" onClick={closeMenu}>About</Link></li>
                    </ul>

                    <div className="nav-auth">
                        <Link to="/signin" onClick={closeMenu}><button className="btn-login">Login</button></Link>
                        <Link to="/signup" onClick={closeMenu}><button className="btn-signup">Sign up</button></Link>
                    </div>
                </div>
            </div>
        </header>
    );
};