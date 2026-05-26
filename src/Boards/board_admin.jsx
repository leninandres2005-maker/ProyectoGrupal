import { useState, useEffect, useCallback } from 'react';
import { getConsultas, getPagos } from '../api.js';
import './board-admin.css';

const MOTIVO_COLOR = {
  pedido:     { label: "Pedido",     color: "#1a6aff" },
  tallas:     { label: "Tallas",     color: "#0f9e6e" },
  devolucion: { label: "Devolución", color: "#e05c2a" },
  coleccion:  { label: "Colección",  color: "#9b4fd4" },
  mayorista:  { label: "Mayorista",  color: "#c49a00" },
  otro:       { label: "Otro",       color: "#555" },
};

const ESTADO_COLOR = {
  aprobado:    { label: "Aprobado",    color: "#0f9e6e" },
  verificando: { label: "Verificando", color: "#c49a00" },
  rechazado:   { label: "Rechazado",   color: "#e05c2a" },
};

/* ── MODAL IMAGEN ── */
const ModalImagen = ({ src, onClose }) => (
  <div
    onClick={onClose}
    style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, cursor: 'zoom-out',
    }}
  >
    <div onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: -16, right: -16,
          background: '#fff', border: 'none', borderRadius: '50%',
          width: 32, height: 32, fontSize: 16, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold',
        }}
      >✕</button>
      <img
        src={src}
        alt="Comprobante"
        style={{
          maxWidth: '90vw', maxHeight: '85vh',
          objectFit: 'contain', borderRadius: 8,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  </div>
);

/* ── PANEL CLIENTES ── */
const PanelClientes = ({ consultas }) => {
  const [filtro, setFiltro] = useState('');
  const [seleccionado, setSeleccionado] = useState(null);

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
    cl.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
    cl.email?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      <header className="db-header">
        <div>
          <h1 className="db-title">Clientes</h1>
          <p className="db-subtitle">{filtrados.length} cliente(s) registrado(s)</p>
        </div>
        <input className="db-search" placeholder="Buscar por nombre o email..."
          value={filtro} onChange={e => setFiltro(e.target.value)} />
      </header>
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
            <tr><th>#</th><th>Nombre</th><th>Email</th><th>Consultas</th><th>Motivos</th><th></th></tr>
          </thead>
          <tbody>
            {filtrados.map((cl, i) => (
              <tr key={cl.email} className={seleccionado?.email === cl.email ? 'selected' : ''}
                onClick={() => setSeleccionado(cl)}>
                <td className="db-id">{i + 1}</td>
                <td className="db-nombre">{cl.nombre}</td>
                <td className="db-email">{cl.email}</td>
                <td style={{ color: '#888' }}>{cl.consultas.length}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {[...new Set(cl.consultas.map(c => c.motivo))].map(m => (
                      <span key={m} className="db-badge"
                        style={{ borderColor: MOTIVO_COLOR[m]?.color || '#555', color: MOTIVO_COLOR[m]?.color || '#555', fontSize: 9 }}>
                        {MOTIVO_COLOR[m]?.label || m}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <button className="db-ver" onClick={e => { e.stopPropagation(); setSeleccionado(cl); }}>Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrados.length === 0 && <div className="db-empty"><p>No se encontraron clientes</p></div>}
      </div>
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
                <div key={c.id} style={{ background: '#1a1a1a', padding: '10px 12px', borderRadius: 4, borderLeft: `2px solid ${MOTIVO_COLOR[c.motivo]?.color || '#555'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span className="db-badge" style={{ borderColor: MOTIVO_COLOR[c.motivo]?.color || '#555', color: MOTIVO_COLOR[c.motivo]?.color || '#555', fontSize: 9 }}>
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

/* ── PANEL REPORTES ── */
const BarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 120, padding: '0 8px' }}>
      {data.map(item => (
        <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#aaa' }}>{item.value}</span>
          <div style={{ width: '100%', height: `${Math.max((item.value / max) * 90, item.value > 0 ? 6 : 2)}px`, background: item.color || '#1a6aff', borderRadius: '3px 3px 0 0', opacity: item.value === 0 ? 0.2 : 1 }} />
          <span style={{ fontSize: 9, color: '#444', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center' }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const PanelReportes = ({ consultas, pagos, onVerImagen }) => {
  const total = consultas.length;
  const porMotivo = Object.entries(MOTIVO_COLOR).map(([key, val]) => ({
    label: val.label, value: consultas.filter(c => c.motivo === key).length, color: val.color,
  })).filter(item => item.value > 0);
  const emailsUnicos = new Set(consultas.map(c => c.email)).size;
  const devoluciones = consultas.filter(c => c.motivo === 'devolucion').length;
  const pagosVerificando = pagos.filter(p => p.estado === 'verificando').length;

  return (
    <>
      <header className="db-header">
        <div>
          <h1 className="db-title">Reportes generales</h1>
          <p className="db-subtitle">Resumen de consultas, clientes y pagos</p>
        </div>
      </header>
      <div className="db-stats">
        <div className="db-stat"><p className="db-stat-num">{total}</p><p className="db-stat-label">Total consultas</p></div>
        <div className="db-stat"><p className="db-stat-num" style={{ color: '#1a6aff' }}>{consultas.filter(c => c.motivo === 'pedido').length}</p><p className="db-stat-label">Pedidos</p></div>
        <div className="db-stat"><p className="db-stat-num" style={{ color: '#e05c2a' }}>{devoluciones}</p><p className="db-stat-label">Devoluciones</p></div>
        <div className="db-stat"><p className="db-stat-num" style={{ color: '#0f9e6e' }}>{emailsUnicos}</p><p className="db-stat-label">Clientes</p></div>
      </div>

      {/* ── TABLA DE PAGOS con imagen ── */}
      <div className="db-table-wrap">
        <p style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#444', margin: '24px 0 12px' }}>
          Pagos recibidos
        </p>
        <table className="db-table">
          <thead>
            <tr><th>Orden</th><th>Banco</th><th>Monto</th><th>Estado</th><th>Fecha</th><th>Comprobante</th></tr>
          </thead>
          <tbody>
            {pagos.map(p => (
              <tr key={p.id}>
                <td className="db-id">#{p.id_orden ?? p.id}</td>
                <td className="db-nombre">{p.banco}</td>
                <td style={{ color: '#fff', fontWeight: 'bold' }}>{p.monto}</td>
                <td>
                  <span className="db-badge" style={{ borderColor: ESTADO_COLOR[p.estado]?.color, color: ESTADO_COLOR[p.estado]?.color }}>
                    {ESTADO_COLOR[p.estado]?.label ?? p.estado}
                  </span>
                </td>
                <td className="db-fecha">{p.fecha}</td>
                <td>
                  {p.imagen ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={p.imagen} alt="comprobante"
                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, border: '1px solid #2a2a2a', cursor: 'pointer' }}
                        onClick={() => onVerImagen(p.imagen)}
                      />
                      <button
                        onClick={() => onVerImagen(p.imagen)}
                        style={{ background: '#1a1a1a', border: '1px solid #333', color: '#aaa', fontSize: 10, padding: '4px 10px', borderRadius: 3, cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                      >
                        Ver
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: '#333', fontSize: 11 }}>Sin archivo</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pagos.length === 0 && <div className="db-empty"><p>No hay pagos registrados</p></div>}

        {/* Stats de pagos */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 32 }}>
          <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: 24, borderRadius: 4 }}>
            <p style={{ fontSize: 28, fontFamily: 'Cormorant Garamond, serif', color: '#fff' }}>{pagos.length}</p>
            <p style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total pagos</p>
          </div>
          <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: 24, borderRadius: 4 }}>
            <p style={{ fontSize: 28, fontFamily: 'Cormorant Garamond, serif', color: '#c49a00' }}>{pagosVerificando}</p>
            <p style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pagos pendientes</p>
          </div>
          <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: 24, borderRadius: 4 }}>
            <p style={{ fontSize: 28, fontFamily: 'Cormorant Garamond, serif', color: '#0f9e6e' }}>{pagos.filter(p => p.estado === 'aprobado').length}</p>
            <p style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Aprobados</p>
          </div>
        </div>

        {porMotivo.length > 0 && (
          <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: 28, borderRadius: 4, marginTop: 24 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#444', marginBottom: 24 }}>Consultas por motivo</p>
            <BarChart data={porMotivo} />
          </div>
        )}
      </div>
    </>
  );
};

/* ── DASHBOARD PRINCIPAL ── */
const Dashboard = () => {
  const [seccion, setSeccion]       = useState('consultas');
  const [filtro, setFiltro]         = useState('');
  const [seleccionada, setSeleccionada] = useState(null);
  const [consultas, setConsultas]   = useState([]);
  const [pagos, setPagos]           = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [imagenModal, setImagenModal] = useState(null); // URL de imagen a mostrar en modal
  const [error, setError]           = useState('');

  const cargarDatos = useCallback(async () => {
    setError('');

    const [consultasData, pagosData] = await Promise.all([
      getConsultas(),
      getPagos(),
    ]);

    setConsultas(consultasData);
    setPagos(pagosData);

    setCargando(false);
  }, []);

  useEffect(() => {
    const iniciar = async () => {
      await cargarDatos();
    };
    iniciar();

    const intervalo = setInterval(() => {
      cargarDatos();
    }, 5000);
    return () => clearInterval(intervalo);
  }, [cargarDatos]);

  const filtradas = consultas.filter(c =>
    c.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
    c.email?.toLowerCase().includes(filtro.toLowerCase()) ||
    c.motivo?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="db-root">
      {/* Modal de imagen */}
      {imagenModal && <ModalImagen src={imagenModal} onClose={() => setImagenModal(null)} />}

      {/* SIDEBAR */}
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
            <button key={item.id}
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
            <p className="db-avatar-role" style={{ color: '#0f9e6e' }}>
              ● JSON Local
            </p>
          </div>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="db-main">
        {cargando ? (
          <div className="db-empty" style={{ paddingTop: 120 }}>
            <p style={{ letterSpacing: '0.2em' }}>Cargando datos...</p>
          </div>
        ) : (
          <>
            {/* PANEL CONSULTAS */}
            {seccion === 'consultas' && (
              <>
                <header className="db-header">
                  <div>
                    <h1 className="db-title">Consultas recibidas</h1>
                    <p className="db-subtitle">{error || `${filtradas.length} resultado(s)`}</p>
                  </div>
                  <input className="db-search" placeholder="Buscar por nombre, email o motivo..."
                    value={filtro} onChange={e => setFiltro(e.target.value)} />
                </header>
                <div className="db-stats">
                  <div className="db-stat"><p className="db-stat-num">{consultas.length}</p><p className="db-stat-label">Total consultas</p></div>
                  <div className="db-stat"><p className="db-stat-num" style={{ color: '#1a6aff' }}>{consultas.filter(c => c.motivo === 'pedido').length}</p><p className="db-stat-label">Pedidos</p></div>
                  <div className="db-stat"><p className="db-stat-num" style={{ color: '#e05c2a' }}>{consultas.filter(c => c.motivo === 'devolucion').length}</p><p className="db-stat-label">Devoluciones</p></div>
                  <div className="db-stat"><p className="db-stat-num" style={{ color: '#0f9e6e' }}>{consultas.length}</p><p className="db-stat-label">Base JSON</p></div>
                </div>
                <div className="db-table-wrap">
                  <table className="db-table">
                    <thead>
                      <tr><th>#</th><th>Cliente</th><th>Email</th><th>Motivo</th><th>Mensaje</th><th>Fecha</th><th></th></tr>
                    </thead>
                    <tbody>
                      {filtradas.map(c => (
                        <tr key={c.id} className={seleccionada?.id === c.id ? 'selected' : ''} onClick={() => setSeleccionada(c)}>
                          <td className="db-id">#{c.id}</td>
                          <td className="db-nombre">{c.nombre} {c.apellido || ''}</td>
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
                  {filtradas.length === 0 && <div className="db-empty"><p>No se encontraron consultas</p></div>}
                </div>
              </>
            )}

            {seccion === 'clientes' && <PanelClientes consultas={consultas} />}
            {seccion === 'reportes' && <PanelReportes consultas={consultas} pagos={pagos} onVerImagen={setImagenModal} />}
          </>
        )}
      </main>

      {/* DETALLE CONSULTA */}
      {seccion === 'consultas' && seleccionada && (
        <aside className="db-detail">
          <div className="db-detail-header">
            <p className="db-detail-title">Detalle de consulta</p>
            <button className="db-detail-close" onClick={() => setSeleccionada(null)}>✕</button>
          </div>
          <p className="db-detail-id">Consulta #{seleccionada.id}</p>
          <div className="db-detail-field"><span className="db-detail-label">Nombre</span><span className="db-detail-value">{seleccionada.nombre} {seleccionada.apellido || ''}</span></div>
          <div className="db-detail-field"><span className="db-detail-label">Email</span><span className="db-detail-value">{seleccionada.email}</span></div>
          <div className="db-detail-field">
            <span className="db-detail-label">Motivo</span>
            <span className="db-badge" style={{ borderColor: MOTIVO_COLOR[seleccionada.motivo]?.color || '#555', color: MOTIVO_COLOR[seleccionada.motivo]?.color || '#555' }}>
              {MOTIVO_COLOR[seleccionada.motivo]?.label || seleccionada.motivo}
            </span>
          </div>
          <div className="db-detail-field db-detail-msg"><span className="db-detail-label">Mensaje</span><p className="db-detail-value">{seleccionada.mensaje}</p></div>
          <div className="db-detail-field"><span className="db-detail-label">Fecha</span><span className="db-detail-value">{seleccionada.fecha}</span></div>
          <button className="db-reply-btn">Responder por email</button>
        </aside>
      )}
    </div>
  );
};

export default Dashboard;
