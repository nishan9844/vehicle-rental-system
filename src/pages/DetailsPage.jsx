import "../css/global.css";
import "../css/components.css";
import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { DetailsHero, DetailsContent } from "../components/DetailsPageComponents";
import "../css/details.css";

export default function DetailsPage() {
    return (
        <>
            <Navbar />
            <div className="container">
                <DetailsHero />
                <DetailsContent />
            </div>
            <Footer />
        </>
    );
}
