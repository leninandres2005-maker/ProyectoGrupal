import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = 'https://kcnecctcovbwgramjjjj.supabase.co';
const supabaseKey  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjbmVjY3Rjb3Zid2dyYW1qaWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NjY5ODcsImV4cCI6MjA5NTM0Mjk4N30.jq8-2R61rP8-Ov58ng190xhPGOzfuWgpEPOZ8GdTqeo';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Indica si Supabase está configurado (siempre true aquí)
export const supabaseConfigurado = true;

// Obtiene todas las consultas ordenadas por fecha
export const obtenerConsultasSupabase = async () => {
  const { data, error } = await supabase
    .from('consultas')
    .select('*')
    .order('fecha', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};