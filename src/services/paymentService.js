import { supabase } from "../lib/supabase";
import { adminApi, hasAdminApi } from "./adminApi";

const PAYMENT_WITH_BOOKING_SELECT = `
  *,
  bookings (
    id,
    full_name,
    email,
    total_price,
    pickup_date,
    return_date,
    vehicle_id,
    vehicles (name, image_url)
  )
`;

async function selectPaymentWithBooking(queryFactory) {
  const richResult = await queryFactory(PAYMENT_WITH_BOOKING_SELECT);

  if (!richResult.error) {
    return richResult;
  }

  console.warn(
    "Payment booking join unavailable, falling back to base payment rows:",
    richResult.error.message
  );

  return queryFactory("*");
}

export async function getPayments() {
  if (!supabase) return [];

  try {
    if (hasAdminApi()) {
      return await adminApi("/api/admin/payments");
    }

    const { data, error } = await selectPaymentWithBooking((columns) =>
      supabase
        .from("payments")
        .select(columns)
        .order("created_at", { ascending: false })
    );

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("getPayments error:", error.message);
    throw error;
  }
}

export async function getPaymentById(id) {
  if (!supabase) return null;

  try {
    const { data, error } = await selectPaymentWithBooking((columns) =>
      supabase
        .from("payments")
        .select(columns)
        .eq("id", id)
        .single()
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("getPaymentById error:", error.message);
    throw error;
  }
}

export async function createPayment(payment) {
  if (!supabase) throw new Error("Supabase not configured.");

  try {
    const { data, error } = await supabase
      .from("payments")
      .insert([payment])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("createPayment error:", error.message);
    throw error;
  }
}

export async function updatePayment(id, payment) {
  if (!supabase) throw new Error("Supabase not configured.");

  try {
    if (hasAdminApi()) {
      return await adminApi(`/api/admin/payments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payment),
      });
    }

    const { data, error } = await selectPaymentWithBooking((columns) =>
      supabase
        .from("payments")
        .update({
          ...payment,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select(columns)
        .single()
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("updatePayment error:", error.message);
    throw error;
  }
}

export async function updatePaymentStatus(id, status) {
  return updatePayment(id, { status });
}

export async function deletePayment(id) {
  if (!supabase) throw new Error("Supabase not configured.");

  try {
    if (hasAdminApi()) {
      await adminApi(`/api/admin/payments/${id}`, { method: "DELETE" });
      return true;
    }

    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("deletePayment error:", error.message);
    throw error;
  }
}
