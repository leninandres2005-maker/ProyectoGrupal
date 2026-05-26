import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigurado = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getConsultas = async () => {
  const { data, error } = await supabase
    .from('consultas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error consultando consultas:', error.message);
    return [];
  }

  return data || [];
};

export const guardarConsulta = async (consulta) => {
  const { data, error } = await supabase
    .from('consultas')
    .insert([consulta])
    .select();

  if (error) {
    console.error('Error guardando consulta:', error.message);
    throw error;
  }

  return data?.[0];
};

export const getPagos = async () => {
  const { data, error } = await supabase
    .from('pagos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error consultando pagos:', error.message);
    return [];
  }

  return data || [];
};

export const guardarPago = async (pago) => {
  const { data, error } = await supabase
    .from('pagos')
    .insert([pago])
    .select();

  if (error) {
    console.error('Error guardando pago:', error.message);
    throw error;
  }

  return data?.[0];
};