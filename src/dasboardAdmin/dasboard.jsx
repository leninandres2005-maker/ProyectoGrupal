import { useState } from 'react';
import './dasboard.css';
 
// ============================================================
// DATOS DE EJEMPLO — reemplaza con fetch a tu API Java
// cuando tengas el backend listo
// ============================================================

//genesis, esto es hecho por ia, no entendi ni pija, leelo, no sea loca :D
const CONSULTAS_EJEMPLO = [
  {
    id: 1,           // <- aquí irá rs.getInt("id")
    nombre: "Ana Torres",
    email: "ana@correo.com",
    motivo: "pedido",
    mensaje: "Quisiera saber el estado de mi pedido #2045.",
    fecha: "2025-05-22 10:34"
  },
  {
    id: 2,           // <- aquí irá rs.getInt("id")
    nombre: "Luis Méndez",
    email: "luis@correo.com",
    motivo: "tallas",
    mensaje: "Necesito la guía de tallas para jeans de mujer.",
    fecha: "2025-05-22 11:10"
  },
  {
    id: 3,           // <- aquí irá rs.getInt("id")
    nombre: "María Vega",
    email: "maria@correo.com",
    motivo: "devolucion",
    mensaje: "Recibí una prenda incorrecta, quiero hacer el cambio.",
    fecha: "2025-05-22 14:55"
  },
];
 
// ============================================================
// COLORES POR MOTIVO — puedes agregar más
// ============================================================
const MOTIVO_COLOR = {
  pedido:    { label: "Pedido",    color: "#1a6aff" },
  tallas:    { label: "Tallas",    color: "#0f9e6e" },
  devolucion:{ label: "Devolución",color: "#e05c2a" },
  coleccion: { label: "Colección", color: "#9b4fd4" },
  mayorista: { label: "Mayorista", color: "#c49a00" },
  otro:      { label: "Otro",      color: "#555" },
};
 
const Dashboard = () => {
  const [filtro, setFiltro]         = useState('');
  const [seleccionada, setSeleccionada] = useState(null);
 
  // ==========================================================
  // CUANDO TENGAS LA API JAVA LISTA:
  // reemplaza CONSULTAS_EJEMPLO por un useEffect + fetch:
  //
  // const [consultas, setConsultas] = useState([]);
  // useEffect(() => {
  //   fetch('http://localhost:8080/api/consultas')  // <- tu endpoint
  //     .then(res => res.json())
  //     .then(data => setConsultas(data));
  // }, []);
  // ==========================================================
  const consultas = CONSULTAS_EJEMPLO;
 
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
          <button className="db-nav-item active">
            <span className="db-nav-icon">◈</span>
            Consultas
          </button>
          <button className="db-nav-item">
            <span className="db-nav-icon">◉</span>
            Clientes
          </button>
          <button className="db-nav-item">
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
 
      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className="db-main">
 
        {/* Header */}
        <header className="db-header">
          <div>
            <h1 className="db-title">Consultas recibidas</h1>
            <p className="db-subtitle">
              {/* <- aquí puedes poner consultas.length cuando conectes la API */}
              {filtradas.length} resultado{filtradas.length !== 1 ? 's' : ''}
            </p>
          </div>
 
          <input
            className="db-search"
            placeholder="Buscar por nombre, email o motivo..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
          />
        </header>
 
        {/* Tarjetas de estadísticas */}
        <div className="db-stats">
          {/* Stat 1 — Total */}
          <div className="db-stat">
            <p className="db-stat-num">
              {/* <- aquí irá consultas.length desde la API */}
              {consultas.length}
            </p>
            <p className="db-stat-label">Total consultas</p>
          </div>
 
          {/* Stat 2 — Pedidos */}
          <div className="db-stat">
            <p className="db-stat-num" style={{ color: '#1a6aff' }}>
              {/* <- aquí irá el conteo filtrado por motivo desde la API */}
              {consultas.filter(c => c.motivo === 'pedido').length}
            </p>
            <p className="db-stat-label">Pedidos</p>
          </div>
 
          {/* Stat 3 — Devoluciones */}
          <div className="db-stat">
            <p className="db-stat-num" style={{ color: '#e05c2a' }}>
              {/* <- aquí irá el conteo filtrado por motivo desde la API */}
              {consultas.filter(c => c.motivo === 'devolucion').length}
            </p>
            <p className="db-stat-label">Devoluciones</p>
          </div>
 
          {/* Stat 4 — Hoy (placeholder) */}
          <div className="db-stat">
            <p className="db-stat-num" style={{ color: '#0f9e6e' }}>
              {/* <- aquí irá el conteo de consultas de hoy desde la API */}
              —
            </p>
            <p className="db-stat-label">Hoy</p>
          </div>
        </div>
 
        {/* Tabla */}
        <div className="db-table-wrap">
          <table className="db-table">
            <thead>
              <tr>
                {/* <- columna ID: aquí irá rs.getInt("id") */}
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
                  key={c.id}  // <- aquí irá el id de la base de datos
                  className={seleccionada?.id === c.id ? 'selected' : ''}
                  onClick={() => setSeleccionada(c)}
                >
                  {/* ID — cuando conectes la API este valor vendrá de rs.getInt("id") */}
                  <td className="db-id">#{c.id}</td>
 
                  {/* Nombre — vendrá de rs.getString("nombre") */}
                  <td className="db-nombre">{c.nombre}</td>
 
                  {/* Email — vendrá de rs.getString("email") */}
                  <td className="db-email">{c.email}</td>
 
                  {/* Motivo — vendrá de rs.getString("motivo") */}
                  <td>
                    <span
                      className="db-badge"
                      style={{ borderColor: MOTIVO_COLOR[c.motivo]?.color || '#555', color: MOTIVO_COLOR[c.motivo]?.color || '#555' }}
                    >
                      {MOTIVO_COLOR[c.motivo]?.label || c.motivo}
                    </span>
                  </td>
 
                  {/* Mensaje — vendrá de rs.getString("mensaje") */}
                  <td className="db-mensaje">{c.mensaje}</td>
 
                  {/* Fecha — vendrá de rs.getString("fecha") */}
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
            <div className="db-empty">
              <p>No se encontraron consultas</p>
            </div>
          )}
        </div>
      </main>
 
      {/* ── PANEL DETALLE (al hacer click en una fila) ── */}
      {seleccionada && (
        <aside className="db-detail">
          <div className="db-detail-header">
            <p className="db-detail-title">Detalle de consulta</p>
            <button className="db-detail-close" onClick={() => setSeleccionada(null)}>✕</button>
          </div>
 
          {/* ID de la consulta — vendrá de la BD */}
          <p className="db-detail-id">Consulta #{seleccionada.id}</p>
 
          <div className="db-detail-field">
            <span className="db-detail-label">Nombre</span>
            {/* <- vendrá de rs.getString("nombre") */}
            <span className="db-detail-value">{seleccionada.nombre}</span>
          </div>
 
          <div className="db-detail-field">
            <span className="db-detail-label">Email</span>
            {/* <- vendrá de rs.getString("email") */}
            <span className="db-detail-value">{seleccionada.email}</span>
          </div>
 
          <div className="db-detail-field">
            <span className="db-detail-label">Motivo</span>
            {/* <- vendrá de rs.getString("motivo") */}
            <span
              className="db-badge"
              style={{ borderColor: MOTIVO_COLOR[seleccionada.motivo]?.color || '#555', color: MOTIVO_COLOR[seleccionada.motivo]?.color || '#555' }}
            >
              {MOTIVO_COLOR[seleccionada.motivo]?.label || seleccionada.motivo}
            </span>
          </div>
 
          <div className="db-detail-field db-detail-msg">
            <span className="db-detail-label">Mensaje</span>
            {/* <- vendrá de rs.getString("mensaje") */}
            <p className="db-detail-value">{seleccionada.mensaje}</p>
          </div>
 
          <div className="db-detail-field">
            <span className="db-detail-label">Fecha</span>
            {/* <- vendrá de rs.getString("fecha") o rs.getTimestamp("fecha") */}
            <span className="db-detail-value">{seleccionada.fecha}</span>
          </div>
 
          <button className="db-reply-btn">Responder por email</button>
        </aside>
      )}
    </div>
  );
};
 
export default Dashboard;
