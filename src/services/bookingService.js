import { supabase } from "../lib/supabase";

export const createBooking = async (booking) => {
  return await supabase.from("bookings").insert([booking]);
};

export const getUserBookings = async (userId) => {
  return await supabase.from("bookings").select("*").eq("user_id", userId);
};