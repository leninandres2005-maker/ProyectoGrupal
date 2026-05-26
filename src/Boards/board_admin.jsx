import { useState, useEffect, useCallback } from 'react';
import datos from '../data/productos.json';
import { obtenerConsultasSupabase, supabaseConfigurado } from '../lib/supabaseApi.js';
import './board-admin.css';
 
const MOTIVO_COLOR = {
  pedido:     { label: "Pedido",     color: "#1a6aff" },
  tallas:     { label: "Tallas",     color: "#0f9e6e" },
  devolucion: { label: "Devolución", color: "#e05c2a" },
  coleccion:  { label: "Colección",  color: "#9b4fd4" },
  mayorista:  { label: "Mayorista",  color: "#c49a00" },
  otro:       { label: "Otro",       color: "#555" },
};
 
/* ──────────────────────────────────────────
   PANEL: CLIENTES
   Construye una lista única de clientes
   a partir de las consultas recibidas.
────────────────────────────────────────── */
const PanelClientes = ({ consultas }) => {
  const [filtro, setFiltro] = useState('');
  const [seleccionado, setSeleccionado] = useState(null);
 
  // Agrupa por email para obtener clientes únicos
  const clientesMap = {};
  consultas.forEach(c => {
    if (!clientesMap[c.email]) {
      clientesMap[c.email] = {
        email: c.email,
        nombre: `${c.nombre} ${c.apellido || ''}`.trim(),
        consultas: [],
      };
    }
    clientesMap[c.email].consultas.push(c);
  });
  const clientes = Object.values(clientesMap);
 
  const filtrados = clientes.filter(cl =>
    cl.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    cl.email.toLowerCase().includes(filtro.toLowerCase())
  );
 
  return (
    <>
      <header className="db-header">
        <div>
          <h1 className="db-title">Clientes</h1>
          <p className="db-subtitle">{filtrados.length} cliente(s) registrado(s)</p>
        </div>
        <input
          className="db-search"
          placeholder="Buscar por nombre o email..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
        />
      </header>
 
      {/* Stats de clientes */}
      <div className="db-stats">
        <div className="db-stat">
          <p className="db-stat-num">{clientes.length}</p>
          <p className="db-stat-label">Total clientes</p>
        </div>
        <div className="db-stat">
          <p className="db-stat-num" style={{ color: '#1a6aff' }}>
            {clientes.filter(c => c.consultas.length > 1).length}
          </p>
          <p className="db-stat-label">Recurrentes</p>
        </div>
        <div className="db-stat">
          <p className="db-stat-num" style={{ color: '#0f9e6e' }}>
            {clientes.filter(c => c.consultas.some(x => x.motivo === 'pedido')).length}
          </p>
          <p className="db-stat-label">Con pedidos</p>
        </div>
        <div className="db-stat">
          <p className="db-stat-num" style={{ color: '#e05c2a' }}>
            {clientes.filter(c => c.consultas.some(x => x.motivo === 'devolucion')).length}
          </p>
          <p className="db-stat-label">Con devoluciones</p>
        </div>
      </div>
 
      <div className="db-table-wrap">
        <table className="db-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Consultas</th>
              <th>Motivos</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((cl, i) => (
              <tr
                key={cl.email}
                className={seleccionado?.email === cl.email ? 'selected' : ''}
                onClick={() => setSeleccionado(cl)}
              >
                <td className="db-id">{i + 1}</td>
                <td className="db-nombre">{cl.nombre}</td>
                <td className="db-email">{cl.email}</td>
                <td style={{ color: '#888' }}>{cl.consultas.length}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {[...new Set(cl.consultas.map(c => c.motivo))].map(m => (
                      <span
                        key={m}
                        className="db-badge"
                        style={{
                          borderColor: MOTIVO_COLOR[m]?.color || '#555',
                          color: MOTIVO_COLOR[m]?.color || '#555',
                          fontSize: 9,
                        }}
                      >
                        {MOTIVO_COLOR[m]?.label || m}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <button
                    className="db-ver"
                    onClick={e => { e.stopPropagation(); setSeleccionado(cl); }}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrados.length === 0 && (
          <div className="db-empty"><p>No se encontraron clientes</p></div>
        )}
      </div>
 
      {/* Panel detalle cliente */}
      {seleccionado && (
        <aside className="db-detail">
          <div className="db-detail-header">
            <p className="db-detail-title">Perfil de cliente</p>
            <button className="db-detail-close" onClick={() => setSeleccionado(null)}>✕</button>
          </div>
          <p className="db-detail-id">{seleccionado.nombre}</p>
          <div className="db-detail-field">
            <span className="db-detail-label">Email</span>
            <span className="db-detail-value">{seleccionado.email}</span>
          </div>
          <div className="db-detail-field">
            <span className="db-detail-label">Total consultas</span>
            <span className="db-detail-value">{seleccionado.consultas.length}</span>
          </div>
          <div className="db-detail-field db-detail-msg">
            <span className="db-detail-label">Historial</span>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {seleccionado.consultas.map(c => (
                <div
                  key={c.id}
                  style={{
                    background: '#1a1a1a',
                    padding: '10px 12px',
                    borderRadius: 4,
                    borderLeft: `2px solid ${MOTIVO_COLOR[c.motivo]?.color || '#555'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span
                      className="db-badge"
                      style={{
                        borderColor: MOTIVO_COLOR[c.motivo]?.color || '#555',
                        color: MOTIVO_COLOR[c.motivo]?.color || '#555',
                        fontSize: 9,
                      }}
                    >
                      {MOTIVO_COLOR[c.motivo]?.label || c.motivo}
                    </span>
                    <span style={{ fontSize: 10, color: '#333' }}>{c.fecha}</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#666', margin: 0 }}>{c.mensaje}</p>
                </div>
              ))}
            </div>
          </div>
          <button className="db-reply-btn">Enviar email al cliente</button>
        </aside>
      )}
    </>
  );
};
 
/* ──────────────────────────────────────────
   PANEL: REPORTES
   Gráficas y métricas sobre las consultas.
────────────────────────────────────────── */
const BarChart = ({ data, colorKey }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 120, padding: '0 8px' }}>
      {data.map(item => (
        <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#aaa', fontFamily: 'Cormorant Garamond, serif' }}>
            {item.value}
          </span>
          <div
            style={{
              width: '100%',
              height: `${Math.max((item.value / max) * 90, item.value > 0 ? 6 : 2)}px`,
              background: item.color || '#1a6aff',
              borderRadius: '3px 3px 0 0',
              transition: 'height 0.4s ease',
              opacity: item.value === 0 ? 0.2 : 1,
            }}
          />
          <span style={{ fontSize: 9, color: '#444', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center' }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};
 
const PanelReportes = ({ consultas }) => {
  const total = consultas.length;
 
  // Consultas por motivo
  const porMotivo = Object.entries(MOTIVO_COLOR).map(([key, val]) => ({
    label: val.label,
    value: consultas.filter(c => c.motivo === key).length,
    color: val.color,
  })).filter(item => item.value > 0);
 
  // Consultas por día (últimos 7 días simulados con los datos disponibles)
  const fechasUnicas = [...new Set(consultas.map(c => {
    const f = c.fecha || '';
    return f.split(' ')[0];
  }))].filter(Boolean).sort();
 
  const porFecha = fechasUnicas.slice(-7).map(fecha => ({
    label: fecha.slice(5), // MM-DD
    value: consultas.filter(c => (c.fecha || '').startsWith(fecha)).length,
    color: '#1a6aff',
  }));
 
  // Clientes únicos
  const emailsUnicos = new Set(consultas.map(c => c.email)).size;
 
  // Tasa devoluciones
  const devoluciones = consultas.filter(c => c.motivo === 'devolucion').length;
  const tasaDevolucion = total > 0 ? ((devoluciones / total) * 100).toFixed(1) : 0;
 
  return (
    <>
      <header className="db-header">
        <div>
          <h1 className="db-title">Reportes</h1>
          <p className="db-subtitle">Análisis y métricas del período actual</p>
        </div>
      </header>
 
      {/* KPIs */}
      <div className="db-stats">
        <div className="db-stat">
          <p className="db-stat-num">{total}</p>
          <p className="db-stat-label">Total consultas</p>
        </div>
        <div className="db-stat">
          <p className="db-stat-num" style={{ color: '#1a6aff' }}>{emailsUnicos}</p>
          <p className="db-stat-label">Clientes únicos</p>
        </div>
        <div className="db-stat">
          <p className="db-stat-num" style={{ color: '#e05c2a' }}>{tasaDevolucion}%</p>
          <p className="db-stat-label">Tasa devolución</p>
        </div>
        <div className="db-stat">
          <p className="db-stat-num" style={{ color: '#0f9e6e' }}>
            {total > 0 ? (emailsUnicos / total * 100).toFixed(0) : 0}%
          </p>
          <p className="db-stat-label">Clientes nuevos</p>
        </div>
      </div>
 
      <div className="db-table-wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: '32px 40px' }}>
 
        {/* Gráfica por motivo */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: 28, borderRadius: 4 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#444', marginBottom: 24 }}>
            Consultas por motivo
          </p>
          {porMotivo.length > 0 ? (
            <BarChart data={porMotivo} />
          ) : (
            <p style={{ color: '#333', fontSize: 12 }}>Sin datos</p>
          )}
        </div>
 
        {/* Gráfica por fecha */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: 28, borderRadius: 4 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#444', marginBottom: 24 }}>
            Consultas por fecha
          </p>
          {porFecha.length > 0 ? (
            <BarChart data={porFecha} />
          ) : (
            <p style={{ color: '#333', fontSize: 12 }}>Sin datos de fecha</p>
          )}
        </div>
 
        {/* Tabla resumen por motivo */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: 28, borderRadius: 4, gridColumn: '1 / -1' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#444', marginBottom: 20 }}>
            Resumen detallado
          </p>
          <table className="db-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Cantidad</th>
                <th>% del total</th>
                <th>Tendencia</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(MOTIVO_COLOR).map(([key, val]) => {
                const count = consultas.filter(c => c.motivo === key).length;
                const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={key}>
                    <td>
                      <span
                        className="db-badge"
                        style={{ borderColor: val.color, color: val.color }}
                      >
                        {val.label}
                      </span>
                    </td>
                    <td className="db-nombre">{count}</td>
                    <td style={{ color: '#666' }}>{pct}%</td>
                    <td>
                      <div
                        style={{
                          width: `${Math.max(parseFloat(pct), 2)}%`,
                          maxWidth: '100%',
                          height: 4,
                          background: val.color,
                          borderRadius: 2,
                          opacity: count === 0 ? 0.15 : 0.8,
                          minWidth: count > 0 ? 8 : 4,
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
 
      </div>
    </>
  );
};
 
/* ──────────────────────────────────────────
   COMPONENTE PRINCIPAL: DASHBOARD ADMIN
────────────────────────────────────────── */
const Dashboard = () => {
  const [seccion, setSeccion] = useState('consultas');
  const [filtro, setFiltro] = useState('');
  const [seleccionada, setSeleccionada] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [fuenteDatos, setFuenteDatos] = useState('local'); // 'supabase' | 'local'
 
  const cargarConsultas = useCallback(async () => {
    // 1. Intenta Supabase primero
    if (supabaseConfigurado) {
      try {
        const datos_sb = await obtenerConsultasSupabase();
        if (datos_sb && datos_sb.length >= 0) {
          // Fusiona con las que están en localStorage (formulario reciente)
          const delFormulario = JSON.parse(localStorage.getItem('consultas') || '[]');
          // Evita duplicados por email+mensaje
          const emailsMensajes = new Set(datos_sb.map(c => `${c.email}|${c.mensaje}`));
          const soloLocales = delFormulario.filter(c => !emailsMensajes.has(`${c.email}|${c.mensaje}`));
          setConsultas([...datos_sb, ...soloLocales]);
          setFuenteDatos('supabase');
          setCargando(false);
          return;
        }
      } catch (err) {
        console.warn('Supabase no disponible, usando datos locales:', err.message);
      }
    }
 
    // 2. Fallback: JSON estático + localStorage
    const delFormulario = JSON.parse(localStorage.getItem('consultas') || '[]');
    setConsultas([...datos.consultas, ...delFormulario]);
    setFuenteDatos('local');
    setCargando(false);
  }, []);
 
  useEffect(() => {
    cargarConsultas();
    // Refresco periódico
    const intervalo = setInterval(cargarConsultas, 5000);
    return () => clearInterval(intervalo);
  }, [cargarConsultas]);
 
  const filtradas = consultas.filter(c =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    c.email.toLowerCase().includes(filtro.toLowerCase()) ||
    c.motivo.toLowerCase().includes(filtro.toLowerCase())
  );
 
  return (
    <div className="db-root">
 
      {/* ── SIDEBAR ── */}
      <aside className="db-sidebar">
        <div className="db-brand">
          <span className="db-brand-mark">▲</span>
          <span className="db-brand-name">Jenna Moda</span>
        </div>
 
        <nav className="db-nav">
          {[
            { id: 'consultas', icon: '◈', label: 'Consultas' },
            { id: 'clientes',  icon: '◉', label: 'Clientes'  },
            { id: 'reportes',  icon: '◎', label: 'Reportes'  },
          ].map(item => (
            <button
              key={item.id}
              className={`db-nav-item ${seccion === item.id ? 'active' : ''}`}
              onClick={() => { setSeccion(item.id); setSeleccionada(null); }}
            >
              <span className="db-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
 
        <div className="db-sidebar-footer">
          <div className="db-avatar">A</div>
          <div>
            <p className="db-avatar-name">Admin</p>
            <p className="db-avatar-role" style={{ color: fuenteDatos === 'supabase' ? '#0f9e6e' : '#666' }}>
              {fuenteDatos === 'supabase' ? '● Supabase' : '● Local'}
            </p>
          </div>
        </div>
      </aside>
 
      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className="db-main">
        {cargando ? (
          <div className="db-empty" style={{ paddingTop: 120 }}>
            <p style={{ letterSpacing: '0.2em' }}>Cargando datos...</p>
          </div>
        ) : (
          <>
            {/* ── PANEL CONSULTAS ── */}
            {seccion === 'consultas' && (
              <>
                <header className="db-header">
                  <div>
                    <h1 className="db-title">Consultas recibidas</h1>
                    <p className="db-subtitle">{filtradas.length} resultado{filtradas.length !== 1 ? 's' : ''}</p>
                  </div>
                  <input
                    className="db-search"
                    placeholder="Buscar por nombre, email o motivo..."
                    value={filtro}
                    onChange={e => setFiltro(e.target.value)}
                  />
                </header>
 
                <div className="db-stats">
                  <div className="db-stat">
                    <p className="db-stat-num">{consultas.length}</p>
                    <p className="db-stat-label">Total consultas</p>
                  </div>
                  <div className="db-stat">
                    <p className="db-stat-num" style={{ color: '#1a6aff' }}>
                      {consultas.filter(c => c.motivo === 'pedido').length}
                    </p>
                    <p className="db-stat-label">Pedidos</p>
                  </div>
                  <div className="db-stat">
                    <p className="db-stat-num" style={{ color: '#e05c2a' }}>
                      {consultas.filter(c => c.motivo === 'devolucion').length}
                    </p>
                    <p className="db-stat-label">Devoluciones</p>
                  </div>
                  <div className="db-stat">
                    <p className="db-stat-num" style={{ color: '#0f9e6e' }}>
                      {JSON.parse(localStorage.getItem('consultas') || '[]').length}
                    </p>
                    <p className="db-stat-label">Nuevas (formulario)</p>
                  </div>
                </div>
 
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
                      {filtradas.map(c => (
                        <tr
                          key={c.id}
                          className={seleccionada?.id === c.id ? 'selected' : ''}
                          onClick={() => setSeleccionada(c)}
                        >
                          <td className="db-id">#{c.id}</td>
                          <td className="db-nombre">{c.nombre} {c.apellido || ''}</td>
                          <td className="db-email">{c.email}</td>
                          <td>
                            <span className="db-badge" style={{
                              borderColor: MOTIVO_COLOR[c.motivo]?.color || '#555',
                              color: MOTIVO_COLOR[c.motivo]?.color || '#555'
                            }}>
                              {MOTIVO_COLOR[c.motivo]?.label || c.motivo}
                            </span>
                          </td>
                          <td className="db-mensaje">{c.mensaje}</td>
                          <td className="db-fecha">{c.fecha}</td>
                          <td>
                            <button className="db-ver" onClick={e => { e.stopPropagation(); setSeleccionada(c); }}>
                              Ver
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtradas.length === 0 && (
                    <div className="db-empty"><p>No se encontraron consultas</p></div>
                  )}
                </div>
              </>
            )}
 
            {/* ── PANEL CLIENTES ── */}
            {seccion === 'clientes' && <PanelClientes consultas={consultas} />}
 
            {/* ── PANEL REPORTES ── */}
            {seccion === 'reportes' && <PanelReportes consultas={consultas} />}
          </>
        )}
      </main>
 
      {/* ── PANEL DETALLE CONSULTA ── */}
      {seccion === 'consultas' && seleccionada && (
        <aside className="db-detail">
          <div className="db-detail-header">
            <p className="db-detail-title">Detalle de consulta</p>
            <button className="db-detail-close" onClick={() => setSeleccionada(null)}>✕</button>
          </div>
          <p className="db-detail-id">Consulta #{seleccionada.id}</p>
          <div className="db-detail-field">
            <span className="db-detail-label">Nombre</span>
            <span className="db-detail-value">{seleccionada.nombre} {seleccionada.apellido || ''}</span>
          </div>
          <div className="db-detail-field">
            <span className="db-detail-label">Email</span>
            <span className="db-detail-value">{seleccionada.email}</span>
          </div>
          <div className="db-detail-field">
            <span className="db-detail-label">Motivo</span>
            <span className="db-badge" style={{
              borderColor: MOTIVO_COLOR[seleccionada.motivo]?.color || '#555',
              color: MOTIVO_COLOR[seleccionada.motivo]?.color || '#555'
            }}>
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
          <button className="db-reply-btn">Responder por email</button>
        </aside>
      )}
    </div>
  );
};
 
export default Dashboard;