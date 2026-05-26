const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const baseUrl = SUPABASE_URL.replace(/\/$/, '');

export const supabaseConfigurado = Boolean(baseUrl && SUPABASE_ANON_KEY);

const cabecerasBase = () => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
});

async function requestSupabase(ruta, opciones = {}) {
  if (!supabaseConfigurado) {
    throw new Error('Supabase no está configurado. Revisa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
  }

  const respuesta = await fetch(`${baseUrl}/rest/v1/${ruta}`, {
    ...opciones,
    headers: {
      ...cabecerasBase(),
      ...(opciones.headers || {}),
    },
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    throw new Error(detalle || `Error de Supabase: ${respuesta.status}`);
  }

  if (respuesta.status === 204) return null;
  return respuesta.json();
}

export function obtenerConsultasSupabase() {
  return requestSupabase('consultas?select=*&order=created_at.desc');
}

export async function crearConsultaSupabase(consulta) {
  const filas = await requestSupabase('consultas', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(consulta),
  });

  return filas?.[0] || consulta;
}

export function obtenerPagosSupabase() {
  return requestSupabase('pagos?select=*&order=created_at.desc');
}

export async function crearPagoSupabase(pago) {
  const filas = await requestSupabase('pagos', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(pago),
  });

  return filas?.[0] || pago;
}
