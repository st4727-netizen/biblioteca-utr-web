
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Prestamos() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [devolviendoId, setDevolviendoId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const esAdmin = user?.rol === "ADMIN";

  const cargarPrestamos = async () => {
    try {
      setLoading(true);
      setError("");

      const respuesta = await apiRequest("/api/loans/books");
      setPrestamos(Array.isArray(respuesta) ? respuesta : []);
    } catch (error) {
      setError(error.message || "No fue posible cargar los préstamos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const cerrarSesion = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const registrarDevolucion = async (prestamo) => {
    const confirmar = window.confirm(
      `¿Deseas registrar la devolución del libro "${prestamo.libro}"?`
    );

    if (!confirmar) return;

    const observaciones = window.prompt(
      "Escribe las observaciones de la devolución:",
      "Entregado en buen estado"
    );

    if (observaciones === null) return;

    try {
      setDevolviendoId(prestamo.loanId);
      setMensaje("");

      await apiRequest(`/api/loans/books/${prestamo.loanId}/return`, {
        method: "PATCH",
        body: {
          observaciones: observaciones.trim(),
        },
      });

      setMensaje("Devolución registrada correctamente.");

      // Consultamos nuevamente para obtener el estado actualizado.
      await cargarPrestamos();
    } catch (error) {
      window.alert(
        error.message || "No fue posible registrar la devolución."
      );
    } finally {
      setDevolviendoId(null);
    }
  };

  const prestamosFiltrados = prestamos.filter((prestamo) => {
    const termino = busqueda.toLowerCase();

    return (
      (prestamo.libro || "").toLowerCase().includes(termino) ||
      (prestamo.autor || "").toLowerCase().includes(termino) ||
      (prestamo.usuario || "").toLowerCase().includes(termino) ||
      (prestamo.matricula || "").toLowerCase().includes(termino)
    );
  });

  const activos = prestamos.filter(
    (prestamo) => prestamo.estatus === "PRESTADO"
  ).length;

  const devueltos = prestamos.filter(
    (prestamo) => prestamo.estatus === "DEVUELTO"
  ).length;

  const vencidos = prestamos.filter(
    (prestamo) =>
      prestamo.estatus === "PRESTADO" && prestamo.vencido === true
  ).length;

  const estilos = `
    * {
      box-sizing: border-box;
    }

    .prestamos-page {
      min-height: 100vh;
      background: #f3f5fa;
      font-family: Arial, Helvetica, sans-serif;
      color: #26334a;
    }

    .prestamos-sidebar {
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

    .prestamos-logo {
      padding: 0 12px 35px;
      border-bottom: 1px solid #ffffff25;
    }

    .prestamos-logo h2 {
      margin: 0 0 8px;
      font-size: 21px;
      letter-spacing: 1px;
    }

    .prestamos-logo p {
      margin: 0;
      color: #c7d7f5;
      font-size: 12px;
    }

    .prestamos-menu {
      display: flex;
      flex-direction: column;
      gap: 9px;
      margin-top: 30px;
    }

    .prestamos-menu button {
      padding: 13px 14px;
      border: none;
      border-radius: 7px;
      background: transparent;
      color: #dce7ff;
      text-align: left;
      font-size: 14px;
      cursor: pointer;
    }

    .prestamos-menu button:hover,
    .prestamos-menu .activo {
      background: #2454a4;
      color: white;
    }

    .prestamos-logout {
      margin-top: auto;
      padding: 12px;
      border: 1px solid #ffffff50;
      border-radius: 6px;
      background: transparent;
      color: white;
      cursor: pointer;
    }

    .prestamos-logout:hover {
      background: #ffffff18;
    }

    .prestamos-main {
      min-height: 100vh;
      margin-left: 245px;
    }

    .prestamos-topbar {
      min-height: 75px;
      padding: 0 35px;
      background: white;
      border-bottom: 1px solid #e5e9f1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .prestamos-topbar h2 {
      margin: 0;
      color: #18376e;
      font-size: 18px;
    }

    .prestamos-perfil {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #475569;
      font-size: 13px;
    }

    .prestamos-avatar {
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #e7edfc;
      color: #18376e;
      font-weight: bold;
    }

    .prestamos-contenido {
      max-width: 1250px;
      padding: 32px 35px;
      margin: 0 auto;
    }

    .prestamos-bienvenida {
      margin-bottom: 25px;
    }

    .prestamos-bienvenida h1 {
      margin: 0 0 8px;
      color: #18376e;
      font-size: 27px;
    }

    .prestamos-bienvenida p {
      margin: 0;
      color: #718096;
      font-size: 14px;
    }

    .prestamos-resumen {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 25px;
    }

    .prestamos-card {
      padding: 20px;
      background: white;
      border: 1px solid #e9edf5;
      border-radius: 9px;
      box-shadow: 0 3px 10px #18376e08;
    }

    .prestamos-card span {
      display: block;
      margin-bottom: 10px;
      color: #7b8799;
      font-size: 13px;
    }

    .prestamos-card strong {
      color: #18376e;
      font-size: 25px;
    }

    .prestamos-seccion {
      padding: 23px;
      background: white;
      border: 1px solid #e9edf5;
      border-radius: 9px;
      box-shadow: 0 3px 10px #18376e08;
    }

    .prestamos-seccion-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
    }

    .prestamos-seccion-header h2 {
      margin: 0;
      color: #18376e;
      font-size: 19px;
    }

    .prestamos-busqueda {
      width: 100%;
      max-width: 340px;
      padding: 11px 14px;
      border: 1px solid #dce2ed;
      border-radius: 6px;
      outline: none;
      font-size: 13px;
    }

    .prestamos-tabla-contenedor {
      width: 100%;
      overflow-x: auto;
    }

    .prestamos-tabla {
      width: 100%;
      border-collapse: collapse;
      white-space: nowrap;
      text-align: left;
    }

    .prestamos-tabla th {
      padding: 13px 12px;
      background: #f4f6fb;
      color: #64748b;
      font-size: 12px;
      font-weight: bold;
    }

    .prestamos-tabla td {
      padding: 15px 12px;
      border-bottom: 1px solid #edf0f5;
      color: #526078;
      font-size: 12px;
    }

    .prestamos-tabla td strong {
      color: #263b62;
    }

    .prestamos-estado {
      display: inline-block;
      padding: 6px 9px;
      border-radius: 20px;
      background: #e5f7ed;
      color: #16834b;
      font-size: 10px;
      font-weight: bold;
    }

    .prestamos-estado.devuelto {
      background: #e8edfb;
      color: #2456a5;
    }

    .prestamos-vencido {
      color: #c43c3c;
      font-weight: bold;
    }

    .prestamos-al-dia {
      color: #16834b;
      font-weight: bold;
    }

    .prestamos-mensaje {
      padding: 25px;
      border-radius: 8px;
      background: white;
      text-align: center;
      color: #526078;
    }

    .prestamos-boton {
      padding: 10px 15px;
      margin-top: 12px;
      border: none;
      border-radius: 5px;
      background: #2456a5;
      color: white;
      cursor: pointer;
    }

    .prestamos-devolver {
      padding: 8px 11px;
      border: none;
      border-radius: 5px;
      background: #16834b;
      color: white;
      font-size: 11px;
      cursor: pointer;
    }

    .prestamos-devolver:hover {
      background: #116b3c;
    }

    .prestamos-devolver:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }

    .prestamos-alerta {
      padding: 12px 15px;
      margin-bottom: 18px;
      border: 1px solid #b7e4c7;
      border-radius: 6px;
      background: #eaf8ef;
      color: #16834b;
      font-size: 13px;
    }

    @media (max-width: 1000px) {
      .prestamos-resumen {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 700px) {
      .prestamos-sidebar {
        position: static;
        width: 100%;
        padding: 17px;
      }

      .prestamos-logo {
        padding-bottom: 15px;
      }

      .prestamos-menu {
        flex-direction: row;
        flex-wrap: wrap;
        margin-top: 15px;
      }

      .prestamos-logout {
        margin-top: 15px;
      }

      .prestamos-main {
        margin-left: 0;
      }

      .prestamos-topbar {
        padding: 15px;
      }

      .prestamos-contenido {
        padding: 22px 15px;
      }

      .prestamos-resumen {
        grid-template-columns: 1fr 1fr;
      }

      .prestamos-seccion-header {
        align-items: stretch;
        flex-direction: column;
      }

      .prestamos-busqueda {
        max-width: none;
      }
    }
  `;

  if (loading) {
    return (
      <>
        <style>{estilos}</style>
        <main className="prestamos-page">
          <div className="prestamos-mensaje">
            Cargando préstamos...
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{estilos}</style>
        <main className="prestamos-page">
          <div className="prestamos-mensaje">
            <h2>Error al cargar los préstamos</h2>
            <p role="alert">{error}</p>
            <button className="prestamos-boton" onClick={cargarPrestamos}>
              Reintentar
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <style>{estilos}</style>

      <div className="prestamos-page">
        <aside className="prestamos-sidebar">
          <div className="prestamos-logo">
            <h2>BIBLIOTECA UTR</h2>
            <p>Conocimiento que transforma.</p>
          </div>

          <nav className="prestamos-menu">
            <button onClick={() => navigate("/catalogo")}>
              ▣ Catálogo
            </button>

            <button className="activo">
              ▤ {esAdmin ? "Préstamos" : "Mis préstamos"}
            </button>
          </nav>

          <button className="prestamos-logout" onClick={cerrarSesion}>
            ↪ Cerrar sesión
          </button>
        </aside>

        <div className="prestamos-main">
          <header className="prestamos-topbar">
            <h2>Biblioteca Universitaria</h2>

            <div className="prestamos-perfil">
              <div className="prestamos-avatar">
                {(user?.nombre || "U").charAt(0).toUpperCase()}
              </div>
              <span>{user?.nombre || "Usuario"}</span>
            </div>
          </header>

          <main className="prestamos-contenido">
            <section className="prestamos-bienvenida">
              <h1>{esAdmin ? "Gestión de préstamos" : "Mis préstamos"}</h1>
              <p>
                {esAdmin
                  ? "Consulta y administra los préstamos de la Biblioteca UTR."
                  : "Consulta el historial y estado de tus préstamos en la Biblioteca UTR."}
              </p>
            </section>

            <section className="prestamos-resumen">
              <div className="prestamos-card">
                <span>Total de préstamos</span>
                <strong>{prestamos.length}</strong>
              </div>

              <div className="prestamos-card">
                <span>Préstamos activos</span>
                <strong>{activos}</strong>
              </div>

              <div className="prestamos-card">
                <span>Libros devueltos</span>
                <strong>{devueltos}</strong>
              </div>

              <div className="prestamos-card">
                <span>Préstamos vencidos</span>
                <strong>{vencidos}</strong>
              </div>
            </section>

            <section className="prestamos-seccion">
              <div className="prestamos-seccion-header">
                <h2>Historial de préstamos</h2>

                <input
                  className="prestamos-busqueda"
                  type="search"
                  placeholder="Buscar libro o usuario..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              {mensaje && (
                <div className="prestamos-alerta" role="status">
                  {mensaje}
                </div>
              )}

              {prestamosFiltrados.length === 0 ? (
                <div className="prestamos-mensaje">
                  No se encontraron préstamos.
                </div>
              ) : (
                <div className="prestamos-tabla-contenedor">
                  <table className="prestamos-tabla">
                    <thead>
                      <tr>
                        <th>Libro</th>
                        <th>Usuario</th>
                        <th>Fecha préstamo</th>
                        <th>Devolución estimada</th>
                        <th>Estado</th>
                        <th>Vencimiento</th>
                        {esAdmin && <th>Acciones</th>}
                      </tr>
                    </thead>

                    <tbody>
                      {prestamosFiltrados.map((prestamo) => (
                        <tr key={prestamo.loanId}>
                          <td>
                            <strong>{prestamo.libro}</strong>
                            <br />
                            {prestamo.autor}
                          </td>

                          <td>
                            {prestamo.usuario}
                            <br />
                            {prestamo.matricula}
                          </td>

                          <td>{prestamo.fechaPrestamo}</td>

                          <td>{prestamo.fechaDevolucionEstimada}</td>

                          <td>
                            <span
                              className={`prestamos-estado ${
                                prestamo.estatus === "DEVUELTO"
                                  ? "devuelto"
                                  : ""
                              }`}
                            >
                              {prestamo.estatus}
                            </span>
                          </td>

                          <td>
                            {prestamo.estatus === "DEVUELTO" ? (
                              "Finalizado"
                            ) : prestamo.vencido ? (
                              <span className="prestamos-vencido">
                                Vencido
                              </span>
                            ) : (
                              <span className="prestamos-al-dia">
                                Al corriente
                              </span>
                            )}
                          </td>

                          {esAdmin && (
                            <td>
                              {prestamo.estatus === "PRESTADO" ? (
                                <button
                                  className="prestamos-devolver"
                                  disabled={devolviendoId === prestamo.loanId}
                                  onClick={() => registrarDevolucion(prestamo)}
                                >
                                  {devolviendoId === prestamo.loanId
                                    ? "Procesando..."
                                    : "Registrar devolución"}
                                </button>
                              ) : (
                                <span>Sin acciones</span>
                              )}
                            </td>
                          )}
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
