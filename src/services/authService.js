import { supabase } from "../lib/supabase";

export const loginUser = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
};

export const isAdmin = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user?.user_metadata?.role === "admin";
};