import { useState, useEffect } from "react";
import { createBooking } from "../services/bookingService";
import { supabase } from "../lib/supabase";
import { payWithKhalti } from "../components/KhaltiButton";
import ReviewsSection from "../components/ReviewsSection";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function Dashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setLoading(false); return; }
            const { data } = await supabase
                .from("bookings")
                .select("*, vehicles(name)")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });
            if (data) setBookings(data);
            setLoading(false);
        };
        fetchBookings();
    }, []);

    const handlePayWithKhalti = async (booking) => {
        try {
            await payWithKhalti({
                bookingId: booking.id,
                amount: booking.total_price,
                customerName: booking.full_name || "Customer",
                customerEmail: booking.email || "",
                customerPhone: booking.phone || "",
            });
        } catch (err) {
            alert("Payment error: " + err.message);
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ padding: "60px 24px", maxWidth: "900px", margin: "0 auto" }}>
                <h1>My Dashboard</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : bookings.length === 0 ? (
                    <p>No bookings yet. <a href="/listing">Browse vehicles</a></p>
                ) : (
                    <div>
                        {bookings.map((booking) => (
                            <div key={booking.id} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                                <p><strong>Vehicle:</strong> {booking.vehicles?.name || "N/A"}</p>
                                <p><strong>Status:</strong> {booking.status}</p>
                                <p><strong>Total:</strong> NPR {Number(booking.total_price).toFixed(2)}</p>
                                {booking.payment_status === "unpaid" && (
                                    <button onClick={() => handlePayWithKhalti(booking)}
                                        style={{ marginTop: "8px", padding: "8px 16px", background: "#5C2D91", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                                        Pay with Khalti
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <ReviewsSection />
            </div>
            <Footer />
        </>
    );
}
