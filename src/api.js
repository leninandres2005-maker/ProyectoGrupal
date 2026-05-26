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

const lanzarErrorSupabase = (error, accion) => {
  const detalle = [error.message, error.details, error.hint].filter(Boolean).join(' ');
  throw new Error(`${accion}: ${detalle || 'Error desconocido de Supabase'}`);
};

export async function getConsultas() {
  validarSupabase();

  const { data, error } = await supabase
    .from('consultas')
    .select('*');

  if (error) lanzarErrorSupabase(error, 'No se pudieron cargar las consultas');
  return ordenarPorFecha(data);
}

export async function getPagos() {
  validarSupabase();

  const { data, error } = await supabase
    .from('pagos')
    .select('*');

  if (error) lanzarErrorSupabase(error, 'No se pudieron cargar los pagos');
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

  if (error) lanzarErrorSupabase(error, 'No se pudo guardar la consulta');
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

  if (error) lanzarErrorSupabase(error, 'No se pudo guardar el pago');
  return data;
}
