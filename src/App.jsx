import { useState, useEffect } from 'react';
import StorePublic from './pages/PublicStore';
import UserStore from './pages/UserStore';
import LoginAdmin from './components/login_admin';
import Dashboard from './Boards/board_admin';
import BoardCliente from './Boards/board_cliente';

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [path, setPath] = useState(window.location.pathname);
  const [vista, setVista] = useState('tienda');
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const onLocationChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  if (path === '/admin') {
    return (
      <div className="App">
        {isAdminLoggedIn ? (
          <Dashboard />
        ) : (
          <LoginAdmin onLogin={() => setIsAdminLoggedIn(true)} />
        )}
      </div>
    );
  }

  return (
    <div className="App">
      {isUserLoggedIn ? (
        vista === 'tienda' ? (
          <UserStore setVista={setVista} carrito={carrito} setCarrito={setCarrito} />
        ) : (
          <BoardCliente setVista={setVista} carrito={carrito} setUsuario={setIsUserLoggedIn} />
        )
      ) : (
        <StorePublic onUserLogin={() => setIsUserLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;
