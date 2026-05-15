import { supabase } from "../lib/supabase";

export async function getCustomers() {
    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("id", { ascending: false });

    if (error) throw error;

    return data || [];
}

export async function getCustomerById(id) {
    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;

    return data;
}

export async function createCustomer(customer) {
    const { data, error } = await supabase
        .from("customers")
        .insert([customer])
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function updateCustomer(id, customer) {
    const { data, error } = await supabase
        .from("customers")
        .update(customer)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function updateCustomerStatus(id, status) {
    return updateCustomer(id, { status });
}

export async function updateCustomerVerification(id, verification) {
    return updateCustomer(id, { verification });
}

export async function deleteCustomer(id) {
    const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", id);

    if (error) throw error;

    return true;
}