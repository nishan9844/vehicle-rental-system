import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://rnyfuauzletofqdlwffj.supabase.co"
const supabaseAnonKey = "sb_publishable_8EOytP0Coh7X0HTmgcEl0w_rPxQ5Sem"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)