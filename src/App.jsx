import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importación de Vistas
import LoginView from './views/login/login';
import DashboardView from './views/dashboard/dashboard';
import ConfigAdminView from './views/config-admin/config-admin';
import ClienteQrView from './views/cliente-qr/cliente-qr';
import Navbar from './components/navbar/Navbar';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import UsuariosView from './views/usuarios/UsuariosView';
import GestionSalones from './views/admin/GestionSalones';

// Componente Wrapper para Proteger Rutas Privadas
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // Si no hay token, redirige al Login
    return <Navigate to="/login" replace />;
  }

  return <><Navbar />{children}</>;
}

function AdminRoute({ children }) {
  const { isAdmin } = useAuth();

  return isAdmin ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
        {/* ----- RUTA PÚBLICA DE AUTENTICACIÓN ----- */}
        <Route path="/login" element={<LoginView />} />

        {/* ----- RUTA PÚBLICA PARA CLIENTES (ESCÁNER QR) ----- */}
        <Route path="/qr/:qr_token" element={<ClienteQrView />} />

        {/* ----- RUTAS PROTEGIDAS (GARZONES / CAJA / ADMIN) ----- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/config"
          element={
            <ProtectedRoute>
              <ConfigAdminView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UsuariosView />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/salones"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <GestionSalones />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* ----- REDIRECCIONES POR DEFECTO ----- */}
        {/* Redirige la raíz al dashboard (si está autenticado, irá al dashboard; si no, ProtectedRoute lo manda al login) */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Captura cualquier otra URL no definida y redirige a la raíz */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
