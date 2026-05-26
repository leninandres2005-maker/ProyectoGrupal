// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

 // o la clave publishable
export const supabase = createClient(supabaseUrl, supabaseKey);