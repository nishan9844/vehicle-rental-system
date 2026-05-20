import { supabase } from '../lib/supabase';

export const loginUser = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
};

export const isAdmin = async () => {
  const { data } = await supabase.auth.getUser();
  if (!data?.user) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  return profile?.role === 'admin';
};
