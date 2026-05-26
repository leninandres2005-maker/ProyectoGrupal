import { useState } from 'react';
import './Formulario.css';
import { guardarConsulta } from '../api.js';

const Formulario = () => {
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '',
    motivo: '', mensaje: '', newsletter: false
  });
  const [enviado, setEnviado] = useState(false);

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const formularioValido = form.nombre && form.apellido &&
    form.email.includes('@') && form.motivo && form.mensaje;



  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!formularioValido) return;

    await guardarConsulta({
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      motivo: form.motivo,
      mensaje: form.mensaje
    });

    setEnviado(true);
    setForm({
      nombre: '', apellido: '', email: '',
      motivo: '', mensaje: '', newsletter: false
    });
  };

    // Guarda en localStorage para que aparezca en el dashboard
    const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
    const nueva = {
      id: Date.now(),
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      motivo: form.motivo,
      mensaje: form.mensaje,
      fecha: new Date().toLocaleString()
    };
    consultas.push(nueva);
    localStorage.setItem('consultas', JSON.stringify(consultas));

    setEnviado(true);
    setForm({ nombre: '', apellido: '', email: '', motivo: '', mensaje: '', newsletter: false });
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

          <button className="contacto-btn" type="submit" disabled={!formularioValido}>
            Enviar mensaje
          </button>

          {enviado && (
            <div className="contacto-exito">
              ✓ Mensaje recibido — te respondemos en menos de 24 horas
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