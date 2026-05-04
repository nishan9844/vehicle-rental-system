import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PaymentHeader, PaymentMain, PaymentSidebar } from "../components/PaymentPageComponents";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../css/payment.css";


export default function PaymentPage() {
    const [method, setMethod] = useState('card');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const bookingId = searchParams.get('booking_id');
    const heldBooking = location.state?.bookingData;
    const heldVehicle = location.state?.vehicle;
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [cardData, setCardData] = useState({
        cardholder_name: 'Johnathan Doe',
        card_number: '',
        expiry: '',
        cvv: ''
    });

    useEffect(() => {
        if (heldBooking) {
            setBooking({ ...heldBooking, vehicles: heldVehicle });
            setLoading(false);
            return;
        }

        if (!bookingId) {
            setLoading(false);
            return;
        }
        const fetchBooking = async () => {
            const { data } = await supabase.from('bookings').select('*, vehicles(*)').eq('id', bookingId).single();
            if (data) setBooking(data);
            setLoading(false);
        };
        fetchBooking();
    }, [bookingId, heldBooking, heldVehicle]);

    const handlePayment = async (e) => {
        if (e) e.preventDefault();
        if (!booking) {
            alert("No booking found to pay for.");
            return;
        }

        setProcessing(true);
        try {
            if (method === 'card') {
                const form = document.getElementById('cardPaymentForm');
                if (form && !form.checkValidity()) {
                    form.reportValidity();
                    setProcessing(false);
                    return;
                }
            }

            const backendPayload = {
                booking_id: booking.id,
                method: method,
                amount: booking.total_price,
                currency: 'NPR',
                ...(method === 'card' ? { card_details: cardData } : {})
            };

            // Simulating a POST request to the backend payment handler
            console.log("POST /api/process-payment", backendPayload);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency

            if (heldBooking) {
                // If it was a "held" booking, we finally insert it into the database now
                const { error: insertError } = await supabase.from('bookings').insert([{
                    ...heldBooking,
                    status: 'confirmed'
                }]);
                if (insertError) throw insertError;
            } else {
                // Otherwise, update the existing booking status
                const { error: bookingError } = await supabase.from('bookings')
                    .update({ status: 'confirmed' })
                    .eq('id', booking.id);
                if (bookingError) throw bookingError;
            }

            alert("Payment Successful! Your booking is confirmed.");
            navigate("/");

        } catch (error) {
            console.error("Payment error:", error);
            alert("Error processing payment: " + error.message);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Loading payment details...</div>;

    return (
        <>
            <Navbar />
            <div className="container" style={{ maxWidth: "1000px", padding: "60px 24px" }}>
                <PaymentHeader />
                <div className="payment-layout">
                    <PaymentMain method={method} setMethod={setMethod} cardData={cardData} setCardData={setCardData} />
                    <PaymentSidebar onConfirm={handlePayment} booking={booking} processing={processing} />
                </div>
            </div>
            <Footer />
        </>
    );
}
