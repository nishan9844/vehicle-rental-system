import { supabase } from "../lib/supabase";

const CUSTOMER_TABLE = "profiles";

// ─── helpers ────────────────────────────────────────────────────────────────

function toDatabaseCustomer(payload) {
    const next = { ...payload };

    if (next.status) {
        next.status = String(next.status).toUpperCase();
    }

    if (next.verification) {
        const value = String(next.verification).toLowerCase();
        if (["pending_doc", "pending", "pending doc"].includes(value)) {
            next.verification = "PENDING DOC";
        } else if (["licensed", "verified"].includes(value)) {
            next.verification = "VERIFIED";
        } else if (["suspicious", "rejected"].includes(value)) {
            next.verification = "REJECTED";
        } else {
            next.verification = String(next.verification).toUpperCase();
        }
    }

    next.updated_at = new Date().toISOString();
    return next;
}

// ─── GET ALL CUSTOMERS (with booking count + revenue from joins) ─────────────

export async function getCustomers() {
    if (!supabase) {
        console.warn("Supabase not configured.");
        return [];
    }

    try {
        // 1. Fetch all profiles
        const { data: profiles, error: profilesError } = await supabase
            .from(CUSTOMER_TABLE)
            .select("*")
            .order("created_at", { ascending: false });

        if (profilesError) throw profilesError;

        if (!profiles || profiles.length === 0) return [];

        // 2. Fetch all bookings (to compute per-customer counts + revenue)
        const { data: bookings, error: bookingsError } = await supabase
            .from("bookings")
            .select("id, user_id, total_price, status");

        if (bookingsError) {
            console.warn("Could not fetch bookings for customer enrichment:", bookingsError.message);
            // Return profiles without enrichment rather than failing completely
            return profiles;
        }

        // 3. Fetch all payments to compute per-customer revenue from paid payments
        const { data: payments, error: paymentsError } = await supabase
            .from("payments")
            .select("booking_id, amount, status");

        // Build a map: booking_id → payment info
        const paymentByBooking = {};
        if (!paymentsError && payments) {
            payments.forEach((p) => {
                if (p.status === "paid") {
                    paymentByBooking[p.booking_id] = (paymentByBooking[p.booking_id] || 0) + Number(p.amount || 0);
                }
            });
        }

        // 4. Build per-user stats
        const statsByUser = {};
        (bookings || []).forEach((b) => {
            const uid = b.user_id;
            if (!uid) return;
            if (!statsByUser[uid]) statsByUser[uid] = { bookings: 0, revenue: 0 };
            statsByUser[uid].bookings += 1;
            // Revenue = sum of paid payment amounts for this user's bookings
            // If no payment record, fall back to total_price when booking is confirmed/completed/active
            const paidAmount = paymentByBooking[b.id];
            if (paidAmount !== undefined) {
                statsByUser[uid].revenue += paidAmount;
            } else if (["confirmed", "completed", "active"].includes(String(b.status).toLowerCase())) {
                statsByUser[uid].revenue += Number(b.total_price || 0);
            }
        });

        // 5. Merge stats into profiles
        return profiles.map((profile) => ({
            ...profile,
            bookings: statsByUser[profile.id]?.bookings ?? 0,
            revenue: statsByUser[profile.id]?.revenue ?? 0,
        }));
    } catch (error) {
        console.error("getCustomers error:", error.message);
        return [];
    }
}

// ─── GET CUSTOMER BY ID ──────────────────────────────────────────────────────

export async function getCustomerById(id) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from(CUSTOMER_TABLE)
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;

        // Enrich with stats
        const { data: bookingData } = await supabase
            .from("bookings")
            .select("id, total_price, status")
            .eq("user_id", id);

        const bookingCount = bookingData?.length ?? 0;
        const revenue = (bookingData || [])
            .filter((b) => ["confirmed", "completed", "active"].includes(String(b.status).toLowerCase()))
            .reduce((sum, b) => sum + Number(b.total_price || 0), 0);

        return { ...data, bookings: bookingCount, revenue };
    } catch (error) {
        console.error("getCustomerById error:", error.message);
        return null;
    }
}

// ─── CREATE CUSTOMER ─────────────────────────────────────────────────────────

export async function createCustomer(customer) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from(CUSTOMER_TABLE)
            .insert([toDatabaseCustomer(customer)])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("createCustomer error:", error.message);
        throw error;
    }
}

// ─── UPDATE CUSTOMER ─────────────────────────────────────────────────────────

export async function updateCustomer(id, customer) {
    if (!supabase) throw new Error("Supabase not configured.");

    try {
        const { data, error } = await supabase
            .from(CUSTOMER_TABLE)
            .update(toDatabaseCustomer(customer))
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("updateCustomer error:", error.message);
        throw error;
    }
}

export async function updateCustomerStatus(id, status) {
    return updateCustomer(id, { status });
}

export async function updateCustomerVerification(id, verification) {
    return updateCustomer(id, { verification });
}

// ─── DELETE CUSTOMER ─────────────────────────────────────────────────────────

export async function deleteCustomer(id) {
    if (!supabase) throw new Error("Supabase not configured.");

    try {
        const { error } = await supabase
            .from(CUSTOMER_TABLE)
            .delete()
            .eq("id", id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error("deleteCustomer error:", error.message);
        throw error;
    }
}
