import React from "react";
import { Link } from "react-router-dom";
import { LuCompass, LuArrowLeft } from "react-icons/lu";

export function NotFoundContent() {
    return (
        <div className="error-container">
            <div className="error-visual">
                <span className="error-code bg-text">4</span>
                <div className="error-icon-circle">
                    <LuCompass className="error-icon" />
                    <div className="icon-slash"></div>
                </div>
                <span className="error-code bg-text">4</span>
            </div>

            <h1 className="error-title">Page Not Found</h1>
            <p className="error-desc">It seems you've wandered off the grid. The coordinates you entered are unreachable.</p>

            <Link to="/" className="btn btn-primary" style={{ borderRadius: "30px", padding: "12px 24px" }}>
                <LuArrowLeft style={{ width: "16px", marginRight: "8px" }} /> Return to Dashboard
            </Link>
        </div>
    );
}

export default function NotFoundPageComponents() {
    return <NotFoundContent />;
}
