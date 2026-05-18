import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
    PaymentHeader,
    PaymentMain,
    PaymentSidebar,
} from "../components/PaymentPageComponents";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../css/payment.css";

export default function PaymentPage() {
    const [method, setMethod] = useState("card");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const bookingId = searchParams.get("booking_id");
    const heldBooking = location.state?.bookingData;
    const heldVehicle = location.state?.vehicle;

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [cardData, setCardData] = useState({
        cardholder_name: "",
        card_number: "",
        expiry: "",
        cvv: "",
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
            const { data, error } = await supabase
                .from("bookings")
                .select("*, vehicles(*)")
                .eq("id", bookingId)
                .single();

            if (!error && data) {
                setBooking(data);
            }

            setLoading(false);
        };

        fetchBooking();
    }, [bookingId, heldBooking, heldVehicle]);

    const assertVehicleAvailable = async (bookingToCheck) => {
        if (!bookingToCheck?.vehicle_id || !bookingToCheck?.pickup_date || !bookingToCheck?.return_date) {
            return;
        }

        let query = supabase
            .from("bookings")
            .select("id")
            .eq("vehicle_id", bookingToCheck.vehicle_id)
            .in("status", ["pending", "confirmed", "active"])
            .lte("pickup_date", bookingToCheck.return_date)
            .gte("return_date", bookingToCheck.pickup_date)
            .limit(1);

        if (bookingToCheck.id) {
            query = query.neq("id", bookingToCheck.id);
        }

        const { data, error } = await query;
        if (error) throw error;

        if (data && data.length > 0) {
            throw new Error("This vehicle is already booked for the selected dates. Please choose another vehicle or different dates.");
        }
    };

    const handlePayment = async (e) => {
        if (e) e.preventDefault();

        if (!booking) {
            alert("No booking found.");
            return;
        }

        setProcessing(true);

        try {
            await assertVehicleAvailable(booking);

            if (method === "card") {
                const form = document.getElementById("cardPaymentForm");

                if (form && !form.checkValidity()) {
                    form.reportValidity();
                    setProcessing(false);
                    return;
                }

                if (heldBooking) {
                    const { error } = await supabase
                        .from("bookings")
                        .insert([{ ...heldBooking, status: "confirmed", payment_status: "paid" }]);

                    if (error) throw error;
                } else {
                    const { error } = await supabase
                        .from("bookings")
                        .update({ status: "confirmed", payment_status: "paid" })
                        .eq("id", booking.id);

                    if (error) throw error;
                }

                alert("Payment Successful! Your booking is confirmed.");
                navigate("/orders");
                return;
            }

            if (method === "esewa") {
                alert("eSewa integration coming soon. Please use Card or Khalti.");
                setProcessing(false);
                return;
            }

            if (method === "khalti") {
                let bookingIdToUse = booking.id;

                if (heldBooking) {
                    const { data: inserted, error: insertError } = await supabase
                        .from("bookings")
                        .insert([{ ...heldBooking, status: "pending" }])
                        .select()
                        .single();

                    if (insertError) throw insertError;

                    bookingIdToUse = inserted.id;
                }

                const res = await fetch("http://localhost:5000/api/khalti/initiate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        booking_id: bookingIdToUse,
                        amount_npr: booking.total_price,
                        customer_name: booking.full_name || heldBooking?.full_name || "Customer",
                        customer_email: booking.email || heldBooking?.email || "",
                        customer_phone: booking.phone || heldBooking?.phone || "",
                    }),
                });

                const contentType = res.headers.get("content-type");

                if (!contentType || !contentType.includes("application/json")) {
                    const text = await res.text();
                    console.error("Non-JSON response:", text);
                    throw new Error(
                        "Backend returned HTML instead of JSON. Check backend URL and server."
                    );
                }

                const data = await res.json();

                if (!res.ok || !data.payment_url) {
                    throw new Error(
                        data.message || data.error || "Failed to initiate Khalti payment"
                    );
                }

                window.location.href = data.payment_url;
                return;
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Error processing payment: " + error.message);
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: "100px", textAlign: "center" }}>
                Loading payment details...
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container" style={{ maxWidth: "1000px", padding: "60px 24px" }}>
                <PaymentHeader />

                <div className="payment-layout">
                    <PaymentMain
                        method={method}
                        setMethod={setMethod}
                        cardData={cardData}
                        setCardData={setCardData}
                    />

                    <PaymentSidebar
                        onConfirm={handlePayment}
                        booking={booking}
                        processing={processing}
                    />
                </div>
            </div>

            <Footer />
        </>
    );
}
