import React, { useState } from "react";
import { LuApple, LuUser, LuAtSign, LuLock } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ADMIN_URL = process.env.REACT_APP_ADMIN_URL || "http://localhost:5173";

export function AuthImage({ imageUrl }) {
    return (
        <div className="auth-image">
            <div className="auth-image-bg" style={{ backgroundImage: `url('${imageUrl}')` }}></div>
        </div>
    );
}

export function SignInForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Step 1: Sign in with Supabase Auth
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw new Error(authError.message);

            const userId = data.user.id;

            // Step 2: Check role in profiles table
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", userId)
                .single();

            // If profile doesn't exist yet, just treat as regular user
            if (profileError && profileError.code !== "PGRST116") {
                throw new Error("Could not fetch user profile.");
            }

            if (profile?.role === "admin") {
                window.location.href = ADMIN_URL;
            } else {
                navigate("/");
            }
        } catch (err) {
            setError(err.message || "Sign in failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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

            {error && (
                <div style={{
                    background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "8px",
                    padding: "12px 16px", marginBottom: "16px", fontSize: "13px",
                    color: "#DC2626", fontWeight: 500,
                }}>
                    {error}
                </div>
            )}

            <form className="auth-form" onSubmit={handleSignIn}>
                <div className="form-group">
                    <label>EMAIL ADDRESS</label>
                    <div className="input-with-icon">
                        <input
                            type="email" name="email" placeholder="name@luxe-drive.com"
                            value={email} onChange={(e) => setEmail(e.target.value)} required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <label>PASSWORD</label>
                        <button type="button" className="text-primary" style={{ fontSize: "11px", fontWeight: "600", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Forgot?</button>                    </div>
                    <div className="input-with-icon">
                        <input
                            type="password" name="password" placeholder="••••••••"
                            value={password} onChange={(e) => setPassword(e.target.value)} required
                        />
                    </div>
                </div>

                <button
                    type="submit" className="btn btn-primary btn-block auth-btn"
                    disabled={loading}
                    style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                >
                    {loading ? "SIGNING IN..." : "SIGN IN"}
                </button>
            </form>

            <div className="auth-divider"><span>OR CONTINUE WITH</span></div>

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
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const { data: userData, error: authError } = await supabase.auth.signUp({ email, password });
            if (authError) throw new Error(authError.message);

            // upsert instead of insert — safe if account already exists
            const { error: profileError } = await supabase
                .from("profiles")
                .upsert([{ id: userData.user.id, name: fullName, email: email, role: "user" }]);

            if (profileError) throw new Error(profileError.message);

            setSuccess("Account created! Please check your email to confirm.");
            setTimeout(() => navigate("/signin"), 3000);
        } catch (err) {
            setError(err.message || "Sign up failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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

            {error && (
                <div style={{
                    background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "8px",
                    padding: "12px 16px", marginBottom: "16px", fontSize: "13px", color: "#DC2626", fontWeight: 500,
                }}>
                    {error}
                </div>
            )}
            {success && (
                <div style={{
                    background: "#D1FAE5", border: "1px solid #6EE7B7", borderRadius: "8px",
                    padding: "12px 16px", marginBottom: "16px", fontSize: "13px", color: "#065F46", fontWeight: 500,
                }}>
                    {success}
                </div>
            )}

            <form className="auth-form" onSubmit={handleSignUp}>
                <div className="form-group">
                    <label>FULL NAME</label>
                    <div className="input-with-icon">
                        <LuUser className="icon" />
                        <input type="text" name="fullName" placeholder="Julian Vane" style={{ paddingLeft: "44px" }}
                            value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                    </div>
                </div>
                <div className="form-group">
                    <label>EMAIL ADDRESS</label>
                    <div className="input-with-icon">
                        <LuAtSign className="icon" />
                        <input type="email" name="email" placeholder="vane@velocity.club" style={{ paddingLeft: "44px" }}
                            value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                </div>
                <div className="form-group">
                    <label>SECURE PASSWORD</label>
                    <div className="input-with-icon">
                        <LuLock className="icon" />
                        <input type="password" name="password" placeholder="••••••••" style={{ paddingLeft: "44px" }}
                            value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block auth-btn"
                    disabled={loading} style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                    {loading ? "Creating Account..." : "Create Account"}
                </button>
            </form>

            <div className="auth-divider"><span>OR REGISTER WITH</span></div>
            <div className="oauth-buttons">
                <button className="oauth-btn">
                    <img src="https://cdn.iconscout.com/icon/free/png-256/free-google-160-189824.png" alt="Google" width="20" />
                    Google
                </button>
                <button className="oauth-btn">
                    <LuApple style={{ width: "20px" }} /> Apple
                </button>
            </div>
            <p className="text-center" style={{ marginTop: "24px", fontSize: "12px", color: "var(--text-muted)" }}>
                Already part of the Vental? <Link to="/signin" className="text-primary font-medium">Sign In</Link>
            </p>
        </div>
    );
}
