import { supabase } from "../lib/supabase";

export const getVehicles = async () => {
  return await supabase.from("vehicles").select("*");
};

export const addVehicle = async (vehicle) => {
  return await supabase.from("vehicles").insert([vehicle]);
};

export const deleteVehicle = async (id) => {
  return await supabase.from("vehicles").delete().eq("id", id);
};