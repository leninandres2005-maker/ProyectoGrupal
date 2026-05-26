import { useState } from 'react';
import './board-admin.css'; // Importamos el CSS del admin porque comparte los estilos de la estructura db-
import './board-cliente.css'; 
import datos from '../data/productos.json';
import { getPagos } from '../api.js';


const ESTADO_COLOR = {
  aprobado:   { label: "Aprobado", color: "#0f9e6e" },
  verificando:{ label: "Verificando", color: "#c49a00" },
  rechazado:  { label: "Rechazado", color: "#e05c2a" },
};

const BoardCliente = ({ carrito, setUsuario, setVista, cliente }) => {
  const [filtro, setFiltro] = useState('');
  const [comprobante, setComprobante] = useState(null);
  const [seccion, setSeccion] = useState('pagos'); // 'pagos', 'carga', 'carrito'




 const [pagos, setPagos] = useState([]);

useEffect(() => {
  const cargar = async () => {
    const data = await getPagos();
    setPagos(data);
  };
  cargar();
}, []);

const enviarFormulario = async (e) => {
  e.preventDefault();
  await guardarPago({
    id_orden: e.target[0].value,
    banco: e.target[1].value,
    archivo: comprobante?.name || ''
  });
  alert('Comprobante enviado');
  setComprobante(null);
  setSeccion('pagos');
};

  const filtrados = pagos.filter(p =>
    p.banco.toLowerCase().includes(filtro.toLowerCase()) ||
    p.estado.toLowerCase().includes(filtro.toLowerCase())
  );

  // Manejar la selección del archivo de imagen
  const manejarArchivo = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setComprobante(archivo);
      console.log("Archivo cargado listo para el backend:", archivo.name);
    }
  };

  const enviarFormulario = (e) => {
    e.preventDefault();
    alert(`¡Comprobante ${comprobante?.name} enviado con éxito para revisión!`);
    setComprobante(null);
    setSeccion('pagos');
  };

  return (
    <div className="db-root">
      
      {/* ── SIDEBAR DEL CLIENTE ── */}
      <aside className="db-sidebar">
        <div className="db-brand">
          <span className="db-brand-mark">▲</span>
          <span className="db-brand-name">Jenna Moda</span>
        </div>

        <nav className="db-nav">
          <button 
            className={`db-nav-item ${seccion === 'pagos' ? 'active' : ''}`} 
            onClick={() => setSeccion('pagos')}
          >
            <span className="db-nav-icon">📊</span>
            Mis Pagos
          </button>
          <button 
            className={`db-nav-item ${seccion === 'carrito' ? 'active' : ''}`} 
            onClick={() => setSeccion('carrito')}
          >
            <span className="db-nav-icon">🛒</span>
            Mi Carrito ({carrito.length})
          </button>
          <button 
            className={`db-nav-item ${seccion === 'carga' ? 'active' : ''}`} 
            onClick={() => setSeccion('carga')}
          >
            <span className="db-nav-icon">📤</span>
            Subir Depósito
          </button>
        </nav>

        <div className="db-sidebar-footer" onClick={() => {
          setVista('tienda');
          // Opcional: setUsuario(false) si quieres que cierre sesión
        }} style={{cursor: 'pointer'}}>
          <div className="db-avatar">U</div>
          <div>
            <p className="db-avatar-name">Volver a Tienda</p>
            <p className="db-avatar-role">Seguir Comprando</p>
          </div>
        </div>
      </aside>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className="db-main">
        
        {/* Renderizado Condicional: O ve sus pagos, o sube un comprobante */}
        {seccion === 'pagos' && (
          <>
            {/* Cabecera Historial */}
            <header className="db-header">
              <div>
                <h1 className="db-title">Mis Transferencias y Depósitos</h1>
                <p className="db-subtitle">{filtrados.length} registro(s) encontrado(s)</p>
              </div>
              <input
                className="db-search"
                placeholder="Buscar por banco o estado..."
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
              />
            </header>

            {/* Tabla de Historial de Pagos */}
            <div className="db-table-wrap">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>ID Orden</th>
                    <th>Banco</th>
                    <th>Monto</th>
                    <th>Fecha Envío</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map(p => (
                    <tr key={p.id}>
                      <td className="db-id">#{p.id}</td>
                      <td className="db-nombre">{p.banco}</td>
                      <td className="db-email" style={{ fontWeight: 'bold' }}>{p.monto}</td>
                      <td className="db-fecha">{p.fecha}</td>
                      <td>
                        <span
                          className="db-badge"
                          style={{ borderColor: ESTADO_COLOR[p.estado]?.color, color: ESTADO_COLOR[p.estado]?.color }}
                        >
                          {ESTADO_COLOR[p.estado]?.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {seccion === 'carrito' && (
          <div className="db-table-wrap">
            <header className="db-header">
              <h1 className="db-title">Productos en el Carrito</h1>
            </header>
            <table className="db-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item, index) => (
                  <tr key={index}>
                    <td className="db-nombre">{item.nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>${item.precio}</td>
                    <td style={{color: 'white'}}>${item.precio * item.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {carrito.length === 0 && <p className="db-empty">Tu carrito está vacío.</p>}
          </div>
        )}

        {seccion === 'carga' && (
          <>
            {/* Formulario de Carga Estilizado */}
            <header className="db-header">
              <div>
                <h1 className="db-title">Notificar Nuevo Pago</h1>
                <p className="db-subtitle">Sube una captura clara de tu depósito o transferencia bancaria.</p>
              </div>
            </header>

            <div className="upload-container">
              <form className="upload-form" onSubmit={enviarFormulario}>
                <div className="upload-field">
                  <label>Número de Orden / Pedido</label>
                  <input type="number" placeholder="Ej. 102" required />
                </div>

                <div className="upload-field">
                  <label>Banco de Destino</label>
                  <select required>
                    <option value="">Selecciona el banco...</option>
                    <option value="pichincha">Banco Pichincha</option>
                    <option value="guayaquil">Banco Guayaquil</option>
                    <option value="produbanco">Produbanco</option>
                  </select>
                </div>

                {/* Zona de arrastrar y soltar la foto */}
                <div className="dropzone">
                  <span className="dropzone-icon">📷</span>
                  <label htmlFor="file-upload" className="custom-file-upload">
                    {comprobante ? `Seleccionado: ${comprobante.name}` : "Seleccionar Comprobante o Foto"}
                  </label>
                  <input 
                    id="file-upload" 
                    type="file" 
                    accept="image/*" 
                    onChange={manejarArchivo} 
                    required 
                  />
                </div>

                <button type="submit" className="btn-enviar-pago" disabled={!comprobante}>
                  Enviar Comprobante
                </button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default BoardCliente;