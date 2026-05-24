import { useEffect, useState, useRef } from "react";
import './inicio.css';

function ListaProductos({categoria}) {
    const [productos, setProductos] = useState([]);
    const accessKey = 'aVi9cRhtwFFKb55altpMyhGqH71RMBYq8vYBj-yNlps';
    const catalogoRef = useRef(null);

    useEffect(() => {

        const busqueda = categoria || 'minimalist-clothing';

        fetch(`https://api.unsplash.com/search/photos?query=${busqueda}&per_page=6&client_id=${accessKey}`)
            .then(response => response.json())
            .then(data => {

                const productosFormateados = data.results.map((foto, index) => {
                    return {
                        id: foto.id,
                        nombre: foto.alt_description || `Prenda Colección ${index + 1}`,
                        precio: Math.floor(Math.random() * (75 - 15 + 1)) + 15,
                        imagen: foto.urls.regular
                    };
                });

                setProductos(productosFormateados);
            })
            .catch(error => console.error("Error al obtener productos:", error));

            if (catalogoRef.current) {
                catalogoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

    }, [categoria]);

    return (
        <div className="new-producto" ref={catalogoRef}>
            {/* Encabezado */}
            <h2 className="product-title">Colección Minimalista</h2>
            <p className="product-description">
                Descubre nuestra última colección de ropa minimalista, diseñada para aquellos que aprecian la simplicidad y la elegancia.
            </p>

            {/* Grid de productos */}
            <div className="product-grid">
                {productos.map(producto => (
                    <div key={producto.id} className="product-card">
                        <div className="product-image-container">
                            <img src={producto.imagen} alt={producto.nombre} className="product-image" />
                        </div>

                        <div className="product-info">
                            <div className="product-text">
                                <h3 className="product-name">{producto.nombre}</h3>
                                <p className="product-price">${producto.precio}</p>
                            </div>
                            <button className="add-to-cart-button">🛒</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListaProductos;