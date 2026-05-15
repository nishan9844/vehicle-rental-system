import { supabase } from "../lib/supabase";

export async function getPayments() {
    const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("id", { ascending: false });

    if (error) throw error;

    return data || [];
}

export async function getPaymentById(id) {
    const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;

    return data;
}

export async function createPayment(payment) {
    const { data, error } = await supabase
        .from("payments")
        .insert([payment])
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function updatePayment(id, payment) {
    const { data, error } = await supabase
        .from("payments")
        .update(payment)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function updatePaymentStatus(id, status) {
    return updatePayment(id, { status });
}

export async function deletePayment(id) {
    const { error } = await supabase
        .from("payments")
        .delete()
        .eq("id", id);

    if (error) throw error;

    return true;
}