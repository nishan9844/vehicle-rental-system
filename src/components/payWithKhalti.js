const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

async function getAccessToken() {
    const { supabase } = await import("../supabaseClient");
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
}

export const payWithKhalti = async ({
    bookingId,
    amount,
    customerName,
    customerEmail,
    customerPhone,
}) => {
    const amountNpr = Number(amount);

    if (!bookingId) {
        throw new Error("bookingId is required to initiate Khalti payment.");
    }

    if (!Number.isFinite(amountNpr) || amountNpr <= 0) {
        throw new Error("A valid positive amount is required for Khalti payment.");
    }

    const token = await getAccessToken();

    if (!token) {
        throw new Error("Please sign in again before starting Khalti payment.");
    }

    const res = await fetch(`${BACKEND_URL}/api/khalti/initiate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            booking_id: bookingId,
            amount_npr: amountNpr,
            customer_name: customerName || "Customer",
            customer_email: customerEmail || "",
            customer_phone: customerPhone || "",
        }),
    });

    const data = await res.json();

    if (!res.ok || !data.payment_url) {
        throw new Error(data.message || data.error || "Failed to initiate Khalti payment.");
    }

    window.location.href = data.payment_url;
};
