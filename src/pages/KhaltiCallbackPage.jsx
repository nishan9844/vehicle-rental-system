import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function KhaltiCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [message, setMessage] = useState("Verifying your payment...");
    const [error, setError] = useState(null);

    useEffect(() => {
        const pidx = searchParams.get("pidx");
        const status = searchParams.get("status");
        const callbackBookingId = searchParams.get("purchase_order_id");
        const callbackTransactionId = searchParams.get("transaction_id");
        const callbackAmount = Number(searchParams.get("total_amount") || searchParams.get("amount") || 0) / 100;

        if (!pidx) {
            setError("Invalid callback: no pidx found.");
            return;
        }

        if (status && status !== "Completed") {
            setError(`Payment was not completed. Status: ${status}`);
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/khalti/verify`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        pidx,
                        booking_id: callbackBookingId,
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

                if (!res.ok || !data.success) {
                    throw new Error(data.message || "Verification failed");
                }

                if (callbackTransactionId || callbackAmount) {
                    console.info("Khalti callback metadata:", {
                        transactionId: data.transaction_id || callbackTransactionId || pidx,
                        amount: Number(data.amount_paisa || 0) / 100 || callbackAmount,
                    });
                }

                if (data.warning) console.warn(data.warning);

                setMessage("Payment verified! Your booking is confirmed. Redirecting...");

                setTimeout(() => {
                    navigate("/orders");
                }, 2500);
            } catch (err) {
                console.error("Khalti callback error:", err);
                setError("Payment verification failed: " + err.message);
            }
        };

        verify();
    }, [searchParams, navigate]);

    return (
        <div style={{ padding: "120px 24px", textAlign: "center", fontFamily: "sans-serif" }}>
            {error ? (
                <>
                    <h2 style={{ color: "#e53e3e" }}>Payment Error</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate("/")} style={{ marginTop: 16, padding: "10px 24px", cursor: "pointer" }}>
                        Return Home
                    </button>
                </>
            ) : (
                <>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>...</div>
                    <h2>{message}</h2>
                </>
            )}
        </div>
    );
}
