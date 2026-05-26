import { useState, useEffect } from 'react';
import datos from '../data/productos.json';
import { obtenerConsultasSupabase, obtenerPagosSupabase, supabaseConfigurado } from '../lib/supabaseApi.js';
import './board-admin.css';

const MOTIVO_COLOR = {
  pedido:     { label: 'Pedido',     color: '#1a6aff' },
  tallas:     { label: 'Tallas',     color: '#0f9e6e' },
  devolucion: { label: 'Devolución', color: '#e05c2a' },
  coleccion:  { label: 'Colección',  color: '#9b4fd4' },
  mayorista:  { label: 'Mayorista',  color: '#c49a00' },
  otro:       { label: 'Otro',       color: '#555' },
};

const ESTADO_COLOR = {
  aprobado:    { label: 'Aprobado',    color: '#0f9e6e' },
  verificando: { label: 'Verificando', color: '#c49a00' },
  rechazado:   { label: 'Rechazado',   color: '#e05c2a' },
  pendiente:   { label: 'Pendiente',   color: '#1a6aff' },
};

const formatearFecha = (valor) => {
  if (!valor) return 'Sin fecha';
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return valor;
  return fecha.toLocaleString();
};

const normalizarConsulta = (consulta) => ({
  ...consulta,
  id: consulta.id || consulta.created_at || Date.now(),
  fecha: consulta.fecha || formatearFecha(consulta.created_at),
});

const normalizarPago = (pago) => ({
  ...pago,
  id: pago.id || pago.orden || pago.created_at || Date.now(),
  banco: pago.banco || 'Sin banco',
  monto: typeof pago.monto === 'number' ? `$${pago.monto.toFixed(2)}` : pago.monto,
  estado: pago.estado || 'pendiente',
  fecha: pago.fecha || formatearFecha(pago.created_at),
});

const Dashboard = () => {
  const [filtro, setFiltro] = useState('');
  const [seleccionada, setSeleccionada] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [seccion, setSeccion] = useState('consultas');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    try {
      setError('');

      if (supabaseConfigurado) {
        const [consultasDb, pagosDb] = await Promise.all([
          obtenerConsultasSupabase(),
          obtenerPagosSupabase(),
        ]);

        setConsultas((consultasDb || []).map(normalizarConsulta));
        setPagos((pagosDb || []).map(normalizarPago));
      } else {
        const delFormulario = JSON.parse(localStorage.getItem('consultas') || '[]');
        const pagosLocales = JSON.parse(localStorage.getItem('pagos') || '[]');
        setConsultas([...datos.consultas, ...delFormulario].map(normalizarConsulta));
        setPagos([...(datos.pagos || []), ...pagosLocales].map(normalizarPago));
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('No se pudieron cargar los datos desde Supabase. Revisa variables de entorno, tabla y políticas RLS.');

      const delFormulario = JSON.parse(localStorage.getItem('consultas') || '[]');
      const pagosLocales = JSON.parse(localStorage.getItem('pagos') || '[]');
      setConsultas([...datos.consultas, ...delFormulario].map(normalizarConsulta));
      setPagos([...(datos.pagos || []), ...pagosLocales].map(normalizarPago));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    const intervalo = setInterval(cargarDatos, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const consultasFiltradas = consultas.filter(c =>
    (c.nombre || '').toLowerCase().includes(filtro.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(filtro.toLowerCase()) ||
    (c.motivo || '').toLowerCase().includes(filtro.toLowerCase())
  );

  const pagosFiltrados = pagos.filter(p =>
    String(p.id || '').toLowerCase().includes(filtro.toLowerCase()) ||
    (p.banco || '').toLowerCase().includes(filtro.toLowerCase()) ||
    (p.estado || '').toLowerCase().includes(filtro.toLowerCase())
  );

  const clientes = consultas.reduce((acc, consulta) => {
    const clave = (consulta.email || consulta.id).toLowerCase();
    if (!acc[clave]) {
      acc[clave] = {
        nombre: `${consulta.nombre || ''} ${consulta.apellido || ''}`.trim() || 'Cliente sin nombre',
        email: consulta.email || 'Sin email',
        totalConsultas: 0,
        ultimoMotivo: consulta.motivo || 'otro',
        ultimaFecha: consulta.fecha || 'Sin fecha',
      };
    }
    acc[clave].totalConsultas += 1;
    acc[clave].ultimoMotivo = consulta.motivo || acc[clave].ultimoMotivo;
    acc[clave].ultimaFecha = consulta.fecha || acc[clave].ultimaFecha;
    return acc;
  }, {});

  const clientesFiltrados = Object.values(clientes).filter(c =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    c.email.toLowerCase().includes(filtro.toLowerCase()) ||
    c.ultimoMotivo.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPedidos = consultas.filter(c => c.motivo === 'pedido').length;
  const totalDevoluciones = consultas.filter(c => c.motivo === 'devolucion').length;
  const totalPagosPendientes = pagos.filter(p => p.estado === 'verificando' || p.estado === 'pendiente').length;

  const titulo = {
    consultas: 'Consultas recibidas',
    clientes: 'Panel de clientes',
    reportes: 'Reportes generales',
  }[seccion];

  const subtitulo = {
    consultas: `${consultasFiltradas.length} resultado${consultasFiltradas.length !== 1 ? 's' : ''}`,
    clientes: `${clientesFiltrados.length} cliente${clientesFiltrados.length !== 1 ? 's' : ''} registrado${clientesFiltrados.length !== 1 ? 's' : ''}`,
    reportes: 'Resumen de consultas, clientes y pagos',
  }[seccion];

  return (
    <div className="db-root">
      <aside className="db-sidebar">
        <div className="db-brand">
          <span className="db-brand-mark">▲</span>
          <span className="db-brand-name">Jenna Moda</span>
        </div>

        <nav className="db-nav">
          <button className={`db-nav-item ${seccion === 'consultas' ? 'active' : ''}`} onClick={() => { setSeccion('consultas'); setSeleccionada(null); }}>
            <span className="db-nav-icon">◈</span>
            Consultas
          </button>
          <button className={`db-nav-item ${seccion === 'clientes' ? 'active' : ''}`} onClick={() => { setSeccion('clientes'); setSeleccionada(null); }}>
            <span className="db-nav-icon">◉</span>
            Clientes
          </button>
          <button className={`db-nav-item ${seccion === 'reportes' ? 'active' : ''}`} onClick={() => { setSeccion('reportes'); setSeleccionada(null); }}>
            <span className="db-nav-icon">◎</span>
            Reportes
          </button>
        </nav>

        <div className="db-sidebar-footer">
          <div className="db-avatar">A</div>
          <div>
            <p className="db-avatar-name">Admin</p>
            <p className="db-avatar-role">Administrador</p>
          </div>
        </div>
      </aside>

      <main className="db-main">
        <header className="db-header">
          <div>
            <h1 className="db-title">{titulo}</h1>
            <p className="db-subtitle">{cargando ? 'Cargando datos...' : subtitulo}</p>
          </div>
          <input
            className="db-search"
            placeholder="Buscar por nombre, email, motivo o estado..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
          />
        </header>

        {error && <div className="db-alert">{error}</div>}

        <div className="db-stats">
          <div className="db-stat">
            <p className="db-stat-num">{consultas.length}</p>
            <p className="db-stat-label">Total consultas</p>
          </div>
          <div className="db-stat">
            <p className="db-stat-num" style={{ color: '#1a6aff' }}>{totalPedidos}</p>
            <p className="db-stat-label">Pedidos</p>
          </div>
          <div className="db-stat">
            <p className="db-stat-num" style={{ color: '#e05c2a' }}>{totalDevoluciones}</p>
            <p className="db-stat-label">Devoluciones</p>
          </div>
          <div className="db-stat">
            <p className="db-stat-num" style={{ color: '#0f9e6e' }}>{Object.keys(clientes).length}</p>
            <p className="db-stat-label">Clientes</p>
          </div>
        </div>

        {seccion === 'consultas' && (
          <div className="db-table-wrap">
            <table className="db-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Motivo</th>
                  <th>Mensaje</th>
                  <th>Fecha</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {consultasFiltradas.map(c => (
                  <tr key={c.id} className={seleccionada?.id === c.id ? 'selected' : ''} onClick={() => setSeleccionada(c)}>
                    <td className="db-id">#{c.id}</td>
                    <td className="db-nombre">{c.nombre}</td>
                    <td className="db-email">{c.email}</td>
                    <td>
                      <span className="db-badge" style={{ borderColor: MOTIVO_COLOR[c.motivo]?.color || '#555', color: MOTIVO_COLOR[c.motivo]?.color || '#555' }}>
                        {MOTIVO_COLOR[c.motivo]?.label || c.motivo}
                      </span>
                    </td>
                    <td className="db-mensaje">{c.mensaje}</td>
                    <td className="db-fecha">{c.fecha}</td>
                    <td><button className="db-ver" onClick={e => { e.stopPropagation(); setSeleccionada(c); }}>Ver</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {consultasFiltradas.length === 0 && <div className="db-empty"><p>No se encontraron consultas</p></div>}
          </div>
        )}

        {seccion === 'clientes' && (
          <div className="db-table-wrap">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Total consultas</th>
                  <th>Último motivo</th>
                  <th>Última fecha</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map(c => (
                  <tr key={c.email}>
                    <td className="db-nombre">{c.nombre}</td>
                    <td className="db-email">{c.email}</td>
                    <td>{c.totalConsultas}</td>
                    <td>
                      <span className="db-badge" style={{ borderColor: MOTIVO_COLOR[c.ultimoMotivo]?.color || '#555', color: MOTIVO_COLOR[c.ultimoMotivo]?.color || '#555' }}>
                        {MOTIVO_COLOR[c.ultimoMotivo]?.label || c.ultimoMotivo}
                      </span>
                    </td>
                    <td className="db-fecha">{c.ultimaFecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {clientesFiltrados.length === 0 && <div className="db-empty"><p>No se encontraron clientes</p></div>}
          </div>
        )}

        {seccion === 'reportes' && (
          <div className="db-table-wrap">
            <div className="db-report-grid">
              <div className="db-report-card">
                <p className="db-detail-label">Consultas registradas</p>
                <p className="db-stat-num">{consultas.length}</p>
                <p className="db-detail-value">Incluye consultas guardadas en Supabase o localStorage.</p>
              </div>
              <div className="db-report-card">
                <p className="db-detail-label">Clientes únicos</p>
                <p className="db-stat-num">{Object.keys(clientes).length}</p>
                <p className="db-detail-value">Agrupados por correo electrónico.</p>
              </div>
              <div className="db-report-card">
                <p className="db-detail-label">Pagos pendientes</p>
                <p className="db-stat-num">{totalPagosPendientes}</p>
                <p className="db-detail-value">Pagos en estado pendiente o verificando.</p>
              </div>
            </div>

            <table className="db-table">
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Banco</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {pagosFiltrados.map(p => (
                  <tr key={p.id}>
                    <td className="db-id">#{p.id}</td>
                    <td className="db-nombre">{p.banco}</td>
                    <td className="db-email">{p.monto}</td>
                    <td>
                      <span className="db-badge" style={{ borderColor: ESTADO_COLOR[p.estado]?.color || '#555', color: ESTADO_COLOR[p.estado]?.color || '#555' }}>
                        {ESTADO_COLOR[p.estado]?.label || p.estado}
                      </span>
                    </td>
                    <td className="db-fecha">{p.fecha}</td>
                    <td className="db-mensaje">{p.comprobante_nombre || p.comprobante || 'Sin archivo'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pagosFiltrados.length === 0 && <div className="db-empty"><p>No se encontraron pagos</p></div>}
          </div>
        )}
      </main>

      {seleccionada && seccion === 'consultas' && (
        <aside className="db-detail">
          <div className="db-detail-header">
            <p className="db-detail-title">Detalle de consulta</p>
            <button className="db-detail-close" onClick={() => setSeleccionada(null)}>✕</button>
          </div>
          <p className="db-detail-id">Consulta #{seleccionada.id}</p>
          <div className="db-detail-field">
            <span className="db-detail-label">Nombre</span>
            <span className="db-detail-value">{seleccionada.nombre} {seleccionada.apellido}</span>
          </div>
          <div className="db-detail-field">
            <span className="db-detail-label">Email</span>
            <span className="db-detail-value">{seleccionada.email}</span>
          </div>
          <div className="db-detail-field">
            <span className="db-detail-label">Motivo</span>
            <span className="db-badge" style={{ borderColor: MOTIVO_COLOR[seleccionada.motivo]?.color || '#555', color: MOTIVO_COLOR[seleccionada.motivo]?.color || '#555' }}>
              {MOTIVO_COLOR[seleccionada.motivo]?.label || seleccionada.motivo}
            </span>
          </div>
          <div className="db-detail-field db-detail-msg">
            <span className="db-detail-label">Mensaje</span>
            <p className="db-detail-value">{seleccionada.mensaje}</p>
          </div>
          <div className="db-detail-field">
            <span className="db-detail-label">Fecha</span>
            <span className="db-detail-value">{seleccionada.fecha}</span>
          </div>
          <a className="db-reply-btn" href={`mailto:${seleccionada.email}?subject=Respuesta a su consulta Jenna Moda`}>Responder por email</a>
        </aside>
      )}
    </div>
  );
};

export default Dashboard;