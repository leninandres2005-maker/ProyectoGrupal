import { useState } from 'react';
import { crearConsultaSupabase, supabaseConfigurado } from '../lib/supabaseApi.js';
import './Formulario.css';

const Formulario = () => {
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '',
    motivo: '', mensaje: '', newsletter: false
  });
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const formularioValido = form.nombre && form.apellido &&
    form.email.includes('@') && form.motivo && form.mensaje;

  const guardarEnLocalStorage = (consulta) => {
    const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
    consultas.push(consulta);
    localStorage.setItem('consultas', JSON.stringify(consultas));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!formularioValido || cargando) return;

    setCargando(true);
    setError('');

    const nueva = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      email: form.email.trim(),
      motivo: form.motivo,
      mensaje: form.mensaje.trim(),
      newsletter: form.newsletter,
    };

    try {
      if (supabaseConfigurado) {
        await crearConsultaSupabase(nueva);
      } else {
        guardarEnLocalStorage({
          id: Date.now(),
          ...nueva,
          fecha: new Date().toLocaleString()
        });
      }

      setEnviado(true);
      setForm({ nombre: '', apellido: '', email: '', motivo: '', mensaje: '', newsletter: false });
    } catch (err) {
      console.error('No se pudo guardar la consulta:', err);
      setError('No se pudo enviar la consulta. Revisa la conexión con Supabase.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="contacto-section">
      <div className="contacto-header">
        <h2 className="contacto-titulo">Contáctanos</h2>
        <p className="contacto-sub">Consultas sobre colecciones, tallas o pedidos</p>
      </div>

      <div className="contacto-grid">
        <form className="contacto-form" onSubmit={manejarEnvio}>
          <div className="contacto-row">
            <div className="contacto-field">
              <label className="contacto-label">Nombre</label>
              <input className="contacto-input" name="nombre" value={form.nombre} onChange={manejarCambio} placeholder="Tu nombre" />
            </div>
            <div className="contacto-field">
              <label className="contacto-label">Apellido</label>
              <input className="contacto-input" name="apellido" value={form.apellido} onChange={manejarCambio} placeholder="Tu apellido" />
            </div>
          </div>

          <div className="contacto-field">
            <label className="contacto-label">Correo electrónico</label>
            <input className="contacto-input" name="email" type="email" value={form.email} onChange={manejarCambio} placeholder="tu@correo.com" />
          </div>

          <div className="contacto-field">
            <label className="contacto-label">¿En qué podemos ayudarte?</label>
            <select className="contacto-select" name="motivo" value={form.motivo} onChange={manejarCambio}>
              <option value="">Selecciona una opción</option>
              <option value="pedido">Consulta sobre pedido</option>
              <option value="tallas">Guía de tallas</option>
              <option value="devolucion">Devolución / cambio</option>
            </select>
          </div>

          <div className="contacto-field">
            <label className="contacto-label">Mensaje</label>
            <textarea className="contacto-textarea" name="mensaje" value={form.mensaje} onChange={manejarCambio} placeholder="Cuéntanos más..." rows="4" />
          </div>

          <div className="contacto-check-row">
            <input type="checkbox" id="newsletter" name="newsletter" checked={form.newsletter} onChange={manejarCambio} />
            <label htmlFor="newsletter" className="contacto-check-label">
              Quiero recibir novedades y lanzamientos exclusivos
            </label>
          </div>

          <button className="contacto-btn" type="submit" disabled={!formularioValido || cargando}>
            {cargando ? 'Enviando...' : 'Enviar mensaje'}
          </button>

          {enviado && (
            <div className="contacto-exito">
              ✓ Mensaje recibido — te respondemos en menos de 24 horas
            </div>
          )}

          {error && (
            <div className="contacto-exito" style={{ color: '#e05c2a' }}>
              {error}
            </div>
          )}
        </form>

        <div className="contacto-info">
          <div className="contacto-info-item">
            <p className="contacto-info-label">Tienda principal</p>
            <p className="contacto-info-value">Costanera Urdesa, Guayaquil<br />Ecuador</p>
          </div>
          <div className="contacto-info-item">
            <p className="contacto-info-label">Horario</p>
            <p className="contacto-info-value">Lun – Vie · 9:00 – 17:00<br />Sábados · 10:00 – 17:00</p>
          </div>
          <div className="contacto-info-item">
            <p className="contacto-info-label">Contacto directo</p>
            <p className="contacto-info-value">contacto@jennamoda.ec<br />+593 99 729 4120</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Formulario;