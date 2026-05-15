import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuUser } from "react-icons/lu";
import { supabase } from "../supabaseClient";
import "../css/navbar.css";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [profileName, setProfileName] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                fetchProfile(session.user.id);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
                fetchProfile(session.user.id);
            } else {
                setUser(null);
                setProfileName("");
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        const { data } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", userId)
            .single();
        
        if (data) {
            setProfileName(data.name || "User");
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
        setIsOpen(false);
    };

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
                        {user ? (
                            <div className="user-profile">
                                <div className="user-dropdown-container" style={{ position: 'relative' }}>
                                    <span className="user-name" onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: 'pointer' }}>
                                        <LuUser className="user-icon" /> {profileName}
                                    </span>
                                    {dropdownOpen && (
                                        <div className="user-dropdown">
                                            <Link to="/orders" className="dropdown-item" onClick={() => { setDropdownOpen(false); setIsOpen(false); }}>My Orders</Link>
                                        </div>
                                    )}
                                </div>
                                <button className="btn-logout" onClick={handleLogout}>Logout</button>
                            </div>
                        ) : (
                            <>
                                <Link to="/signin" onClick={toggleMenu}><button className="btn-login">Login</button></Link>
                                <Link to="/signup" onClick={toggleMenu}><button className="btn-signup">Sign up</button></Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};