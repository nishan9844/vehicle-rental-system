import React from "react";
import { LuApple, LuUser, LuAtSign, LuLock } from "react-icons/lu";
import { Link } from "react-router-dom";

export function AuthImage({ imageUrl }) {
    return (
        <div className="auth-image">
            <div className="auth-image-bg" style={{ backgroundImage: `url('${imageUrl}')` }}></div>
        </div>
    );
}

export function SignInForm() {
    return (
        <div className="auth-card">
            <div className="auth-header">
                <h2>Welcome Back</h2>
                <p className="text-muted">Elevate your driving experience</p>
            </div>

            <div className="auth-toggle">
                <Link to="/signin" className="toggle-btn active">Sign In</Link>
                <Link to="/signup" className="toggle-btn">Create Account</Link>
            </div>

            <form className="auth-form" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                console.log("Sign In Attempt:", Object.fromEntries(formData));
                alert("Sign In details sent to backend!");
            }} method="POST">
                <div className="form-group">
                    <label>EMAIL ADDRESS</label>
                    <div className="input-with-icon">
                        <input type="email" name="email" placeholder="name@luxe-drive.com" required />
                    </div>
                </div>

                <div className="form-group">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <label>PASSWORD</label>
                        <a href="#" className="text-primary" style={{ fontSize: "11px", fontWeight: "600" }}>Forgot?</a>
                    </div>
                    <div className="input-with-icon">
                        <input type="password" name="password" placeholder="••••••••" required />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block auth-btn">SIGN IN</button>
            </form>

            <div className="auth-divider">
                <span>OR CONTINUE WITH</span>
            </div>

            <div className="oauth-buttons">
                <button className="oauth-btn">
                    <img src="https://cdn.iconscout.com/icon/free/png-256/free-google-160-189824.png" alt="Google" width="20" />
                    Google
                </button>
                <button className="oauth-btn">
                    <LuApple style={{ width: "20px" }} />
                    Apple
                </button>
            </div>
        </div>
    );
}

export function SignUpForm() {
    return (
        <div className="auth-card">
            <div className="auth-header text-left">
                <div className="text-primary" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1px", marginBottom: "8px" }}>
                    PREMIUM ACCESS
                </div>
                <h2>Experience Luxury.</h2>
            </div>

            <div className="auth-toggle" style={{ marginBottom: "32px" }}>
                <Link to="/signin" className="toggle-btn">Sign In</Link>
                <Link to="/signup" className="toggle-btn active">Create Account</Link>
            </div>

            <form className="auth-form" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                console.log("Sign Up Attempt:", Object.fromEntries(formData));
                alert("Sign Up details sent to backend!");
            }} method="POST">
                <div className="form-group">
                    <label>FULL NAME</label>
                    <div className="input-with-icon">
                        <LuUser className="icon" />
                        <input type="text" name="fullName" placeholder="Julian Vane" style={{ paddingLeft: "44px" }} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>EMAIL ADDRESS</label>
                    <div className="input-with-icon">
                        <LuAtSign className="icon" />
                        <input type="email" name="email" placeholder="vane@velocity.club" style={{ paddingLeft: "44px" }} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>SECURE PASSWORD</label>
                    <div className="input-with-icon">
                        <LuLock className="icon" />
                        <input type="password" name="password" placeholder="••••••••" style={{ paddingLeft: "44px" }} required />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block auth-btn">Create Account</button>
            </form>

            <div className="auth-divider">
                <span>OR REGISTER WITH</span>
            </div>

            <div className="oauth-buttons">
                <button className="oauth-btn">
                    <img src="https://cdn.iconscout.com/icon/free/png-256/free-google-160-189824.png" alt="Google" width="20" />
                    Google
                </button>
                <button className="oauth-btn">
                    <LuApple style={{ width: "20px" }} />
                    Apple
                </button>
            </div>

            <p className="text-center" style={{ marginTop: "24px", fontSize: "12px", color: "var(--text-muted)" }}>
                Already part of the Vental? <Link to="/signin" className="text-primary font-medium">Sign In</Link>
            </p>
        </div>
    );
}
