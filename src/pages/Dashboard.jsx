
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [libros, setLibros] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const extraerLista = (respuesta, claves = []) => {
    if (Array.isArray(respuesta)) return respuesta;

    if (!respuesta || typeof respuesta !== "object") return [];

    for (const clave of [...claves, "data", "results", "items"]) {
      if (Array.isArray(respuesta[clave])) {
        return respuesta[clave];
      }

      if (
        respuesta[clave] &&
        typeof respuesta[clave] === "object"
      ) {
        const resultado = extraerLista(respuesta[clave], claves);
        if (resultado.length > 0) return resultado;
      }
    }

    return [];
  };

  const cargarDashboard = async () => {
    setLoading(true);
    setError("");

    const resultados = await Promise.allSettled([
      apiRequest("/api/books"),
      apiRequest("/api/loans/books"),
      apiRequest("/api/users"),
    ]);

    let errores = 0;

    if (resultados[0].status === "fulfilled") {
      setLibros(extraerLista(resultados[0].value, ["books", "libros"]));
    } else {
      setLibros([]);
      errores++;
    }

    if (resultados[1].status === "fulfilled") {
      setPrestamos(extraerLista(resultados[1].value, ["loans", "prestamos"]));
    } else {
      setPrestamos([]);
      errores++;
    }

    if (resultados[2].status === "fulfilled") {
      setUsuarios(extraerLista(resultados[2].value, ["users", "usuarios"]));
    } else {
      setUsuarios([]);
      errores++;
    }

    if (errores === 3) {
      setError("No fue posible cargar la información del panel.");
    } else if (errores > 0) {
      setError("Algunos datos no pudieron cargarse. Puedes intentar actualizar.");
    }

    setLoading(false);
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cerrarSesion = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const prestamosActivos = prestamos.filter(
    (prestamo) => prestamo.estatus === "PRESTADO"
  );

  const prestamosVencidos = prestamos.filter(
    (prestamo) =>
      prestamo.estatus === "PRESTADO" && prestamo.vencido === true
  );

  const prestamosRecientes = [...prestamos]
    .sort((a, b) =>
      String(b.fechaPrestamo || "").localeCompare(
        String(a.fechaPrestamo || "")
      )
    )
    .slice(0, 5);

  const estilos = `
    * {
      box-sizing: border-box;
    }

    .dashboard-page {
      min-height: 100vh;
      background: #f3f5fa;
      color: #26334a;
      font-family: Arial, Helvetica, sans-serif;
    }

    .dashboard-sidebar {
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

    .dashboard-logo {
      padding: 0 12px 35px;
      border-bottom: 1px solid #ffffff25;
    }

    .dashboard-logo h2 {
      margin: 0 0 8px;
      font-size: 21px;
      letter-spacing: 1px;
    }

    .dashboard-logo p {
      margin: 0;
      color: #c7d7f5;
      font-size: 12px;
    }

    .dashboard-menu {
      display: flex;
      flex-direction: column;
      gap: 9px;
      margin-top: 30px;
    }

    .dashboard-menu button {
      padding: 13px 14px;
      border: none;
      border-radius: 7px;
      background: transparent;
      color: #dce7ff;
      text-align: left;
      font-size: 14px;
      cursor: pointer;
    }

    .dashboard-menu button:hover,
    .dashboard-menu .activo {
      background: #2454a4;
      color: white;
    }

    .dashboard-logout {
      margin-top: auto;
      padding: 12px;
      border: 1px solid #ffffff50;
      border-radius: 6px;
      background: transparent;
      color: white;
      cursor: pointer;
    }

    .dashboard-logout:hover {
      background: #ffffff18;
    }

    .dashboard-main {
      min-height: 100vh;
      margin-left: 245px;
    }

    .dashboard-topbar {
      min-height: 75px;
      padding: 0 35px;
      background: white;
      border-bottom: 1px solid #e5e9f1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .dashboard-topbar h2 {
      margin: 0;
      color: #18376e;
      font-size: 18px;
    }

    .dashboard-perfil {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #475569;
      font-size: 13px;
    }

    .dashboard-avatar {
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #e7edfc;
      color: #18376e;
      font-weight: bold;
    }

    .dashboard-contenido {
      max-width: 1250px;
      padding: 32px 35px;
      margin: 0 auto;
    }

    .dashboard-bienvenida {
      margin-bottom: 27px;
    }

    .dashboard-bienvenida h1 {
      margin: 0 0 8px;
      color: #18376e;
      font-size: 27px;
    }

    .dashboard-bienvenida p {
      margin: 0;
      color: #718096;
      font-size: 14px;
    }

    .dashboard-estadisticas {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 27px;
    }

    .dashboard-card {
      padding: 21px;
      background: white;
      border: 1px solid #e9edf5;
      border-radius: 9px;
      box-shadow: 0 3px 10px #18376e08;
    }

    .dashboard-card-icon {
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
      margin-bottom: 15px;
      border-radius: 8px;
      background: #eaf0ff;
      color: #2456a5;
      font-size: 19px;
    }

    .dashboard-card span {
      display: block;
      margin-bottom: 9px;
      color: #7b8799;
      font-size: 13px;
    }

    .dashboard-card strong {
      color: #18376e;
      font-size: 27px;
    }

    .dashboard-seccion {
      padding: 23px;
      margin-bottom: 24px;
      background: white;
      border: 1px solid #e9edf5;
      border-radius: 9px;
      box-shadow: 0 3px 10px #18376e08;
    }

    .dashboard-seccion h2 {
      margin: 0 0 20px;
      color: #18376e;
      font-size: 19px;
    }

    .dashboard-accesos {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }

    .dashboard-acceso {
      padding: 19px;
      border: 1px solid #e3e9f3;
      border-radius: 8px;
      background: #fbfcff;
      text-align: left;
      cursor: pointer;
      transition: 0.2s;
    }

    .dashboard-acceso:hover {
      border-color: #2456a5;
      background: #f2f6ff;
      transform: translateY(-2px);
    }

    .dashboard-acceso strong {
      display: block;
      margin-bottom: 7px;
      color: #18376e;
      font-size: 15px;
    }

    .dashboard-acceso span {
      color: #718096;
      font-size: 12px;
    }

    .dashboard-tabla-contenedor {
      width: 100%;
      overflow-x: auto;
    }

    .dashboard-tabla {
      width: 100%;
      border-collapse: collapse;
      white-space: nowrap;
      text-align: left;
    }

    .dashboard-tabla th {
      padding: 13px 12px;
      background: #f4f6fb;
      color: #64748b;
      font-size: 12px;
    }

    .dashboard-tabla td {
      padding: 14px 12px;
      border-bottom: 1px solid #edf0f5;
      color: #526078;
      font-size: 12px;
    }

    .dashboard-tabla td strong {
      color: #263b62;
    }

    .dashboard-estado {
      display: inline-block;
      padding: 6px 9px;
      border-radius: 20px;
      background: #e5f7ed;
      color: #16834b;
      font-size: 10px;
      font-weight: bold;
    }

    .dashboard-estado.devuelto {
      background: #e8edfb;
      color: #2456a5;
    }

    .dashboard-estado.vencido {
      background: #fdeaea;
      color: #c43c3c;
    }

    .dashboard-mensaje {
      padding: 20px;
      border-radius: 7px;
      background: #f4f6fb;
      color: #64748b;
      text-align: center;
      font-size: 13px;
    }

    .dashboard-alerta {
      margin-bottom: 20px;
      padding: 13px 16px;
      border: 1px solid #f1d6a5;
      border-radius: 7px;
      background: #fff9eb;
      color: #926316;
      font-size: 13px;
    }

    .dashboard-actualizar {
      padding: 10px 15px;
      border: none;
      border-radius: 6px;
      background: #2456a5;
      color: white;
      cursor: pointer;
    }

    @media (max-width: 1050px) {
      .dashboard-estadisticas {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .dashboard-accesos {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 700px) {
      .dashboard-sidebar {
        position: static;
        width: 100%;
        padding: 17px;
      }

      .dashboard-logo {
        padding-bottom: 15px;
      }

      .dashboard-menu {
        flex-direction: row;
        flex-wrap: wrap;
        margin-top: 15px;
      }

      .dashboard-logout {
        margin-top: 15px;
      }

      .dashboard-main {
        margin-left: 0;
      }

      .dashboard-topbar {
        padding: 15px;
      }

      .dashboard-contenido {
        padding: 22px 15px;
      }

      .dashboard-estadisticas {
        grid-template-columns: 1fr 1fr;
      }

      .dashboard-accesos {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <>
      <style>{estilos}</style>

      <div className="dashboard-page">
        <aside className="dashboard-sidebar">
          <div className="dashboard-logo">
            <h2>BIBLIOTECA UTR</h2>
            <p>Conocimiento que transforma.</p>
          </div>

          <nav className="dashboard-menu">
            <button className="activo">
              ▦ Panel principal
            </button>

            <button onClick={() => navigate("/catalogo")}>
              ▣ Catálogo
            </button>

            <button onClick={() => navigate("/prestamos")}>
              ▤ Préstamos
            </button>

            <button onClick={() => navigate("/gestion-usuarios")}>
              ♙ Gestión de usuarios
            </button>
          </nav>

          <button className="dashboard-logout" onClick={cerrarSesion}>
            ↪ Cerrar sesión
          </button>
        </aside>

        <div className="dashboard-main">
          <header className="dashboard-topbar">
            <h2>Biblioteca Universitaria</h2>

            <div className="dashboard-perfil">
              <div className="dashboard-avatar">
                {(user?.nombre || "A").charAt(0).toUpperCase()}
              </div>
              <span>{user?.nombre || "Administrador"}</span>
            </div>
          </header>

          <main className="dashboard-contenido">
            <section className="dashboard-bienvenida">
              <h1>Panel principal</h1>
              <p>
                Bienvenido al sistema de administración de la Biblioteca UTR.
                Consulta el estado general de la biblioteca.
              </p>
            </section>

            {error && (
              <div className="dashboard-alerta" role="alert">
                {error}
                <button
                  className="dashboard-actualizar"
                  onClick={cargarDashboard}
                  style={{ marginLeft: 12 }}
                >
                  Actualizar
                </button>
              </div>
            )}

            <section className="dashboard-estadisticas">
              <div className="dashboard-card">
                <div className="dashboard-card-icon">▣</div>
                <span>Total de libros</span>
                <strong>{loading ? "..." : libros.length}</strong>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-icon">♙</div>
                <span>Usuarios registrados</span>
                <strong>{loading ? "..." : usuarios.length}</strong>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-icon">▤</div>
                <span>Préstamos activos</span>
                <strong>{loading ? "..." : prestamosActivos.length}</strong>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-icon">◷</div>
                <span>Préstamos vencidos</span>
                <strong>{loading ? "..." : prestamosVencidos.length}</strong>
              </div>
            </section>

            <section className="dashboard-seccion">
              <h2>Accesos rápidos</h2>

              <div className="dashboard-accesos">
                <button
                  className="dashboard-acceso"
                  onClick={() => navigate("/catalogo")}
                >
                  <strong>▣ Consultar catálogo</strong>
                  <span>Revisa los libros disponibles en la biblioteca.</span>
                </button>

                <button
                  className="dashboard-acceso"
                  onClick={() => navigate("/prestamos")}
                >
                  <strong>▤ Administrar préstamos</strong>
                  <span>Consulta el historial y estado de los préstamos.</span>
                </button>

                <button
                  className="dashboard-acceso"
                  onClick={() => navigate("/gestion-usuarios")}
                >
                  <strong>♙ Gestionar usuarios</strong>
                  <span>Consulta los usuarios y sus roles registrados.</span>
                </button>
              </div>
            </section>

            <section className="dashboard-seccion">
              <h2>Préstamos recientes</h2>

              {loading ? (
                <div className="dashboard-mensaje">
                  Cargando información...
                </div>
              ) : prestamosRecientes.length === 0 ? (
                <div className="dashboard-mensaje">
                  No hay préstamos registrados.
                </div>
              ) : (
                <div className="dashboard-tabla-contenedor">
                  <table className="dashboard-tabla">
                    <thead>
                      <tr>
                        <th>Libro</th>
                        <th>Usuario</th>
                        <th>Fecha de préstamo</th>
                        <th>Devolución estimada</th>
                        <th>Estado</th>
                      </tr>
                    </thead>

                    <tbody>
                      {prestamosRecientes.map((prestamo) => (
                        <tr key={prestamo.loanId}>
                          <td>
                            <strong>{prestamo.libro}</strong>
                          </td>

                          <td>{prestamo.usuario}</td>

                          <td>{prestamo.fechaPrestamo}</td>

                          <td>{prestamo.fechaDevolucionEstimada}</td>

                          <td>
                            <span
                              className={`dashboard-estado ${
                                prestamo.estatus === "DEVUELTO"
                                  ? "devuelto"
                                  : prestamo.vencido
                                    ? "vencido"
                                    : ""
                              }`}
                            >
                              {prestamo.estatus}
                            </span>
                          </td>
                        </tr>
                      ))}
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

