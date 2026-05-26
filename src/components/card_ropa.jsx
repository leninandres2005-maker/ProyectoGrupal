import { useEffect, useState, useRef } from "react";
import './inicio.css';

function ListaProductos({ categoria, agregarAlCarrito }) {
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cantidad, setCantidad] = useState(1);

    const accessKey = 'aVi9cRhtwFFKb55altpMyhGqH71RMBYq8vYBj-yNlps';
    const sectionRef = useRef(null);

    // Efecto para hacer scroll automático cuando se selecciona una categoría
    useEffect(() => {
        if (categoria && sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [categoria]);

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

    }, [categoria]);

    const handleAgregar = () => {
        if (productoSeleccionado) {
            agregarAlCarrito(productoSeleccionado, cantidad);
            setProductoSeleccionado(null);
            setCantidad(1);
        }
    };

    return (
        <div className="new-producto" ref={sectionRef}>
            {/* Encabezado */}
            <h2 className="product-title">Colección Minimalista</h2>
            <p className="product-description">
                Descubre nuestra última colección de ropa minimalista, diseñada para aquellos que aprecian la simplicidad y la elegancia.
            </p>

            {/* Grid de productos */}
            <div className="product-grid">
                {productos.map(producto => (
                    <div key={producto.id} className="product-card" onClick={() => { setProductoSeleccionado(producto); setCantidad(1); }}>
                        <div className="product-image-container">
                            <img src={producto.imagen} alt={producto.nombre} className="product-image" />
                        </div>

                        <div className="product-info">
                            <div className="product-text">
                                <h3 className="product-name">{producto.nombre}</h3>
                                <p className="product-price">${producto.precio}</p>
                            </div>
                            <button className="add-to-cart-button">👁</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE DETALLE */}
            {productoSeleccionado && (
                <div className="modal-overlay" onClick={() => setProductoSeleccionado(null)}>
                    <div className="producto-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setProductoSeleccionado(null)}>✕</button>
                        <div className="modal-detalle-body">
                            <img src={productoSeleccionado.imagen} alt={productoSeleccionado.nombre} />
                            <div className="modal-info">
                                <h2>{productoSeleccionado.nombre}</h2>
                                <p className="modal-precio">${productoSeleccionado.precio}</p>
                                <p className="modal-desc">Calidad premium con diseño exclusivo de nuestra colección de temporada.</p>
                                
                                <div className="selector-cantidad">
                                    <label>Unidades:</label>
                                    <div className="controles">
                                        <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
                                        <span>{cantidad}</span>
                                        <button onClick={() => setCantidad(cantidad + 1)}>+</button>
                                    </div>
                                </div>

                                <button className="btn-comprar" onClick={handleAgregar}>
                                    Agregar al carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListaProductos;