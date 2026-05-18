import { supabase } from "../lib/supabase";
import { localCreate, localDelete, localGet, localList, localUpdate, shouldUseLocalData } from "./localStore";

const VEHICLE_COLUMNS = [
    "name",
    "brand",
    "vehicle_type",
    "fuel_type",
    "category",
    "transmission",
    "seats",
    "price_per_day",
    "status",
    "image_url",
    "description",
    "is_published",
];

function normalizeVehiclePayload(vehicle) {
    return VEHICLE_COLUMNS.reduce((payload, column) => {
        const value = vehicle[column];

        if (column === "seats" || column === "price_per_day") {
            payload[column] = value === "" || value === null || value === undefined
                ? null
                : Number(value);
            return payload;
        }

        if (column === "is_published") {
            payload[column] = value !== false;
            return payload;
        }

        payload[column] = typeof value === "string" ? value.trim() : value;
        return payload;
    }, {});
}

function normalizeVehicle(vehicle) {
    if (!vehicle) return vehicle;

    return {
        ...vehicle,
        type: vehicle.fuel_type,
        price: vehicle.price_per_day,
        image: vehicle.image_url,
        category: vehicle.vehicle_type || vehicle.category,
    };
}

export async function getVehicles() {
    if (shouldUseLocalData()) return localList("vehicles");

    try {
        const { data, error } = await supabase
            .from("vehicles")
            .select("*")
            .order("id", { ascending: false });

        if (error) throw error;

        return (data || []).map(normalizeVehicle);
    } catch {
        return localList("vehicles");
    }
}

export async function getVehicleById(id) {
    if (shouldUseLocalData()) return localGet("vehicles", id);

    try {
        const { data, error } = await supabase
            .from("vehicles")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;

        return normalizeVehicle(data);
    } catch {
        return localGet("vehicles", id);
    }
}

export async function createVehicle(vehicle) {
    if (shouldUseLocalData()) return localCreate("vehicles", vehicle);

    const payload = normalizeVehiclePayload(vehicle);

    try {
        const { data, error } = await supabase
            .from("vehicles")
            .insert([payload])
            .select()
            .single();

        if (error) throw error;

        return data;
    } catch {
        return localCreate("vehicles", vehicle);
    }
}

export async function updateVehicle(id, vehicle) {
    if (shouldUseLocalData()) return localUpdate("vehicles", id, vehicle);

    const payload = normalizeVehiclePayload(vehicle);

    try {
        const { data, error } = await supabase
            .from("vehicles")
            .update(payload)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return data;
    } catch {
        return localUpdate("vehicles", id, vehicle);
    }
}

export async function deleteVehicle(id) {
    if (shouldUseLocalData()) return localDelete("vehicles", id);

    try {
        const { error } = await supabase
            .from("vehicles")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return true;
    } catch {
        return localDelete("vehicles", id);
    }
}
