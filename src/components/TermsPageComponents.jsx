import React from "react";

export function TermsHero() {
    return (
        <section className="terms-hero">
            <div className="container">
                <span className="terms-tagline">LEGAL</span>
                <h1 className="terms-hero-title">Terms & Conditions</h1>
                <p className="terms-hero-desc">
                    Please read these terms carefully before using Vental's vehicle rental services.
                    Last updated: April 2026.
                </p>
            </div>
        </section>
    );
}

export function TermsContent() {
    const sections = [
        {
            title: "1. Acceptance of Terms",
            content: `By accessing or using Vental's website and vehicle rental services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use our services. These terms apply to all users, including browsers, renters, and contributors of content.`
        },
        {
            title: "2. Eligibility Requirements",
            content: `To rent a vehicle through Vental, you must be at least 21 years of age and hold a valid driver's license issued by the Government of Nepal or an International Driving Permit (IDP). You must provide a valid government-issued identification document (citizenship, passport, or national ID) at the time of booking.`
        },
        {
            title: "3. Booking & Reservations",
            content: `All reservations are subject to vehicle availability. A confirmed booking requires a valid payment method and a security deposit. Vental reserves the right to cancel or modify reservations in the event of vehicle unavailability, safety concerns, or force majeure. All prices displayed on the platform are in Nepalese Rupees (NPR) and include applicable taxes unless stated otherwise.`
        },
        {
            title: "4. Rental Pricing & Payments",
            content: `Rental charges are calculated on a daily basis. The total amount includes the base rental fee, applicable taxes, insurance surcharges, and any additional services selected. Payment can be made via Credit/Debit Card, eSewa, or Khalti. A refundable security deposit of NPR 5,000 to NPR 50,000 (depending on vehicle category) is required at the time of booking.`
        },
        {
            title: "5. Vehicle Usage & Responsibilities",
            content: `The renter agrees to use the vehicle solely for lawful purposes and in accordance with all applicable traffic laws of Nepal. Prohibited activities include: sub-renting the vehicle, using it for racing or off-road purposes (unless specified), driving under the influence of alcohol or drugs, and transporting hazardous materials. The renter is responsible for all traffic violations and fines incurred during the rental period.`
        },
        {
            title: "6. Insurance & Liability",
            content: `All vehicles rented through Vental come with basic third-party insurance as required by law. Comprehensive insurance coverage is optional and can be purchased at an additional cost. In the event of an accident, the renter must immediately notify Vental and file a police report. The renter is liable for any damage to the vehicle that exceeds the coverage of the purchased insurance plan.`
        },
        {
            title: "7. Cancellation & Refund Policy",
            content: `Cancellations made 48 hours or more before the pickup time are eligible for a full refund. Cancellations made between 24-48 hours before pickup will receive a 50% refund. Cancellations made less than 24 hours before pickup are non-refundable. The security deposit will be refunded within 7-10 business days after the vehicle is returned in satisfactory condition.`
        },
        {
            title: "8. Vehicle Return",
            content: `Vehicles must be returned at the agreed-upon time and location. Late returns will incur additional charges at the daily rental rate plus a 25% surcharge. The vehicle must be returned in the same condition as received, with the same fuel level. Any damage, missing accessories, or excessive dirt may result in deductions from the security deposit.`
        },
        {
            title: "9. Privacy Policy",
            content: `Vental collects and processes personal data in accordance with Nepal's privacy regulations. Information collected includes name, contact details, driver's license information, and payment details. This data is used solely for the purpose of providing rental services and will not be shared with third parties without your consent, except as required by law.`
        },
        {
            title: "10. Limitation of Liability",
            content: `Vental shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the total rental amount paid by the renter. Vental is not responsible for personal belongings left in the vehicle during or after the rental period.`
        },
        {
            title: "11. Modifications to Terms",
            content: `Vental reserves the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting on the website. Continued use of the service after modifications constitutes acceptance of the updated terms. We encourage you to review these terms periodically.`
        },
        {
            title: "12. Governing Law",
            content: `These Terms & Conditions are governed by and construed in accordance with the laws of Nepal. Any disputes arising from these terms or the use of Vental's services shall be subject to the exclusive jurisdiction of the courts in Kathmandu, Nepal.`
        },
    ];

    return (
        <section className="terms-content">
            <div className="container">
                <div className="terms-body">
                    {sections.map((section, idx) => (
                        <div className="terms-section" key={idx}>
                            <h2>{section.title}</h2>
                            <p>{section.content}</p>
                        </div>
                    ))}
                    <div className="terms-footer-note">
                        <p>
                            If you have any questions about these Terms & Conditions, please contact us at{" "}
                            <a href="mailto:legal@vental.com">legal@vental.com</a> or call us at <a href="tel:+977014XXXXXX">+977 01-4XXXXXX</a>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
