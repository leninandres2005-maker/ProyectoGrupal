import { useEffect, useState } from 'react';
import ListaProductos from './card_ropa.jsx';
import Formulario from './Formulario.jsx';
import './inicio.css';
import PieDePagina from './PieDePagina.jsx';

function Inicio({ categoria, agregarAlCarrito }) {
  const [imagenes, setImagenes] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);

  useEffect(() => {
    const query = 'fashion-clothing';
    const accessKey = 'aVi9cRhtwFFKb55altpMyhGqH71RMBYq8vYBj-yNlps';

    // Pedimos 5 imágenes a la vez
    fetch(`https://api.unsplash.com/photos/random?query=${query}&count=5&client_id=${accessKey}`)
      .then(response => response.json())
      .then(data => {
        setImagenes(data.map(img => img.urls.regular));
      })
      .catch(error => console.error("Error al traer las imágenes de Unsplash:", error));
  }, []);

  const siguienteImagen = () => {
    setIndiceActual((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  const anteriorImagen = () => {
    setIndiceActual((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  return (
    <div>
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${imagenes[indiceActual] || ''})` }}
      >
        {imagenes.length > 0 && (
          <>
            <button className="carousel-control prev" onClick={anteriorImagen}>❮</button>
            <button className="carousel-control next" onClick={siguienteImagen}>❯</button>
            
            <div className="carousel-indicators">
              {imagenes.map((_, index) => (
                <span 
                  key={index} 
                  className={`dot ${index === indiceActual ? 'active' : ''}`}
                  onClick={() => setIndiceActual(index)}
                />
              ))}
            </div>
          </>
        )}

        <div className="hero-overlay">
          <h1>Jenna</h1>
          <p style={{ letterSpacing: '4px', fontSize: '1.2rem', marginTop: '10px' }}>NUEVA COLECCIÓN 2026</p>
        </div>
      </div>

      <ListaProductos categoria={categoria} agregarAlCarrito={agregarAlCarrito} />
      <Formulario />
      <PieDePagina />

    </div>
  );
}

export default Inicio;
