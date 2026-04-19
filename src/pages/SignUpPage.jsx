import "../css/global.css";
import "../css/components.css";
import React from "react";
import { AuthImage, SignUpForm } from "../components/AuthPageComponents";
import signupImage from "../assets/images/signup.png";
import "../css/auth.css";

export default function SignUpPage() {
    return (
        <div className="auth-page">
            <div className="auth-layout">
                <AuthImage imageUrl={signupImage} />
                <div className="auth-form-container">
                    <SignUpForm />
                </div>
            </div>
        </div>
    );
}
