import "../css/global.css";
import "../css/components.css";
import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { BookingHeader, BookingContent } from "../components/BookingPageComponents";
import "../css/booking.css";

export default function BookingPage() {
    return (
        <>
            <Navbar />
            <div className="container">
                <BookingHeader />
                <BookingContent />
            </div>
            <Footer />
        </>
    );
}
