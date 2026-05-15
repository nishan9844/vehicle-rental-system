import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

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
            .select(`
        id,
        rating,
        body,
        created_at,
        profiles (
          name,
          email
        )
      `)
            .order("created_at", { ascending: false })
            .limit(5);

        if (!error && data) {
            setReviews(data);
        }

        setLoading(false);
    };

    const averageRating =
        reviews.length > 0
            ? (
                reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
                reviews.length
            ).toFixed(1)
            : "0.0";

    return (
        <div className="bg-[#111827] border border-gray-700 rounded-xl p-6 mt-6">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-xl font-bold text-white">Customer Reviews</h2>
                    <p className="text-gray-400 text-sm">
                        Latest feedback from users
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-400">{averageRating}</p>
                    <p className="text-xs text-gray-400">Average Rating</p>
                </div>
            </div>

            {loading ? (
                <p className="text-gray-400">Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <div className="bg-[#0a0e1a] border border-gray-700 rounded-lg p-5 text-center">
                    <p className="text-gray-400">No reviews available yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-[#0a0e1a] border border-gray-700 rounded-lg p-4"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-white font-semibold">
                                        {review.profiles?.name || "Anonymous User"}
                                    </h3>

                                    <p className="text-gray-500 text-xs">
                                        {review.profiles?.email || "No email"}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 text-yellow-400">
                                    {"★".repeat(Number(review.rating || 0))}
                                    <span className="text-gray-500">
                                        {"★".repeat(5 - Number(review.rating || 0))}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-300 text-sm mt-3">
                                {review.body}
                            </p>

                            <p className="text-gray-500 text-xs mt-3">
                                {review.created_at
                                    ? new Date(review.created_at).toLocaleDateString()
                                    : ""}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
