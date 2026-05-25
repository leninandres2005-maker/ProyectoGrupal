import { useState } from 'react';
import './login-admin.css';

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ usuario: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.usuario === 'admin' && form.password === '12345') {
      onLogin();
      return;
    }

    setError('Usuario o contraseña incorrectos');
    setLoading(false);
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="login-brand">
          <span className="login-logo-icon">◢</span>
          <span className="login-logo-text">Jenna Moda</span>
        </div>
        <div className="login-left-content">
          <h2 className="login-tagline">Panel de<br />Administración</h2>
          <p className="login-sub">Gestiona tu tienda desde un solo lugar.</p>
        </div>
        <div className="login-decor-circle c1" />
        <div className="login-decor-circle c2" />
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <h1 className="login-title">Iniciar sesión</h1>
            <p className="login-hint">Acceso exclusivo para administradores</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label">Usuario</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">👤</span>
                <input
                  className="login-input"
                  type="text"
                  name="usuario"
                  value={form.usuario}
                  onChange={handleChange}
                  placeholder="Ingresa tu usuario"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Contraseña</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">🔒</span>
                <input
                  className="login-input"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button
              className={`login-btn ${loading ? 'loading' : ''}`}
              type="submit"
              disabled={loading || !form.usuario || !form.password}
            >
              {loading ? <span className="login-spinner" /> : 'Ingresar'}
            </button>
          </form>

          <p className="login-footer-note">© 2026 Jenna Moda · Admin Panel</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
