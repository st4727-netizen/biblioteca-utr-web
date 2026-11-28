
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import Catalogo from "./pages/Catalogo";
import Prestamos from "./pages/Prestamos";
import GestionUsuarios from "./pages/GestionUsuarios";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas exclusivas para ADMIN */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/gestion-usuarios" element={<GestionUsuarios />} />
          </Route>

          {/* Rutas para ADMIN y USER */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN", "USER"]} />}>
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/prestamos" element={<Prestamos />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;


