import db from './data/db.json';

const ordenarPorFecha = (registros) =>
  [...(registros || [])].sort((a, b) => {
    const fechaA = new Date(a.fecha || a.created_at || 0).getTime();
    const fechaB = new Date(b.fecha || b.created_at || 0).getTime();
    return fechaB - fechaA;
  });

const leerJsonLocal = (tabla) => {
  if (typeof localStorage === 'undefined') return [];

  const claveNueva = `jenna_${tabla}`;
  const claveAnterior = tabla;
  const datosGuardados = localStorage.getItem(claveNueva) || localStorage.getItem(claveAnterior);

  if (!datosGuardados) return [];

  try {
    const registros = JSON.parse(datosGuardados);
    return Array.isArray(registros) ? registros : [];
  } catch (error) {
    console.warn(`No se pudo leer ${tabla} desde localStorage:`, error);
    return [];
  }
};

const escribirJsonLocal = (tabla, registros) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(`jenna_${tabla}`, JSON.stringify(registros));
};

const unirSinDuplicados = (base, locales) => {
  const idsLocales = new Set(locales.map(registro => String(registro.id)));
  return [
    ...locales,
    ...(base || []).filter(registro => !idsLocales.has(String(registro.id))),
  ];
};

const siguienteId = (registros) => {
  const maxId = registros.reduce((max, registro) => {
    const id = Number(registro.id);
    return Number.isFinite(id) && id > max ? id : max;
  }, 0);

  return Math.max(Date.now(), maxId + 1);
};

export async function getConsultas() {
  return ordenarPorFecha(unirSinDuplicados(db.consultas, leerJsonLocal('consultas')));
}

export async function getPagos() {
  return ordenarPorFecha(unirSinDuplicados(db.pagos, leerJsonLocal('pagos')));
}

export async function guardarConsulta(consulta) {
  const consultas = leerJsonLocal('consultas');
  const nuevoRegistro = {
    id: consulta.id || siguienteId([...db.consultas, ...consultas]),
    nombre: consulta.nombre?.trim(),
    apellido: consulta.apellido?.trim(),
    email: consulta.email?.trim(),
    motivo: consulta.motivo,
    mensaje: consulta.mensaje?.trim(),
    fecha: consulta.fecha || new Date().toLocaleString(),
  };

  escribirJsonLocal('consultas', [nuevoRegistro, ...consultas]);
  return nuevoRegistro;
}

export async function guardarPago(pago) {
  const pagos = leerJsonLocal('pagos');
  const nuevoRegistro = {
    id: pago.id || siguienteId([...db.pagos, ...pagos]),
    id_orden: pago.id_orden,
    banco: pago.banco,
    monto: pago.monto,
    archivo: pago.archivo,
    imagen: pago.imagen,
    estado: pago.estado || 'verificando',
    fecha: pago.fecha || new Date().toLocaleString(),
  };

  escribirJsonLocal('pagos', [nuevoRegistro, ...pagos]);
  return nuevoRegistro;
}
