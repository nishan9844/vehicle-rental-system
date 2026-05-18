import { supabase } from "../lib/supabase";
import { localCreate, localDelete, localGet, localList, localUpdate, shouldUseLocalData } from "./localStore";

export async function getPayments() {
    if (shouldUseLocalData()) return localList("payments");

    try {
        const { data, error } = await supabase
            .from("payments")
            .select("*")
            .order("id", { ascending: false });

        if (error) throw error;

        return data || [];
    } catch {
        return localList("payments");
    }
}

export async function getPaymentById(id) {
    if (shouldUseLocalData()) return localGet("payments", id);

    try {
        const { data, error } = await supabase
            .from("payments")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;

        return data;
    } catch {
        return localGet("payments", id);
    }
}

export async function createPayment(payment) {
    if (shouldUseLocalData()) return localCreate("payments", payment);

    try {
        const { data, error } = await supabase
            .from("payments")
            .insert([payment])
            .select()
            .single();

        if (error) throw error;

        return data;
    } catch {
        return localCreate("payments", payment);
    }
}

export async function updatePayment(id, payment) {
    if (shouldUseLocalData()) return localUpdate("payments", id, payment);

    try {
        const { data, error } = await supabase
            .from("payments")
            .update(payment)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return data;
    } catch {
        return localUpdate("payments", id, payment);
    }
}

export async function updatePaymentStatus(id, status) {
    return updatePayment(id, { status });
}

export async function deletePayment(id) {
    if (shouldUseLocalData()) return localDelete("payments", id);

    try {
        const { error } = await supabase
            .from("payments")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return true;
    } catch {
        return localDelete("payments", id);
    }
}
