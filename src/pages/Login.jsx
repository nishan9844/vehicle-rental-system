import "../css/global.css";
import "../css/components.css";
import React from "react";
import { AuthImage, SignInForm } from "../components/AuthPageComponents";
import loginImage from "../assets/images/login.png";
import "../css/auth.css";

export default function LoginPage() {
    return (
        <div className="auth-page">
            <div className="auth-layout">
                <AuthImage imageUrl={loginImage} />
                <div className="auth-form-container">
                    <SignInForm />
                    <p className="auth-footer-text">© 2024 LUXE DRIVE KINETIC. ALL RIGHTS RESERVED.</p>
                </div>
            </div>
        </div>
    );
}
