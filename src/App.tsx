
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Toaster } from '@/components/ui/toaster';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
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
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { user } = useAuth();

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
