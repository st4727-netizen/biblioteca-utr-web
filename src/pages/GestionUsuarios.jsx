
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function GestionUsuarios() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const extraerUsuarios = (respuesta) => {
    if (Array.isArray(respuesta)) return respuesta;

    if (Array.isArray(respuesta?.users)) return respuesta.users;
    if (Array.isArray(respuesta?.usuarios)) return respuesta.usuarios;
    if (Array.isArray(respuesta?.data)) return respuesta.data;

    if (Array.isArray(respuesta?.data?.users)) {
      return respuesta.data.users;
    }

    if (Array.isArray(respuesta?.data?.usuarios)) {
      return respuesta.data.usuarios;
    }

    return [];
  };

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError("");

      const respuesta = await apiRequest("/api/users");
      setUsuarios(extraerUsuarios(respuesta));
    } catch (error) {
      setError(error.message || "No fue posible cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cerrarSesion = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const termino = busqueda.toLowerCase();

    return (
      String(usuario.nombre || "").toLowerCase().includes(termino) ||
      String(usuario.email || "").toLowerCase().includes(termino) ||
      String(usuario.matricula || "").toLowerCase().includes(termino) ||
      String(usuario.rol || "").toLowerCase().includes(termino)
    );
  });

  const administradores = usuarios.filter(
    (usuario) => usuario.rol === "ADMIN"
  ).length;

  const alumnos = usuarios.filter(
    (usuario) => usuario.rol === "USER"
  ).length;

  const obtenerEstado = (usuario) => {
    if (typeof usuario.activo === "boolean") {
      return usuario.activo ? "Activo" : "Inactivo";
    }

    if (typeof usuario.active === "boolean") {
      return usuario.active ? "Activo" : "Inactivo";
    }

    if (usuario.estatus) return usuario.estatus;
    if (usuario.estado) return usuario.estado;

    return "No disponible";
  };

  const estilos = `
    * {
      box-sizing: border-box;
    }

    .usuarios-page {
      min-height: 100vh;
      background: #f3f5fa;
      color: #26334a;
      font-family: Arial, Helvetica, sans-serif;
    }

    .usuarios-sidebar {
      position: fixed;
      inset: 0 auto 0 0;
      width: 245px;
      padding: 30px 18px;
      background: #102d69;
      color: white;
      display: flex;
      flex-direction: column;
      z-index: 5;
    }

    .usuarios-logo {
      padding: 0 12px 35px;
      border-bottom: 1px solid #ffffff25;
    }

    .usuarios-logo h2 {
      margin: 0 0 8px;
      font-size: 21px;
      letter-spacing: 1px;
    }

    .usuarios-logo p {
      margin: 0;
      color: #c7d7f5;
      font-size: 12px;
    }

    .usuarios-menu {
      display: flex;
      flex-direction: column;
      gap: 9px;
      margin-top: 30px;
    }

    .usuarios-menu button {
      padding: 13px 14px;
      border: none;
      border-radius: 7px;
      background: transparent;
      color: #dce7ff;
      text-align: left;
      font-size: 14px;
      cursor: pointer;
    }

    .usuarios-menu button:hover,
    .usuarios-menu .activo {
      background: #2454a4;
      color: white;
    }

    .usuarios-logout {
      margin-top: auto;
      padding: 12px;
      border: 1px solid #ffffff50;
      border-radius: 6px;
      background: transparent;
      color: white;
      cursor: pointer;
    }

    .usuarios-logout:hover {
      background: #ffffff18;
    }

    .usuarios-main {
      min-height: 100vh;
      margin-left: 245px;
    }

    .usuarios-topbar {
      min-height: 75px;
      padding: 0 35px;
      background: white;
      border-bottom: 1px solid #e5e9f1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .usuarios-topbar h2 {
      margin: 0;
      color: #18376e;
      font-size: 18px;
    }

    .usuarios-perfil {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #475569;
      font-size: 13px;
    }

    .usuarios-avatar {
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #e7edfc;
      color: #18376e;
      font-weight: bold;
    }

    .usuarios-contenido {
      max-width: 1250px;
      padding: 32px 35px;
      margin: 0 auto;
    }

    .usuarios-bienvenida {
      margin-bottom: 25px;
    }

    .usuarios-bienvenida h1 {
      margin: 0 0 8px;
      color: #18376e;
      font-size: 27px;
    }

    .usuarios-bienvenida p {
      margin: 0;
      color: #718096;
      font-size: 14px;
    }

    .usuarios-resumen {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 25px;
    }

    .usuarios-card {
      padding: 21px;
      background: white;
      border: 1px solid #e9edf5;
      border-radius: 9px;
      box-shadow: 0 3px 10px #18376e08;
    }

    .usuarios-card span {
      display: block;
      margin-bottom: 10px;
      color: #7b8799;
      font-size: 13px;
    }

    .usuarios-card strong {
      color: #18376e;
      font-size: 26px;
    }

    .usuarios-seccion {
      padding: 23px;
      background: white;
      border: 1px solid #e9edf5;
      border-radius: 9px;
      box-shadow: 0 3px 10px #18376e08;
    }

    .usuarios-seccion-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
    }

    .usuarios-seccion-header h2 {
      margin: 0;
      color: #18376e;
      font-size: 19px;
    }

    .usuarios-controles {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .usuarios-busqueda {
      width: 290px;
      padding: 11px 14px;
      border: 1px solid #dce2ed;
      border-radius: 6px;
      outline: none;
      font-size: 13px;
    }

    .usuarios-busqueda:focus {
      border-color: #2456a5;
    }

    .usuarios-actualizar {
      padding: 11px 14px;
      border: none;
      border-radius: 6px;
      background: #2456a5;
      color: white;
      cursor: pointer;
    }

    .usuarios-actualizar:hover {
      background: #183f80;
    }

    .usuarios-tabla-contenedor {
      width: 100%;
      overflow-x: auto;
    }

    .usuarios-tabla {
      width: 100%;
      border-collapse: collapse;
      white-space: nowrap;
      text-align: left;
    }

    .usuarios-tabla th {
      padding: 13px 12px;
      background: #f4f6fb;
      color: #64748b;
      font-size: 12px;
    }

    .usuarios-tabla td {
      padding: 15px 12px;
      border-bottom: 1px solid #edf0f5;
      color: #526078;
      font-size: 12px;
    }

    .usuarios-tabla td strong {
      color: #263b62;
    }

    .usuarios-rol {
      display: inline-block;
      padding: 6px 10px;
      border-radius: 20px;
      background: #e8edfb;
      color: #2456a5;
      font-size: 10px;
      font-weight: bold;
    }

    .usuarios-rol.admin {
      background: #f0e9ff;
      color: #7542b8;
    }

    .usuarios-estado {
      color: #16834b;
      font-weight: bold;
    }

    .usuarios-estado.inactivo {
      color: #c43c3c;
    }

    .usuarios-mensaje {
      padding: 25px;
      border-radius: 8px;
      background: #f4f6fb;
      color: #64748b;
      text-align: center;
      font-size: 13px;
    }

    .usuarios-error {
      margin-bottom: 18px;
      padding: 13px 16px;
      border: 1px solid #f1caca;
      border-radius: 7px;
      background: #fff0f0;
      color: #b33b3b;
      font-size: 13px;
    }

    @media (max-width: 900px) {
      .usuarios-resumen {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 700px) {
      .usuarios-sidebar {
        position: static;
        width: 100%;
        padding: 17px;
      }

      .usuarios-logo {
        padding-bottom: 15px;
      }

      .usuarios-menu {
        flex-direction: row;
        flex-wrap: wrap;
        margin-top: 15px;
      }

      .usuarios-logout {
        margin-top: 15px;
      }

      .usuarios-main {
        margin-left: 0;
      }

      .usuarios-topbar {
        padding: 15px;
      }

      .usuarios-contenido {
        padding: 22px 15px;
      }

      .usuarios-seccion-header {
        align-items: stretch;
        flex-direction: column;
      }

      .usuarios-controles {
        flex-direction: column;
        align-items: stretch;
      }

      .usuarios-busqueda {
        width: 100%;
      }
    }
  `;

  return (
    <>
      <style>{estilos}</style>

      <div className="usuarios-page">
        <aside className="usuarios-sidebar">
          <div className="usuarios-logo">
            <h2>BIBLIOTECA UTR</h2>
            <p>Conocimiento que transforma.</p>
          </div>

          <nav className="usuarios-menu">
            <button onClick={() => navigate("/")}>
              ▦ Panel principal
            </button>

            <button onClick={() => navigate("/catalogo")}>
              ▣ Catálogo
            </button>

            <button onClick={() => navigate("/prestamos")}>
              ▤ Préstamos
            </button>

            <button className="activo">
              ♙ Gestión de usuarios
            </button>
          </nav>

          <button className="usuarios-logout" onClick={cerrarSesion}>
            ↪ Cerrar sesión
          </button>
        </aside>

        <div className="usuarios-main">
          <header className="usuarios-topbar">
            <h2>Biblioteca Universitaria</h2>

            <div className="usuarios-perfil">
              <div className="usuarios-avatar">
                {(user?.nombre || "A").charAt(0).toUpperCase()}
              </div>
              <span>{user?.nombre || "Administrador"}</span>
            </div>
          </header>

          <main className="usuarios-contenido">
            <section className="usuarios-bienvenida">
              <h1>Gestión de usuarios</h1>
              <p>
                Consulta los usuarios registrados y sus roles
                dentro de la Biblioteca UTR.
              </p>
            </section>

            <section className="usuarios-resumen">
              <div className="usuarios-card">
                <span>Total de usuarios</span>
                <strong>{loading ? "..." : usuarios.length}</strong>
              </div>

              <div className="usuarios-card">
                <span>Administradores</span>
                <strong>{loading ? "..." : administradores}</strong>
              </div>

              <div className="usuarios-card">
                <span>Alumnos</span>
                <strong>{loading ? "..." : alumnos}</strong>
              </div>
            </section>

            <section className="usuarios-seccion">
              <div className="usuarios-seccion-header">
                <h2>Usuarios registrados</h2>

                <div className="usuarios-controles">
                  <input
                    className="usuarios-busqueda"
                    type="search"
                    placeholder="Buscar por nombre, matrícula o correo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />

                  <button
                    className="usuarios-actualizar"
                    onClick={cargarUsuarios}
                    disabled={loading}
                  >
                    Actualizar
                  </button>
                </div>
              </div>

              {error && (
                <div className="usuarios-error" role="alert">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="usuarios-mensaje">
                  Cargando usuarios...
                </div>
              ) : usuariosFiltrados.length === 0 ? (
                <div className="usuarios-mensaje">
                  No se encontraron usuarios.
                </div>
              ) : (
                <div className="usuarios-tabla-contenedor">
                  <table className="usuarios-tabla">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Matrícula</th>
                        <th>Correo electrónico</th>
                        <th>Rol</th>
                        <th>Estado</th>
                      </tr>
                    </thead>

                    <tbody>
                      {usuariosFiltrados.map((usuario, indice) => {
                        const estado = obtenerEstado(usuario);

                        return (
                          <tr key={usuario.id || usuario._id || indice}>
                            <td>
                              <strong>
                                {usuario.nombre || "Sin nombre"}
                              </strong>
                            </td>

                            <td>{usuario.matricula || "—"}</td>

                            <td>{usuario.email || "—"}</td>

                            <td>
                              <span
                                className={`usuarios-rol ${
                                  usuario.rol === "ADMIN" ? "admin" : ""
                                }`}
                              >
                                {usuario.rol || "Sin rol"}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`usuarios-estado ${
                                  estado === "Inactivo" ? "inactivo" : ""
                                }`}
                              >
                                {estado}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
