import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PaymentHeader, PaymentMain, PaymentSidebar } from "../components/PaymentPageComponents";
import "../css/payment.css";


export default function PaymentPage() {
    const [method, setMethod] = useState('card');

    const handlePayment = (e) => {
        if (e) e.preventDefault();
        console.log("Initiating payment for method:", method);
        if (method === 'card') {
            const form = document.getElementById('cardPaymentForm');
            if (form) {
                const formData = new FormData(form);
                console.log("Card Data (POST):", Object.fromEntries(formData));
                alert("Processing Card Payment...");
            }
        } else {
            alert(`Redirecting to ${method} for secure transaction...`);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ maxWidth: "1000px", padding: "60px 24px" }}>
                <PaymentHeader />
                <div className="payment-layout">
                    <PaymentMain method={method} setMethod={setMethod} />
                    <PaymentSidebar onConfirm={handlePayment} />
                </div>
            </div>
            <Footer />
        </>
    );
}
