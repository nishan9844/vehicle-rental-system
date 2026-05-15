import { supabase } from "../lib/supabase";

const VEHICLE_COLUMNS = [
    "name",
    "brand",
    "type",
    "category",
    "seats",
    "price",
    "status",
    "image",
];

function normalizeVehiclePayload(vehicle) {
    return VEHICLE_COLUMNS.reduce((payload, column) => {
        const value = vehicle[column];

        if (column === "seats" || column === "price") {
            payload[column] = value === "" || value === null || value === undefined
                ? null
                : Number(value);
            return payload;
        }

        payload[column] = typeof value === "string" ? value.trim() : value;
        return payload;
    }, {});
}

export async function getVehicles() {
    const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("id", { ascending: false });

    if (error) throw error;

    return data;
}

export async function getVehicleById(id) {
    const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;

    return data;
}

export async function createVehicle(vehicle) {
    const payload = normalizeVehiclePayload(vehicle);

    const { data, error } = await supabase
        .from("vehicles")
        .insert([payload])
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function updateVehicle(id, vehicle) {
    const payload = normalizeVehiclePayload(vehicle);

    const { data, error } = await supabase
        .from("vehicles")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function deleteVehicle(id) {
    const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id);

    if (error) throw error;
}