import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kcnecctcovbwgramjjjj.supabase.co';


const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjbmVjY3Rjb3Zid2dyYW1qaWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NjY5ODcsImV4cCI6MjA5NTM0Mjk4N30.jq8-2R61rP8-Ov58ng190xhPGOzfuWgpEPOZ8GdTqeo';

export const supabaseConfigurado = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getConsultas = async () => {
  const { data, error } = await supabase
    .from('consultas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error consultando consultas:', error);
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
    console.error('Error guardando consulta:', error);
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
    console.error('Error consultando pagos:', error);
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
    console.error('Error guardando pago:', error);
    throw error;
  }

  return data?.[0];
};