import React, { useState } from 'react';
import MenuBarUser from '../components/MenuBarUser.jsx';
import Inicio from '../components/inicio.jsx';

function UserStore({ setVista, carrito, setCarrito }) {
    const [categoria, setCategoria] = useState('');

    const agregarAlCarrito = (producto, cantidad) => {
        setCarrito([...carrito, { ...producto, cantidad }]);
        alert(`¡${cantidad}x ${producto.nombre} añadido al carrito!`);
    };

    return (
        <div>
            {/* Pasamos usuario={true} para que el menú muestre el perfil */}
            <MenuBarUser setCategoria={setCategoria} usuario={true} setVista={setVista} />
            <Inicio categoria={categoria} agregarAlCarrito={agregarAlCarrito} />
        </div>
    );
}

export default UserStore;
