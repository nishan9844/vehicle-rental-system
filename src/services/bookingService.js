import { supabase } from "../lib/supabase";
import { adminApi, hasAdminApi } from "./adminApi";

const BOOKING_WITH_VEHICLE_SELECT = `
  *,
  vehicles (name, image_url)
`;

async function selectBookingWithVehicle(queryFactory) {
  const richResult = await queryFactory(BOOKING_WITH_VEHICLE_SELECT);

  if (!richResult.error) {
    return richResult;
  }

  console.warn(
    "Booking vehicle join unavailable, falling back to base booking rows:",
    richResult.error.message
  );

  return queryFactory("*");
}

export async function getBookings() {
  if (!supabase) return [];

  try {
    if (hasAdminApi()) {
      return await adminApi("/api/admin/bookings");
    }

    const { data, error } = await selectBookingWithVehicle((columns) =>
      supabase
        .from("bookings")
        .select(columns)
        .order("created_at", { ascending: false })
    );

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("getBookings error:", error.message);
    throw error;
  }
}

export async function getBookingById(id) {
  if (!supabase) return null;

  try {
    const { data, error } = await selectBookingWithVehicle((columns) =>
      supabase
        .from("bookings")
        .select(columns)
        .eq("id", id)
        .single()
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("getBookingById error:", error.message);
    throw error;
  }
}

export async function createBooking(booking) {
  if (!supabase) throw new Error("Supabase not configured.");

  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert([booking])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("createBooking error:", error.message);
    throw error;
  }
}

export async function updateBooking(id, booking) {
  if (!supabase) throw new Error("Supabase not configured.");

  try {
    if (hasAdminApi()) {
      return await adminApi(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        body: JSON.stringify(booking),
      });
    }

    const { data, error } = await selectBookingWithVehicle((columns) =>
      supabase
        .from("bookings")
        .update({
          ...booking,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select(columns)
        .single()
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("updateBooking error:", error.message);
    throw error;
  }
}

export async function updateBookingStatus(id, status) {
  return updateBooking(id, { status });
}

export async function deleteBooking(id) {
  if (!supabase) throw new Error("Supabase not configured.");

  try {
    if (hasAdminApi()) {
      await adminApi(`/api/admin/bookings/${id}`, { method: "DELETE" });
      return true;
    }

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("deleteBooking error:", error.message);
    throw error;
  }
}
