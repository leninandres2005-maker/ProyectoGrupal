import React, { useState } from 'react';
import './login-card.css';

function UserLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [esRegistro, setEsRegistro] = useState(false);

  const manejarEnvio = (e) => {
    e.preventDefault();
    console.log("Iniciando sesión con:", { username, password });

    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="login">
      <h2>{esRegistro ? 'Registro' : 'Iniciar Sesión'}</h2>
      
      <form onSubmit={manejarEnvio}>
        {esRegistro && (
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input 
              type="text" 
              id="nombre" 
              placeholder="Tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required 
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username">Usuario / Email:</label>
          <input 
            type="text" 
            id="username" 
            placeholder="usuario@correo.com" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input 
            type="password" 
            id="password" 
            placeholder="********" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <div className="button-group">
          <button type="submit" className="btn-principal">
            {esRegistro ? 'Registrarse' : 'Iniciar Sesión'}
          </button>

          <button 
            type="button" 
            className="btn-secundario" 
            onClick={() => setEsRegistro(!esRegistro)}
          >
            {esRegistro ? 'Volver al Login' : 'Crear una cuenta'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserLogin;