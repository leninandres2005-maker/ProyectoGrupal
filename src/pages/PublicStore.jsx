import React, { useState } from 'react';
import MenuBarPublic from '../components/MenuBarPublic.jsx';
import Inicio from '../components/inicio.jsx';
import UserLogin from '../components/login.jsx';

function PublicStore({ onUserLogin }) {
    const [categoria, setCategoria] = useState('');
    const [mostrarLogin, setMostrarLogin] = useState(false);

    const manejarIntentoCarrito = () => {
        setMostrarLogin(true);
    };

    return (
        <div>
            <MenuBarPublic setCategoria={setCategoria} setVista={() => setMostrarLogin(true)} />
            
            <Inicio categoria={categoria} agregarAlCarrito={manejarIntentoCarrito} />

            {mostrarLogin && (
                <div className="modal-overlay" onClick={() => setMostrarLogin(false)}>
                    <div onClick={e => e.stopPropagation()}>
                        {/* Al loguearse con éxito, simulamos ir a la tienda de usuario */}
                        <UserLogin onLoginSuccess={onUserLogin} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default PublicStore;