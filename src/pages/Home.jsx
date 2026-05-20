import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Hero, SearchBar, VehicleCategories, TopChoice, Testimonials } from "../components/HomepageComponents";
import "../css/home.css";

export default function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <SearchBar />
            <VehicleCategories />
            <TopChoice />
            <Testimonials />
            <Footer />
        </>
    );
}