import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function PaymentVerifyPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [message, setMessage] = useState("Verifying your payment, please wait...");
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const verify = async () => {
            const pidx = searchParams.get("pidx");

            if (!pidx) {
                setMessage("Invalid verification link.");
                setSuccess(false);
                return;
            }

            try {
                const res = await fetch(`${BACKEND_URL}/api/khalti/verify`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ pidx }),
                });

                const contentType = res.headers.get("content-type");

                if (!contentType || !contentType.includes("application/json")) {
                    const text = await res.text();
                    console.error("Non-JSON response:", text);
                    throw new Error("Backend returned HTML instead of JSON.");
                }

                const data = await res.json();

                if (res.ok && data.success) {
                    const { error } = await supabase
                        .from("bookings")
                        .update({
                            status: "confirmed",
                            payment_status: "paid",
                        })
                        .eq("id", data.booking_id);

                    if (error) throw error;

                    setMessage("Payment successful! Your booking is confirmed.");
                    setSuccess(true);

                    setTimeout(() => {
                        navigate("/orders");
                    }, 3000);
                } else {
                    setMessage(`Payment not completed. Status: ${data.status || "Unknown"}`);
                    setSuccess(false);
                }
            } catch (err) {
                console.error(err);
                setMessage("An error occurred while verifying payment: " + err.message);
                setSuccess(false);
            }
        };

        verify();
    }, [searchParams, navigate]);

    return (
        <>
            <Navbar />

            <div
                style={{
                    padding: "120px 24px",
                    textAlign: "center",
                    minHeight: "60vh",
                }}
            >
                <div
                    style={{
                        display: "inline-block",
                        padding: "48px",
                        borderRadius: "16px",
                        background:
                            success === true
                                ? "#f0fff4"
                                : success === false
                                    ? "#fff5f5"
                                    : "#f8fafc",
                        border: `1px solid ${success === true
                                ? "#68d391"
                                : success === false
                                    ? "#fc8181"
                                    : "#e2e8f0"
                            }`,
                    }}
                >
                    <h2
                        style={{
                            color:
                                success === true
                                    ? "#276749"
                                    : success === false
                                        ? "#c53030"
                                        : "#2d3748",
                            marginBottom: "16px",
                        }}
                    >
                        Payment Verification
                    </h2>

                    <p style={{ color: "#4a5568", fontSize: "16px" }}>
                        {message}
                    </p>

                    {success === false && (
                        <button
                            onClick={() => navigate("/")}
                            style={{
                                marginTop: "24px",
                                padding: "12px 24px",
                                background: "#3182ce",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                            }}
                        >
                            Go Home
                        </button>
                    )}

                    {success === true && (
                        <p
                            style={{
                                marginTop: "16px",
                                fontSize: "13px",
                                color: "#718096",
                            }}
                        >
                            Redirecting to your orders...
                        </p>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
