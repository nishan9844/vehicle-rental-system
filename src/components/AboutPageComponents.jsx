import React from "react";
import { LuShieldCheck, LuUsers, LuCar, LuMapPin, LuPhone, LuMail, LuClock } from "react-icons/lu";

export function AboutHero() {
    return (
        <section className="about-hero">
            <div className="container">
                <div className="about-hero-content">
                    <span className="about-tagline">ABOUT US</span>
                    <h1 className="about-hero-title">
                        Redefining the Way <span>You Drive</span>
                    </h1>
                    <p className="about-hero-desc">
                        At Vental, we believe that every journey should be extraordinary.
                        From premium electric vehicles to powerful superbikes, we deliver
                        a seamless rental experience crafted for modern adventurers.
                    </p>
                </div>
            </div>
        </section>
    );
}

export function AboutMission() {
    return (
        <section className="about-mission">
            <div className="container">
                <div className="mission-grid">
                    <div className="mission-card">
                        <div className="mission-icon">
                            <LuShieldCheck />
                        </div>
                        <h3>Our Mission</h3>
                        <p>
                            To revolutionize vehicle rental by combining cutting-edge technology
                            with unmatched customer service. We strive to make premium mobility
                            accessible to everyone, every day.
                        </p>
                    </div>
                    <div className="mission-card">
                        <div className="mission-icon">
                            <LuUsers />
                        </div>
                        <h3>Our Vision</h3>
                        <p>
                            To become the most trusted and innovative vehicle rental platform
                            in Nepal, setting new standards for quality, safety, and sustainability
                            in the mobility industry.
                        </p>
                    </div>
                    <div className="mission-card">
                        <div className="mission-icon">
                            <LuCar />
                        </div>
                        <h3>Our Values</h3>
                        <p>
                            We are driven by integrity, innovation, and a relentless commitment
                            to customer satisfaction. Every vehicle in our fleet represents our
                            promise of excellence.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function AboutTeam() {
    return (
        <section className="about-team">
            <div className="container">
                <h2 className="about-section-title">Meet Our Leadership</h2>
                <p className="about-section-sub">
                    A passionate team dedicated to transforming how you experience mobility.
                </p>
                <div className="team-grid">
                    {[
                        { name: "Abhishek Gora", role: "Founder & CEO", initials: "AG" },
                        { name: "Eluja Nepal", role: "Head of Operations", initials: "EN" },
                        { name: "Sapna Chaudhary", role: "Supervisor", initials: "SC" },
                        { name: "Nishan Pande", role: "Marketing Director", initials: "NP" },
                        { name: "Ashwin Giri", role: "Manager", initials: "AG" },
                        { name: "Saurav Tamang", role: "Receptionist", initials: "ST" },
                    ].map((member, idx) => (
                        <div className="team-card" key={idx}>
                            <div className="team-avatar">
                                <span>{member.initials}</span>
                            </div>
                            <h4 className="team-name">{member.name}</h4>
                            <p className="team-role">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function AboutContact() {
    return (
        <section className="about-contact">
            <div className="container">
                <h2 className="about-section-title">Get in Touch</h2>
                <p className="about-section-sub">
                    Have questions? We'd love to hear from you.
                </p>
                <div className="contact-grid">
                    <div className="contact-card">
                        <div className="contact-icon"><LuMapPin /></div>
                        <h4>Visit Us</h4>
                        <p>Kathmandu, Nepal<br />Naxal, Herald College</p>
                    </div>
                    <div className="contact-card">
                        <div className="contact-icon"><LuPhone /></div>
                        <h4>Call Us</h4>
                        <p><a href="tel:+97701111111">+977 01-1111111</a><br /><a href="tel:+9779800000000">+977 9800000000</a></p>
                    </div>
                    <div className="contact-card">
                        <div className="contact-icon"><LuMail /></div>
                        <h4>Email Us</h4>
                        <p><a href="mailto:info@vental.com">info@vental.com</a><br /><a href="mailto:support@vental.com">support@vental.com</a></p>
                    </div>
                    <div className="contact-card">
                        <div className="contact-icon"><LuClock /></div>
                        <h4>Working Hours</h4>
                        <p>Sun - Fri: 8AM - 8PM<br />Saturday: 10AM - 6PM</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
