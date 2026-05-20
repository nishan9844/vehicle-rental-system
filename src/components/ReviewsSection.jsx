import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ReviewsSection() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("reviews")
            .select(`id, rating, body, created_at, profiles(name, email)`)
            .order("created_at", { ascending: false })
            .limit(5);
        if (!error && data) setReviews(data);
        setLoading(false);
    };

    const averageRating =
        reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
            : "0.0";

    return (
        <div style={{ background: "#111827", border: "1px solid #374151", borderRadius: "12px", padding: "24px", marginTop: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                    <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "700", margin: "0 0 4px 0" }}>Customer Reviews</h2>
                    <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>Latest feedback from users</p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#fbbf24", fontSize: "24px", fontWeight: "700", margin: 0 }}>{averageRating}</p>
                    <p style={{ color: "#9ca3af", fontSize: "12px", margin: 0 }}>Average Rating</p>
                </div>
            </div>

            {loading ? (
                <p style={{ color: "#9ca3af" }}>Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <div style={{ background: "#0a0e1a", border: "1px solid #374151", borderRadius: "8px", padding: "20px", textAlign: "center" }}>
                    <p style={{ color: "#9ca3af" }}>No reviews available yet.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {reviews.map((review) => (
                        <div key={review.id} style={{ background: "#0a0e1a", border: "1px solid #374151", borderRadius: "8px", padding: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                                <div>
                                    <h3 style={{ color: "#fff", fontWeight: "600", margin: "0 0 4px 0" }}>{review.profiles?.name || "Anonymous User"}</h3>
                                    <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>{review.profiles?.email || "No email"}</p>
                                </div>
                                <div style={{ color: "#fbbf24", fontSize: "18px" }}>
                                    {"★".repeat(Number(review.rating || 0))}
                                    <span style={{ color: "#374151" }}>{"★".repeat(5 - Number(review.rating || 0))}</span>
                                </div>
                            </div>
                            <p style={{ color: "#d1d5db", fontSize: "14px", marginTop: "12px" }}>{review.body}</p>
                            <p style={{ color: "#6b7280", fontSize: "12px", marginTop: "12px" }}>
                                {review.created_at ? new Date(review.created_at).toLocaleDateString() : ""}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
