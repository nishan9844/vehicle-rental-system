import { supabase } from "../lib/supabase";

export async function getBookings() {
    const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("id", { ascending: false });

    if (error) throw error;

    return data || [];
}

export async function getBookingById(id) {
    const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;

    return data;
}

export async function createBooking(booking) {
    const { data, error } = await supabase
        .from("bookings")
        .insert([booking])
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function updateBooking(id, booking) {
    const { data, error } = await supabase
        .from("bookings")
        .update(booking)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function updateBookingStatus(id, status) {
    return updateBooking(id, { status });
}

export async function deleteBooking(id) {
    const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", id);

    if (error) throw error;

    return true;
}
