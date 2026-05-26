import { useEffect, useState } from 'react';
import './board-admin.css';
import './board-cliente.css';
import datos from '../data/productos.json';
import { crearPagoSupabase, obtenerPagosSupabase, supabaseConfigurado } from '../lib/supabaseApi.js';

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

const normalizarPago = (pago) => ({
  ...pago,
  id: pago.id || pago.orden || pago.created_at || Date.now(),
  banco: pago.banco || 'Sin banco',
  monto: typeof pago.monto === 'number' ? `$${pago.monto.toFixed(2)}` : pago.monto,
  estado: pago.estado || 'pendiente',
  fecha: pago.fecha || formatearFecha(pago.created_at),
});

const BoardCliente = ({ carrito, setUsuario, setVista }) => {
  const [filtro, setFiltro] = useState('');
  const [comprobante, setComprobante] = useState(null);
  const [seccion, setSeccion] = useState('pagos');
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [formPago, setFormPago] = useState({ orden: '', banco: '', monto: '' });

  const cargarPagos = async () => {
    try {
      if (supabaseConfigurado) {
        const pagosDb = await obtenerPagosSupabase();
        setPagos((pagosDb || []).map(normalizarPago));
      } else {
        const pagosLocales = JSON.parse(localStorage.getItem('pagos') || '[]');
        setPagos([...(datos.pagos || []), ...pagosLocales].map(normalizarPago));
      }
    } catch (err) {
      console.error('Error cargando pagos:', err);
      setError('No se pudieron cargar los pagos desde Supabase. Se muestran datos locales.');
      const pagosLocales = JSON.parse(localStorage.getItem('pagos') || '[]');
      setPagos([...(datos.pagos || []), ...pagosLocales].map(normalizarPago));
    }
  };

  useEffect(() => {
    cargarPagos();
  }, []);

  const filtrados = pagos.filter(p =>
    (p.banco || '').toLowerCase().includes(filtro.toLowerCase()) ||
    (p.estado || '').toLowerCase().includes(filtro.toLowerCase()) ||
    String(p.id || '').includes(filtro)
  );

  const manejarArchivo = (e) => {
    const archivo = e.target.files[0];
    if (archivo) setComprobante(archivo);
  };

  const manejarCambioPago = (e) => {
    const { name, value } = e.target;
    setFormPago({ ...formPago, [name]: value });
  };

  const guardarPagoLocal = (pago) => {
    const pagosLocales = JSON.parse(localStorage.getItem('pagos') || '[]');
    pagosLocales.push(pago);
    localStorage.setItem('pagos', JSON.stringify(pagosLocales));
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    if (!comprobante || cargando) return;

    setCargando(true);
    setError('');

    const nuevoPago = {
      orden: formPago.orden,
      banco: formPago.banco,
      monto: Number(formPago.monto),
      estado: 'verificando',
      comprobante_nombre: comprobante.name,
    };

    try {
      if (supabaseConfigurado) {
        await crearPagoSupabase(nuevoPago);
      } else {
        guardarPagoLocal({
          id: formPago.orden || Date.now(),
          ...nuevoPago,
          monto: `$${Number(formPago.monto).toFixed(2)}`,
          fecha: new Date().toLocaleString(),
        });
      }

      setComprobante(null);
      setFormPago({ orden: '', banco: '', monto: '' });
      setSeccion('pagos');
      await cargarPagos();
      alert('¡Comprobante enviado con éxito para revisión!');
    } catch (err) {
      console.error('No se pudo guardar el pago:', err);
      setError('No se pudo enviar el comprobante. Revisa la conexión con Supabase.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="db-root">
      <aside className="db-sidebar">
        <div className="db-brand">
          <span className="db-brand-mark">▲</span>
          <span className="db-brand-name">Jenna Moda</span>
        </div>

        <nav className="db-nav">
          <button className={`db-nav-item ${seccion === 'pagos' ? 'active' : ''}`} onClick={() => setSeccion('pagos')}>
            <span className="db-nav-icon">📊</span>
            Mis Pagos
          </button>
          <button className={`db-nav-item ${seccion === 'carrito' ? 'active' : ''}`} onClick={() => setSeccion('carrito')}>
            <span className="db-nav-icon">🛒</span>
            Mi Carrito ({carrito.length})
          </button>
          <button className={`db-nav-item ${seccion === 'carga' ? 'active' : ''}`} onClick={() => setSeccion('carga')}>
            <span className="db-nav-icon">📤</span>
            Subir Depósito
          </button>
        </nav>

        <div className="db-sidebar-footer" onClick={() => { setVista('tienda'); }} style={{ cursor: 'pointer' }}>
          <div className="db-avatar">U</div>
          <div>
            <p className="db-avatar-name">Volver a Tienda</p>
            <p className="db-avatar-role">Seguir Comprando</p>
          </div>
        </div>
      </aside>

      <main className="db-main">
        {error && <div className="db-alert">{error}</div>}

        {seccion === 'pagos' && (
          <>
            <header className="db-header">
              <div>
                <h1 className="db-title">Mis Transferencias y Depósitos</h1>
                <p className="db-subtitle">{filtrados.length} registro(s) encontrado(s)</p>
              </div>
              <input className="db-search" placeholder="Buscar por banco, estado u orden..." value={filtro} onChange={e => setFiltro(e.target.value)} />
            </header>

            <div className="db-table-wrap">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>ID Orden</th>
                    <th>Banco</th>
                    <th>Monto</th>
                    <th>Fecha Envío</th>
                    <th>Estado</th>
                    <th>Comprobante</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map(p => (
                    <tr key={p.id}>
                      <td className="db-id">#{p.orden || p.id}</td>
                      <td className="db-nombre">{p.banco}</td>
                      <td className="db-email" style={{ fontWeight: 'bold' }}>{p.monto}</td>
                      <td className="db-fecha">{p.fecha}</td>
                      <td>
                        <span className="db-badge" style={{ borderColor: ESTADO_COLOR[p.estado]?.color || '#555', color: ESTADO_COLOR[p.estado]?.color || '#555' }}>
                          {ESTADO_COLOR[p.estado]?.label || p.estado}
                        </span>
                      </td>
                      <td className="db-mensaje">{p.comprobante_nombre || p.comprobante || 'Sin archivo'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtrados.length === 0 && <p className="db-empty">No existen pagos registrados.</p>}
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
                    <td style={{ color: 'white' }}>${item.precio * item.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {carrito.length === 0 && <p className="db-empty">Tu carrito está vacío.</p>}
          </div>
        )}

        {seccion === 'carga' && (
          <>
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
                  <input type="number" name="orden" value={formPago.orden} onChange={manejarCambioPago} placeholder="Ej. 102" required />
                </div>

                <div className="upload-field">
                  <label>Banco de Destino</label>
                  <select name="banco" value={formPago.banco} onChange={manejarCambioPago} required>
                    <option value="">Selecciona el banco...</option>
                    <option value="Banco Pichincha">Banco Pichincha</option>
                    <option value="Banco Guayaquil">Banco Guayaquil</option>
                    <option value="Produbanco">Produbanco</option>
                  </select>
                </div>

                <div className="upload-field">
                  <label>Monto transferido</label>
                  <input type="number" min="0" step="0.01" name="monto" value={formPago.monto} onChange={manejarCambioPago} placeholder="Ej. 45.00" required />
                </div>

                <div className="dropzone">
                  <span className="dropzone-icon">📷</span>
                  <label htmlFor="file-upload" className="custom-file-upload">
                    {comprobante ? `Seleccionado: ${comprobante.name}` : 'Seleccionar Comprobante o Foto'}
                  </label>
                  <input id="file-upload" type="file" accept="image/*" onChange={manejarArchivo} required />
                </div>

                <button type="submit" className="btn-enviar-pago" disabled={!comprobante || cargando}>
                  {cargando ? 'Enviando...' : 'Enviar Comprobante'}
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