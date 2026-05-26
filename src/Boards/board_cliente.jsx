import { useState, useEffect } from 'react';
import './board-admin.css';
import './board-cliente.css';
import { getPagos, guardarPago } from '../api.js';

const ESTADO_COLOR = {
  aprobado:    { label: "Aprobado",    color: "#0f9e6e" },
  verificando: { label: "Verificando", color: "#c49a00" },
  rechazado:   { label: "Rechazado",   color: "#e05c2a" },
};

const BoardCliente = ({ carrito, setUsuario, setVista, cliente }) => {
  const [filtro, setFiltro]           = useState('');
  const [comprobante, setComprobante] = useState(null);       // File object
  const [preview, setPreview]         = useState(null);       // Base64 URL para previsualizar
  const [seccion, setSeccion]         = useState('pagos');
  const [pagos, setPagos]             = useState([]);
  const [cargando, setCargando]       = useState(true);
  const [enviando, setEnviando]       = useState(false);

  // ── Cargar pagos desde Supabase ──────────────────────────────────────────
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      const data = await getPagos();
      setPagos(data);
      setCargando(false);
    };
    cargar();
  }, []);

  // ── Filtrar pagos ────────────────────────────────────────────────────────
  const filtrados = pagos.filter(p =>
    p.banco?.toLowerCase().includes(filtro.toLowerCase()) ||
    p.estado?.toLowerCase().includes(filtro.toLowerCase())
  );

  // ── Manejar selección de archivo ─────────────────────────────────────────
  const manejarArchivo = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setComprobante(archivo);

    // Generar preview en Base64 para mostrar la imagen en pantalla
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(archivo);
  };

  // ── Enviar formulario de comprobante ─────────────────────────────────────
const enviarFormulario = async (e) => {
  e.preventDefault();

  await guardarPago({
    id_orden: e.target[0].value,
    banco: e.target[1].value,
    estado: 'verificando',
    archivo: comprobante?.name || ''
  });

  alert('Comprobante enviado');
  setComprobante(null);
  setSeccion('pagos');

  const data = await getPagos();
  setPagos(data);
};

    setEnviando(true);
    try {
      // Convertir imagen a Base64 para guardarla en Supabase
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result; // "data:image/jpeg;base64,..."

        await guardarPago({
          id_orden: e.target[0].value,
          banco:    e.target[1].value,
          archivo:  comprobante.name,
          imagen:   base64,           // Guardamos la imagen en base64
          estado:   'verificando',
          fecha:    new Date().toLocaleString(),
        });

        // Recargar la lista de pagos
        const data = await getPagos();
        setPagos(data);

        alert('✅ Comprobante enviado con éxito. Estará en revisión pronto.');
        setComprobante(null);
        setPreview(null);
        setSeccion('pagos');
        setEnviando(false);
      };
      reader.readAsDataURL(comprobante);
    } catch (err) {
      console.error('Error al enviar comprobante:', err);
      alert('❌ Error al enviar. Intenta de nuevo.');
      setEnviando(false);
    }
  };

  return (
    <div className="db-root">

      {/* ── SIDEBAR ── */}
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

        <div
          className="db-sidebar-footer"
          onClick={() => setVista('tienda')}
          style={{ cursor: 'pointer' }}
        >
          <div className="db-avatar">U</div>
          <div>
            <p className="db-avatar-name">Volver a Tienda</p>
            <p className="db-avatar-role">Seguir Comprando</p>
          </div>
        </div>
      </aside>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className="db-main">

        {/* ── MIS PAGOS ── */}
        {seccion === 'pagos' && (
          <>
            <header className="db-header">
              <div>
                <h1 className="db-title">Mis Transferencias y Depósitos</h1>
                <p className="db-subtitle">
                  {cargando ? 'Cargando...' : `${filtrados.length} registro(s) encontrado(s)`}
                </p>
              </div>
              <input
                className="db-search"
                placeholder="Buscar por banco o estado..."
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
              />
            </header>

            <div className="db-table-wrap">
              {cargando ? (
                <div className="db-empty"><p>Cargando datos...</p></div>
              ) : (
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>ID Orden</th>
                      <th>Banco</th>
                      <th>Monto</th>
                      <th>Fecha Envío</th>
                      <th>Comprobante</th>
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
                          {/* Muestra la imagen si existe */}
                          {p.imagen ? (
                            <img
                              src={p.imagen}
                              alt="Comprobante"
                              style={{
                                width: 56,
                                height: 56,
                                objectFit: 'cover',
                                borderRadius: 4,
                                border: '1px solid #2a2a2a',
                                cursor: 'pointer',
                              }}
                              onClick={() => window.open(p.imagen, '_blank')}
                              title="Ver imagen completa"
                            />
                          ) : (
                            <span style={{ color: '#444', fontSize: 11 }}>Sin imagen</span>
                          )}
                        </td>
                        <td>
                          <span
                            className="db-badge"
                            style={{
                              borderColor: ESTADO_COLOR[p.estado]?.color,
                              color: ESTADO_COLOR[p.estado]?.color,
                            }}
                          >
                            {ESTADO_COLOR[p.estado]?.label ?? p.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!cargando && filtrados.length === 0 && (
                <div className="db-empty"><p>No hay pagos registrados aún.</p></div>
              )}
            </div>
          </>
        )}

        {/* ── CARRITO ── */}
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
                    <td style={{ color: 'white' }}>${item.precio * item.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {carrito.length === 0 && <p className="db-empty">Tu carrito está vacío.</p>}
          </div>
        )}

        {/* ── SUBIR COMPROBANTE ── */}
        {seccion === 'carga' && (
          <>
            <header className="db-header">
              <div>
                <h1 className="db-title">Notificar Nuevo Pago</h1>
                <p className="db-subtitle">
                  Sube una captura clara de tu depósito o transferencia bancaria.
                </p>
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

                {/* Dropzone */}
                <div className="dropzone">
                  <span className="dropzone-icon">📷</span>
                  <label htmlFor="file-upload" className="custom-file-upload">
                    {comprobante
                      ? `Seleccionado: ${comprobante.name}`
                      : 'Seleccionar Comprobante o Foto'}
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={manejarArchivo}
                    required
                  />
                </div>

                {/* Preview de la imagen seleccionada */}
                {preview && (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 11, color: '#666', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Vista previa del comprobante
                    </p>
                    <img
                      src={preview}
                      alt="Vista previa"
                      style={{
                        maxWidth: '100%',
                        maxHeight: 280,
                        objectFit: 'contain',
                        borderRadius: 6,
                        border: '1px solid #2a2a2a',
                      }}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-enviar-pago"
                  disabled={!comprobante || enviando}
                >
                  {enviando ? 'Enviando...' : 'Enviar Comprobante'}
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