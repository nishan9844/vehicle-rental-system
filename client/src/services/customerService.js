import { supabase } from "../lib/supabase";
import { localCreate, localDelete, localGet, localList, localUpdate, shouldUseLocalData } from "./localStore";

export async function getCustomers() {
    if (shouldUseLocalData()) return localList("customers");

    try {
        const { data, error } = await supabase
            .from("customers")
            .select("*")
            .order("id", { ascending: false });

        if (error) throw error;

        return data || [];
    } catch {
        return localList("customers");
    }
}

export async function getCustomerById(id) {
    if (shouldUseLocalData()) return localGet("customers", id);

    try {
        const { data, error } = await supabase
            .from("customers")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;

        return data;
    } catch {
        return localGet("customers", id);
    }
}

export async function createCustomer(customer) {
    if (shouldUseLocalData()) return localCreate("customers", customer);

    try {
        const { data, error } = await supabase
            .from("customers")
            .insert([customer])
            .select()
            .single();

        if (error) throw error;

        return data;
    } catch {
        return localCreate("customers", customer);
    }
}

export async function updateCustomer(id, customer) {
    if (shouldUseLocalData()) return localUpdate("customers", id, customer);

    try {
        const { data, error } = await supabase
            .from("customers")
            .update(customer)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return data;
    } catch {
        return localUpdate("customers", id, customer);
    }
}

export async function updateCustomerStatus(id, status) {
    return updateCustomer(id, { status });
}

export async function updateCustomerVerification(id, verification) {
    return updateCustomer(id, { verification });
}

export async function deleteCustomer(id) {
    if (shouldUseLocalData()) return localDelete("customers", id);

    try {
        const { error } = await supabase
            .from("customers")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return true;
    } catch {
        return localDelete("customers", id);
    }
}
