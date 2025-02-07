
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Administracion from './pages/Administracion';
import NBU from './pages/NBU';
import Recesos from './pages/Recesos';
import Capacitaciones from './pages/Capacitaciones';

// Protected route component that checks user type
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.user_type !== 'admin') {
    return <Navigate to="/menu" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route 
          path="/administracion" 
          element={
            <AdminRoute>
              <Administracion />
            </AdminRoute>
          } 
        />
        <Route 
          path="/nbu" 
          element={
            <AdminRoute>
              <NBU />
            </AdminRoute>
          } 
        />
        <Route path="/recesos" element={<Recesos />} />
        <Route path="/capacitaciones" element={<Capacitaciones />} />
      </Routes>
    </Router>
  );
}

export default App;
