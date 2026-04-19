import React from "react";
import "../css/global.css";
import "../css/components.css";
import "../css/notfound.css";
import { NotFoundContent } from "../components/NotFoundPageComponents";

export default function NotFoundPage() {
    return (
        <div className="error-page">
            <NotFoundContent />
        </div>
    );
}
