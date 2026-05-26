// api.js
import { supabase } from './supabaseClient';

// Marca que Supabase está listo
export const supabaseConfigurado = true;

// Función para obtener consultas de la tabla 'consultas'
export async function getConsultas() {
  const { data, error } = await supabase
    .from('consultas')    // nombre de tu tabla en Supabase
    .select('*');
  if (error) throw error;
  return data;
}

// Función para obtener pagos de la tabla 'pagos'
export async function getPagos() {
  const { data, error } = await supabase
    .from('pagos')    // nombre de tu tabla en Supabase
    .select('*');
  if (error) throw error;
  return data;
}