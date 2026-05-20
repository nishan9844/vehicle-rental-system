import React, { useEffect, useState } from "react";
import { LuApple, LuUser, LuAtSign, LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ADMIN_URL = process.env.REACT_APP_ADMIN_URL || "http://localhost:5173";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const PUBLIC_SITE_URL = (process.env.REACT_APP_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, "");
const PENDING_SIGNUP_KEY = "ventalPendingSignup";

const getStoredPendingSignup = () => {
    try {
        const pending = JSON.parse(localStorage.getItem(PENDING_SIGNUP_KEY) || "null");

        if (!pending?.fullName || !pending?.email || !pending?.password) {
            return null;
        }

        if (Date.now() - Number(pending.createdAt || 0) > 30 * 60 * 1000) {
            localStorage.removeItem(PENDING_SIGNUP_KEY);
            return null;
        }

        return pending;
    } catch {
        localStorage.removeItem(PENDING_SIGNUP_KEY);
        return null;
    }
};

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
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const finishMagicLinkSignup = async () => {
            const hasAuthParams =
                window.location.search.includes("code=") ||
                window.location.hash.includes("access_token") ||
                window.location.hash.includes("refresh_token");

            if (!hasAuthParams) return;

            setError("");
            setSuccess("Email verified. Finishing your account...");
            setLoading(true);

            try {
                const pending = getStoredPendingSignup();

                if (!pending) {
                    throw new Error("Email verified. Please create your account again so we can attach your password to it.");
                }

                const code = new URLSearchParams(window.location.search).get("code");

                if (code) {
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                    if (exchangeError) throw new Error(exchangeError.message);
                    window.history.replaceState({}, document.title, window.location.pathname);
                }

                const { data, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) throw new Error(sessionError.message);

                const accessToken = data?.session?.access_token;

                if (!accessToken) {
                    throw new Error("Email verified, but no secure session was returned. Please request a new magic link.");
                }

                const res = await fetch(`${BACKEND_URL}/api/auth/signup/complete`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        fullName: pending.fullName,
                        email: pending.email,
                        password: pending.password,
                    }),
                });

                const contentType = res.headers.get("content-type") || "";

                if (!contentType.includes("application/json")) {
                    throw new Error("Signup service is not responding correctly. Please check the backend server.");
                }

                const result = await res.json();

                if (!res.ok || !result.success) {
                    throw new Error(result.message || "Sign up failed. Please try again.");
                }

                localStorage.removeItem(PENDING_SIGNUP_KEY);
                await supabase.auth.signOut();
                setSuccess("Email verified and account created. You can sign in now.");
            } catch (err) {
                setError(err.message || "Email was verified, but account creation could not finish.");
            } finally {
                setLoading(false);
            }
        };

        finishMagicLinkSignup();
    }, []);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw new Error(authError.message);

            const userId = data?.user?.id;

            if (!userId) {
                throw new Error("Sign in failed. Please try again.");
            }

            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", userId)
                .single();

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
                    background: "#FEE2E2",
                    border: "1px solid #FCA5A5",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    marginBottom: "16px",
                    fontSize: "13px",
                    color: "#DC2626",
                    fontWeight: 500,
                }}>
                    {error}
                </div>
            )}

            {success && (
                <div style={{
                    background: "#D1FAE5",
                    border: "1px solid #6EE7B7",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    marginBottom: "16px",
                    fontSize: "13px",
                    color: "#065F46",
                    fontWeight: 500,
                }}>
                    {success}
                </div>
            )}

            <form className="auth-form" onSubmit={handleSignIn}>
                <div className="form-group">
                    <label>EMAIL ADDRESS</label>
                    <div className="input-with-icon">
                        <input
                            type="email"
                            name="email"
                            placeholder="name@luxe-drive.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <label>PASSWORD</label>
                        <button
                            type="button"
                            className="text-primary"
                            style={{
                                fontSize: "11px",
                                fontWeight: "600",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                            }}
                        >
                            Forgot?
                        </button>
                    </div>

                    <div className="input-with-icon">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingRight: "44px" }}
                            required
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((value) => !value)}
                            style={{
                                position: "absolute",
                                right: "14px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                border: "none",
                                background: "transparent",
                                color: "var(--text-muted)",
                                cursor: "pointer",
                                padding: 0,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-block auth-btn"
                    disabled={loading}
                    style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                >
                    {loading ? "SIGNING IN..." : "SIGN IN"}
                </button>
            </form>

            <div className="auth-divider"><span>OR CONTINUE WITH</span></div>

            <div className="oauth-buttons">
                <button type="button" className="oauth-btn">
                    <img src="https://cdn.iconscout.com/icon/free/png-256/free-google-160-189824.png" alt="Google" width="20" />
                    Google
                </button>
                <button type="button" className="oauth-btn">
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
    const [showPassword, setShowPassword] = useState(false);
    const [linkSent, setLinkSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const savePendingSignup = ({ cleanName, cleanEmail }) => {
        localStorage.setItem(
            PENDING_SIGNUP_KEY,
            JSON.stringify({
                fullName: cleanName,
                email: cleanEmail,
                password,
                createdAt: Date.now(),
            })
        );
    };

    const getPendingSignup = () => {
        return getStoredPendingSignup();
    };

    const completeSignupWithSession = async ({ accessToken, cleanName, cleanEmail, signupPassword }) => {
        if (!accessToken) {
            throw new Error("Email was verified, but no secure session was returned. Please request a new magic link.");
        }

        const res = await fetch(`${BACKEND_URL}/api/auth/signup/complete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                fullName: cleanName,
                email: cleanEmail,
                password: signupPassword,
            }),
        });

        const contentType = res.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
            throw new Error("Signup service is not responding correctly. Please check the backend server.");
        }

        const data = await res.json();

        if (!res.ok || !data.success) {
            throw new Error(data.message || "Sign up failed. Please try again.");
        }

        localStorage.removeItem(PENDING_SIGNUP_KEY);
        await supabase.auth.signOut();
        setSuccess("Email verified and account created. You can sign in now.");
        setTimeout(() => navigate("/signin"), 1800);
    };

    useEffect(() => {
        const finishMagicLinkSignup = async () => {
            const pending = getPendingSignup();
            const hasAuthParams =
                window.location.search.includes("code=") ||
                window.location.hash.includes("access_token") ||
                window.location.hash.includes("refresh_token");

            if (!pending || !hasAuthParams) return;

            setError("");
            setSuccess("Email verified. Finishing your account...");
            setLoading(true);

            try {
                const code = new URLSearchParams(window.location.search).get("code");

                if (code) {
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                    if (exchangeError) throw new Error(exchangeError.message);
                    window.history.replaceState({}, document.title, window.location.pathname);
                }

                const { data, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) throw new Error(sessionError.message);

                await completeSignupWithSession({
                    accessToken: data?.session?.access_token,
                    cleanName: pending.fullName,
                    cleanEmail: pending.email,
                    signupPassword: pending.password,
                });
            } catch (err) {
                setError(err.message || "Email was verified, but account creation could not finish.");
            } finally {
                setLoading(false);
            }
        };

        finishMagicLinkSignup();
        // Run once on page load to finish a Supabase magic-link redirect.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getValidatedSignup = () => {
        const cleanName = fullName.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (cleanName.length < 2) {
            throw new Error("Please enter your full name.");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            throw new Error("Please enter a valid email address.");
        }

        if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
            throw new Error("Password must be at least 8 characters and include one letter and one number.");
        }

        return { cleanName, cleanEmail };
    };

    const requestSignupLink = async ({ showResentMessage = false } = {}) => {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const { cleanName, cleanEmail } = getValidatedSignup();
            savePendingSignup({ cleanName, cleanEmail });

            const { error: linkError } = await supabase.auth.signInWithOtp({
                email: cleanEmail,
                options: {
                    shouldCreateUser: true,
                    emailRedirectTo: `${PUBLIC_SITE_URL}/signin`,
                    data: {
                        name: cleanName,
                        role: "user",
                    },
                },
            });

            if (linkError) throw new Error(linkError.message);

            setLinkSent(true);
            setSuccess(
                showResentMessage
                    ? `A new magic link was sent to ${cleanEmail}.`
                    : `We sent a magic link to ${cleanEmail}. Open that link in this browser to finish creating your account.`
            );
        } catch (err) {
            const message = err.message || "Could not send magic link.";

            if (message.toLowerCase().includes("email rate limit exceeded")) {
                setError("Too many signup emails were requested. Please wait a few minutes before trying again, or configure SMTP in Supabase.");
            } else {
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        await requestSignupLink();
    };

    return (
        <div className="auth-card">
            <div className="auth-header text-left">
                <div
                    className="text-primary"
                    style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "1px",
                        marginBottom: "8px",
                    }}
                >
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
                    background: "#FEE2E2",
                    border: "1px solid #FCA5A5",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    marginBottom: "16px",
                    fontSize: "13px",
                    color: "#DC2626",
                    fontWeight: 500,
                }}>
                    {error}
                </div>
            )}

            {success && (
                <div style={{
                    background: "#D1FAE5",
                    border: "1px solid #6EE7B7",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    marginBottom: "16px",
                    fontSize: "13px",
                    color: "#065F46",
                    fontWeight: 500,
                }}>
                    {success}
                </div>
            )}

            <form className="auth-form" onSubmit={handleSignUp}>
                <div className="form-group">
                    <label>FULL NAME</label>
                    <div className="input-with-icon">
                        <LuUser className="icon" />
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Julian Vane"
                            style={{ paddingLeft: "44px", paddingRight: "44px" }}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={linkSent || loading}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>EMAIL ADDRESS</label>
                    <div className="input-with-icon">
                        <LuAtSign className="icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="vane@velocity.club"
                            style={{ paddingLeft: "44px" }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={linkSent || loading}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>SECURE PASSWORD</label>
                    <div className="input-with-icon">
                        <LuLock className="icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            style={{ paddingLeft: "44px" }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={linkSent || loading}
                            minLength={8}
                            pattern="(?=.*[A-Za-z])(?=.*\d).{8,}"
                            title="Use at least 8 characters with one letter and one number."
                            required
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((value) => !value)}
                            disabled={linkSent || loading}
                            style={{
                                position: "absolute",
                                right: "14px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                border: "none",
                                background: "transparent",
                                color: "var(--text-muted)",
                                cursor: linkSent || loading ? "not-allowed" : "pointer",
                                padding: 0,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-block auth-btn"
                    disabled={loading}
                    style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                >
                    {loading ? "Sending Magic Link..." : (linkSent ? "Magic Link Sent" : "Create Account")}
                </button>

                {linkSent && (
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                        <button
                            type="button"
                            className="text-primary"
                            onClick={() => requestSignupLink({ showResentMessage: true })}
                            disabled={loading}
                            style={{
                                fontSize: "12px",
                                fontWeight: 700,
                                background: "none",
                                border: "none",
                                cursor: loading ? "not-allowed" : "pointer",
                                padding: 0,
                            }}
                        >
                            Resend magic link
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setLinkSent(false);
                                setError("");
                                setSuccess("");
                            }}
                            disabled={loading}
                            style={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: "var(--text-muted)",
                                background: "none",
                                border: "none",
                                cursor: loading ? "not-allowed" : "pointer",
                                padding: 0,
                            }}
                        >
                            Edit details
                        </button>
                    </div>
                )}
            </form>

            <div className="auth-divider"><span>OR REGISTER WITH</span></div>

            <div className="oauth-buttons">
                <button type="button" className="oauth-btn">
                    <img src="https://cdn.iconscout.com/icon/free/png-256/free-google-160-189824.png" alt="Google" width="20" />
                    Google
                </button>
                <button type="button" className="oauth-btn">
                    <LuApple style={{ width: "20px" }} /> Apple
                </button>
            </div>

            <p
                className="text-center"
                style={{ marginTop: "24px", fontSize: "12px", color: "var(--text-muted)" }}
            >
                Already part of the Vental?{" "}
                <Link to="/signin" className="text-primary font-medium">Sign In</Link>
            </p>
        </div>
    );
}
