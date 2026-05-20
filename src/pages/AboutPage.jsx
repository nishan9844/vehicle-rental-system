import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { AboutHero, AboutMission, AboutTeam, AboutContact } from "../components/AboutPageComponents";
import "../css/about.css";

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <AboutHero />
            <AboutMission />
            <AboutTeam />
            <AboutContact />
            <Footer />
        </>
    );
}
