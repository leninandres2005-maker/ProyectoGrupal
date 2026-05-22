import { useEffect, useState } from 'react';
import MenuBar from './MenuBar.jsx';
import './inicio.css';

function Inicio() {
  const [imagenPortada, setImagenPortada] = useState('');

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

  return (
    <div className="App">

      <MenuBar />

      <div
        className="hero-section"
        style={{ backgroundImage: `url(${imagenPortada})` }}
      >
        <div className="hero-overlay">
          <button className="btn-comprar">Comprar ahora</button>
        </div>
      </div>
    </div>
  );
}

export default Inicio;