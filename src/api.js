import { supabase, supabaseConfigurado } from './supabase/supabaseClient.js';

export { supabaseConfigurado };

const ordenarPorFecha = (registros) =>
  [...(registros || [])].sort((a, b) => {
    const fechaA = new Date(a.fecha || a.created_at || 0).getTime();
    const fechaB = new Date(b.fecha || b.created_at || 0).getTime();
    return fechaB - fechaA;
  });

const validarSupabase = () => {
  if (!supabaseConfigurado || !supabase) {
    throw new Error('Supabase no esta configurado. Revisa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
  }
};

export async function getConsultas() {
  validarSupabase();

  const { data, error } = await supabase
    .from('consultas')
    .select('*');

  if (error) throw error;
  return ordenarPorFecha(data);
}

export async function getPagos() {
  validarSupabase();

  const { data, error } = await supabase
    .from('pagos')
    .select('*');

  if (error) throw error;
  return ordenarPorFecha(data);
}

export async function guardarConsulta(consulta) {
  validarSupabase();

  const nuevoRegistro = {
    nombre: consulta.nombre?.trim(),
    apellido: consulta.apellido?.trim(),
    email: consulta.email?.trim(),
    motivo: consulta.motivo,
    mensaje: consulta.mensaje?.trim(),
    fecha: consulta.fecha || new Date().toLocaleString(),
  };

  const { data, error } = await supabase
    .from('consultas')
    .insert([nuevoRegistro])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function guardarPago(pago) {
  validarSupabase();

  const nuevoRegistro = {
    id_orden: pago.id_orden,
    banco: pago.banco,
    monto: pago.monto,
    archivo: pago.archivo,
    imagen: pago.imagen,
    estado: pago.estado || 'verificando',
    fecha: pago.fecha || new Date().toLocaleString(),
  };

  const { data, error } = await supabase
    .from('pagos')
    .insert([nuevoRegistro])
    .select()
    .single();

  if (error) throw error;
  return data;
}
