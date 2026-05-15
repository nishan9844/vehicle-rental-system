import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tqewuukxjplrswaoeqau.supabase.co";
const supabaseKey = "sb_publishable_y01LVjhHfi5_XTeV58Yp8g_DQ9_5ja7";

export const supabase = createClient(supabaseUrl, supabaseKey);