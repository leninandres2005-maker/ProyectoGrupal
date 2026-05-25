import './App.css';
import Formulario from './components/Formulario.jsx';
import Inicio from './components/inicio.jsx';
import PieDePagina from './components/PieDePagina.jsx';
import Login from './dasboardAdmin/login.jsx';
import Dashboard from './dasboardAdmin/dasboard.jsx';

function App() {
  const path = window.location.pathname.toLowerCase();

  const abrirDashboard = () => {
    window.location.href = '/dashboard';
  };

  if (path === '/login') {
    return <Login onLogin={abrirDashboard} />;
  }

  if (path === '/dashboard') {
    return <Dashboard />;
  }

  return (
    <>
      <Inicio />
      <Formulario/>
      <PieDePagina/>
    </>
  );
}

export default App;
