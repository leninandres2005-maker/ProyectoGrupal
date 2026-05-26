import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabaseConfigurado = Boolean(supabaseUrl && supabaseKey);

export const supabase = supabaseConfigurado
  ? createClient(supabaseUrl, supabaseKey)
  : null;
