import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kcnecctcovbwgramjjjj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjbmVjY3Rjb3Zid2dyYW1qaWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NjY5ODcsImV4cCI6MjA5NTM0Mjk4N30.jq8-2R61rP8-Ov58ng190xhPGOzfuWgpEPOZ8GdTqeo'
);

// Trae todas las consultas
export const getConsultas = async () => {
  const { data } = await supabase
    .from('consultas')
    .select('*')
    .order('fecha', { ascending: false });
  return data || [];
};

// Guarda una consulta nueva (formulario de contacto)
export const guardarConsulta = async (consulta) => {
  await supabase.from('consultas').insert([consulta]);
};

// Trae todos los pagos
export const getPagos = async () => {
  const { data } = await supabase
    .from('pagos')
    .select('*')
    .order('fecha', { ascending: false });
  return data || [];
};

// Guarda un pago nuevo
export const guardarPago = async (pago) => {
  await supabase.from('pagos').insert([pago]);
};