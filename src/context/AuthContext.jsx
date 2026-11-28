
import {
  createContext,
  useContext,
  useState,
} from "react";

import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken")
  );

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  // Iniciar sesión
  const login = async (email, password) => {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (!data?.token) {
      throw new Error("La API no devolvió un token válido.");
    }

    localStorage.setItem("accessToken", data.token);
    setAccessToken(data.token);

    try {
      const response = await apiRequest("/api/auth/me");

      const userData =
        response?.user ||
        response?.data?.user ||
        response?.data ||
        response;

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return userData;
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setAccessToken(null);
      setUser(null);
      throw error;
    }
  };

  // Registrar usuario
  const register = async (nombre, matricula, email, password) => {
    return await apiRequest("/api/auth/register", {
      method: "POST",
      body: {
        nombre,
        matricula,
        email,
        password,
        rol: "USER",
      },
    });
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setAccessToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(accessToken);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
