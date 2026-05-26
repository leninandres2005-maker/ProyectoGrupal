import { useState, useEffect } from 'react';
import datos from '../data/productos.json';
import './board-admin.css';
import { getConsultas } from '../api';
const MOTIVO_COLOR = {
  pedido:     { label: "Pedido",     color: "#1a6aff" },
  tallas:     { label: "Tallas",     color: "#0f9e6e" },
  devolucion: { label: "Devolución", color: "#e05c2a" },
  coleccion:  { label: "Colección",  color: "#9b4fd4" },
  mayorista:  { label: "Mayorista",  color: "#c49a00" },
  otro:       { label: "Otro",       color: "#555" },
};

const Dashboard = () => {
  const [filtro, setFiltro] = useState('');
  const [seleccionada, setSeleccionada] = useState(null);
  const [consultas, setConsultas] = useState([]);

  // Carga datos del JSON + los que lleguen del formulario (localStorage)
  const cargarConsultas = () => {
    const delFormulario = JSON.parse(localStorage.getItem('consultas') || '[]');
    const todas = [...datos.consultas, ...delFormulario];
    setConsultas(todas);
  };




    useEffect(() => {
      const cargar = async () => {
        const data = await getConsultas();
        setConsultas(data);
      };

    cargar();
    const intervalo = setInterval(cargar, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const filtradas = consultas.filter(c =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    c.email.toLowerCase().includes(filtro.toLowerCase()) ||
    c.motivo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="db-root">

      {/* SIDEBAR */}
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

      {/* CONTENIDO */}
      <main className="db-main">
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

        {/* Estadísticas */}
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
            <p className="db-stat-label">Nuevas hoy</p>
          </div>
        </div>

        {/* Tabla */}
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
                  <td className="db-nombre">{c.nombre}</td>
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
      </main>

      {/* PANEL DETALLE */}
      {seleccionada && (
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