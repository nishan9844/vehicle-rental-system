import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { TermsHero, TermsContent } from "../components/TermsPageComponents";
import "../css/terms.css";

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <TermsHero />
            <TermsContent />
            <Footer />
        </>
    );
}
