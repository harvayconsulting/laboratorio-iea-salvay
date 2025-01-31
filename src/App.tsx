import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Administracion from './pages/Administracion';
import NBU from './pages/NBU';
import Recesos from './pages/Recesos';
import Capacitaciones from './pages/Capacitaciones';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/administracion" element={<Administracion />} />
        <Route path="/nbu" element={<NBU />} />
        <Route path="/recesos" element={<Recesos />} />
        <Route path="/capacitaciones" element={<Capacitaciones />} />
      </Routes>
    </Router>
  );
}

export default App;