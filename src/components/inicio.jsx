import { useEffect, useState } from 'react';
import MenuBar from './MenuBar.jsx';
import ListaProductos from './card_ropa.jsx';
import UserLogin from './login.jsx';
import BoardCliente from '../Boards/board_cliente.jsx';
import './inicio.css';

function Inicio() {
  const [imagenPortada, setImagenPortada] = useState('');
  const [categoria, setCategoria] = useState('minimalist-clothing');
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [usuario, setUsuario] = useState(false);

  useEffect(() => {

    // Llamamos a Unsplash buscando una imagen 
    const query = 'fashion-clothing';
    const accessKey = 'aVi9cRhtwFFKb55altpMyhGqH71RMBYq8vYBj-yNlps';


    fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${accessKey}`)
      .then(response => response.json())
      .then(data => {
        setImagenPortada(data.urls.regular);
      })
      .catch(error => console.error("Error al traer la imagen de Unsplash:", error));

  }, []);

  if (usuario) {
    return <BoardCliente />;
  }

  return (
    <div className="App">

      <MenuBar setCategoria={setCategoria} />

      {mostrarLogin && (
        <div className="modal-overlay" onClick={() => setMostrarLogin(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <UserLogin onLoginSuccess={() => {
              setUsuario(true);
              setMostrarLogin(false);
            }} />
          </div>
        </div>
      )}

      <div
        className="hero-section"
        style={{ backgroundImage: `url(${imagenPortada})` }}
      >
        <div className="hero-overlay">
            <button onClick={() => setMostrarLogin(true)} className="btn-comprar">Iniciar sesión</button>
        </div>
      </div>

      <ListaProductos categoria={categoria} />
    </div>
  );
}

export default Inicio;
