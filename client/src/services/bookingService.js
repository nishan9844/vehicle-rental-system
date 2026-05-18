import { supabase } from "../lib/supabase";
import { localCreate, localDelete, localGet, localList, localUpdate, shouldUseLocalData } from "./localStore";

export async function getBookings() {
    if (shouldUseLocalData()) return localList("bookings");

    try {
        const { data, error } = await supabase
            .from("bookings")
            .select("*, vehicles(name, brand, image_url, price_per_day)")
            .order("id", { ascending: false });

        if (error) throw error;

        return data || [];
    } catch {
        return localList("bookings");
    }
}

export async function getBookingById(id) {
    if (shouldUseLocalData()) return localGet("bookings", id);

    try {
        const { data, error } = await supabase
            .from("bookings")
            .select("*, vehicles(name, brand, image_url, price_per_day)")
            .eq("id", id)
            .single();

        if (error) throw error;

        return data;
    } catch {
        return localGet("bookings", id);
    }
}

export async function createBooking(booking) {
    if (shouldUseLocalData()) return localCreate("bookings", booking);

    try {
        const { data, error } = await supabase
            .from("bookings")
            .insert([booking])
            .select()
            .single();

        if (error) throw error;

        return data;
    } catch {
        return localCreate("bookings", booking);
    }
}

export async function updateBooking(id, booking) {
    if (shouldUseLocalData()) return localUpdate("bookings", id, booking);

    try {
        const { data, error } = await supabase
            .from("bookings")
            .update(booking)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return data;
    } catch {
        return localUpdate("bookings", id, booking);
    }
}

export async function updateBookingStatus(id, status) {
    return updateBooking(id, { status });
}

export async function deleteBooking(id) {
    if (shouldUseLocalData()) return localDelete("bookings", id);

    try {
        const { error } = await supabase
            .from("bookings")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return true;
    } catch {
        return localDelete("bookings", id);
    }
}
