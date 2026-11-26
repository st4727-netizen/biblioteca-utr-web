
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Catalogo() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [fechaDevolucion, setFechaDevolucion] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cargarLibros = async () => {
    try {
      setLoading(true);
      setError("");

      const respuesta = await apiRequest("/api/books");
      setLibros(Array.isArray(respuesta) ? respuesta : []);
    } catch (error) {
      setError(error.message || "No fue posible cargar los libros.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarLibros();
  }, []);

  const cerrarSesion = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const seleccionarLibro = (libro) => {
    setLibroSeleccionado(libro);
    setFechaDevolucion("");
  };

  const solicitarPrestamo = async (e) => {
    e.preventDefault();

    if (!libroSeleccionado || !fechaDevolucion) {
      alert("Selecciona una fecha de devolución.");
      return;
    }

    try {
      setEnviando(true);

      const respuesta = await apiRequest("/api/loans/books", {
        method: "POST",
        body: {
          bookId: libroSeleccionado.id,
          fechaDevolucionEstimada: fechaDevolucion,
        },
      });

      alert(
        respuesta?.message ||
        "¡Solicitud de préstamo registrada correctamente!"
      );

      setLibroSeleccionado(null);
      setFechaDevolucion("");
      await cargarLibros();
    } catch (error) {
      alert(error.message || "No fue posible solicitar el préstamo.");
    } finally {
      setEnviando(false);
    }
  };

  const librosFiltrados = libros.filter((libro) => {
    const termino = busqueda.toLowerCase();

    return (
      (libro.titulo || "").toLowerCase().includes(termino) ||
      (libro.autor || "").toLowerCase().includes(termino) ||
      (libro.categoria || "").toLowerCase().includes(termino)
    );
  });

  const estilos = `
    * {
      box-sizing: border-box;
    }

    .catalogo-page {
      min-height: 100vh;
      background: #f3f5fa;
      font-family: Arial, Helvetica, sans-serif;
      color: #26334a;
    }

    .catalogo-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 245px;
      padding: 30px 18px;
      background: #102d69;
      color: white;
      display: flex;
      flex-direction: column;
      z-index: 5;
    }

    .catalogo-logo {
      padding: 0 12px 35px;
      border-bottom: 1px solid #ffffff25;
    }

    .catalogo-logo h2 {
      margin: 0 0 8px;
      font-size: 21px;
      letter-spacing: 1px;
    }

    .catalogo-logo p {
      margin: 0;
      color: #c7d7f5;
      font-size: 12px;
    }

    .catalogo-menu {
      display: flex;
      flex-direction: column;
      gap: 9px;
      margin-top: 30px;
    }

    .catalogo-menu button {
      padding: 13px 14px;
      border: none;
      border-radius: 7px;
      background: transparent;
      color: #dce7ff;
      text-align: left;
      font-size: 14px;
      cursor: pointer;
    }

    .catalogo-menu button:hover,
    .catalogo-menu .activo {
      background: #2454a4;
      color: white;
    }

    .catalogo-main {
      margin-left: 245px;
      min-height: 100vh;
    }

    .catalogo-topbar {
      height: 75px;
      padding: 0 35px;
      background: white;
      border-bottom: 1px solid #e5e9f1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .catalogo-topbar h2 {
      margin: 0;
      font-size: 18px;
      color: #18376e;
    }

    .catalogo-perfil {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      color: #475569;
    }

    .catalogo-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: #e7edfc;
      color: #18376e;
      font-weight: bold;
    }

    .catalogo-contenido {
      max-width: 1250px;
      padding: 32px 35px;
      margin: 0 auto;
    }

    .catalogo-bienvenida {
      margin-bottom: 25px;
    }

    .catalogo-bienvenida h1 {
      margin: 0 0 8px;
      font-size: 27px;
      color: #18376e;
    }

    .catalogo-bienvenida p {
      margin: 0;
      color: #718096;
      font-size: 14px;
    }

    .catalogo-resumen {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 17px;
      margin-bottom: 25px;
    }

    .catalogo-resumen-card {
      padding: 20px;
      background: white;
      border: 1px solid #e9edf5;
      border-radius: 9px;
      box-shadow: 0 3px 10px #18376e08;
    }

    .catalogo-resumen-card span {
      display: block;
      color: #7b8799;
      font-size: 13px;
      margin-bottom: 10px;
    }

    .catalogo-resumen-card strong {
      color: #18376e;
      font-size: 25px;
    }

    .catalogo-seccion {
      padding: 23px;
      background: white;
      border: 1px solid #e9edf5;
      border-radius: 9px;
      box-shadow: 0 3px 10px #18376e08;
    }

    .catalogo-seccion-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
    }

    .catalogo-seccion-header h2 {
      margin: 0;
      color: #18376e;
      font-size: 19px;
    }

    .catalogo-busqueda {
      width: 100%;
      max-width: 360px;
      padding: 11px 14px;
      border: 1px solid #dce2ed;
      border-radius: 6px;
      outline: none;
      font-size: 13px;
    }

    .catalogo-busqueda:focus {
      border-color: #376bd0;
      box-shadow: 0 0 0 3px #376bd018;
    }

    .catalogo-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 17px;
    }

    .catalogo-libro {
      overflow: hidden;
      border: 1px solid #e6eaf2;
      border-radius: 8px;
      background: white;
      transition: transform .2s, box-shadow .2s;
    }

    .catalogo-libro:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 18px #18376e15;
    }

    .catalogo-portada {
      height: 155px;
      padding: 17px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: white;
      background: linear-gradient(135deg, #2456a5, #102d69);
    }

    .catalogo-portada:nth-child(4n) {
      background: linear-gradient(135deg, #438b92, #20535f);
    }

    .catalogo-portada span {
      font-size: 10px;
      font-weight: bold;
      letter-spacing: 2px;
    }

    .catalogo-portada strong {
      font-family: Georgia, serif;
      font-size: 19px;
      overflow-wrap: anywhere;
    }

    .catalogo-portada small {
      font-size: 11px;
      opacity: .85;
    }

    .catalogo-libro-info {
      padding: 17px;
    }

    .catalogo-libro-info h3 {
      margin: 0 0 12px;
      color: #18376e;
      font-size: 16px;
    }

    .catalogo-libro-info p {
      margin: 7px 0;
      color: #64748b;
      font-size: 12px;
    }

    .catalogo-estado {
      display: inline-block;
      margin-top: 8px;
      padding: 6px 9px;
      border-radius: 20px;
      background: #e5f7ed;
      color: #16834b;
      font-size: 11px;
      font-weight: bold;
    }

    .catalogo-estado.agotado {
      background: #fde8e8;
      color: #bd3434;
    }

    .catalogo-boton {
      width: 100%;
      margin-top: 13px;
      padding: 10px;
      border: none;
      border-radius: 5px;
      background: #2456a5;
      color: white;
      font-weight: bold;
      font-size: 12px;
      cursor: pointer;
    }

    .catalogo-boton:hover:not(:disabled) {
      background: #173f83;
    }

    .catalogo-boton:disabled {
      opacity: .55;
      cursor: not-allowed;
    }

    .catalogo-logout {
      margin-top: auto;
      padding: 12px;
      border: 1px solid #ffffff50;
      border-radius: 6px;
      background: transparent;
      color: white;
      cursor: pointer;
    }

    .catalogo-logout:hover {
      background: #ffffff18;
    }

    .catalogo-modal-fondo {
      position: fixed;
      inset: 0;
      z-index: 20;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background: #07152dcc;
    }

    .catalogo-modal {
      width: 100%;
      max-width: 430px;
      padding: 27px;
      border-radius: 10px;
      background: white;
      box-shadow: 0 15px 45px #0003;
    }

    .catalogo-modal h2 {
      margin: 0 0 18px;
      color: #18376e;
      font-size: 21px;
    }

    .catalogo-modal p {
      color: #64748b;
      font-size: 13px;
    }

    .catalogo-modal label {
      display: block;
      margin: 20px 0 8px;
      color: #34445e;
      font-size: 13px;
      font-weight: bold;
    }

    .catalogo-modal input {
      width: 100%;
      padding: 11px;
      border: 1px solid #dce2ed;
      border-radius: 5px;
    }

    .catalogo-modal-acciones {
      display: flex;
      gap: 10px;
      margin-top: 18px;
    }

    .catalogo-cancelar {
      background: #e8edf5;
      color: #34445e;
    }

    .catalogo-mensaje {
      padding: 25px;
      background: white;
      border-radius: 8px;
      color: #34445e;
    }

    @media (max-width: 1000px) {
      .catalogo-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 700px) {
      .catalogo-sidebar {
        position: static;
        width: 100%;
        padding: 17px;
      }

      .catalogo-logo {
        padding-bottom: 15px;
      }

      .catalogo-menu {
        flex-direction: row;
        flex-wrap: wrap;
        margin-top: 15px;
      }

      .catalogo-logout {
        margin-top: 15px;
      }

      .catalogo-main {
        margin-left: 0;
      }

      .catalogo-topbar {
        height: auto;
        min-height: 65px;
        padding: 15px;
      }

      .catalogo-contenido {
        padding: 22px 15px;
      }

      .catalogo-resumen {
        grid-template-columns: 1fr;
      }

      .catalogo-grid {
        grid-template-columns: 1fr;
      }

      .catalogo-seccion-header {
        align-items: stretch;
        flex-direction: column;
      }

      .catalogo-busqueda {
        max-width: none;
      }
    }
  `;

  if (loading) {
    return (
      <>
        <style>{estilos}</style>
        <main className="catalogo-page">
          <div className="catalogo-mensaje">Cargando catálogo...</div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{estilos}</style>
        <main className="catalogo-page">
          <div className="catalogo-mensaje">
            <h2>Error al cargar el catálogo</h2>
            <p role="alert">{error}</p>
            <button className="catalogo-boton" onClick={cargarLibros}>
              Reintentar
            </button>
            <button className="catalogo-boton" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <style>{estilos}</style>

      <div className="catalogo-page">
        <aside className="catalogo-sidebar">
          <div className="catalogo-logo">
            <h2>BIBLIOTECA UTR</h2>
            <p>Conocimiento que transforma.</p>
          </div>

          <nav className="catalogo-menu">
            <button className="activo">▣ Catálogo</button>
            <button onClick={() => navigate("/prestamos")}>
              ▤ Mis préstamos
            </button>
          </nav>

          <button className="catalogo-logout" onClick={cerrarSesion}>
            ↪ Cerrar sesión
          </button>
        </aside>

        <div className="catalogo-main">
          <header className="catalogo-topbar">
            <h2>Biblioteca Universitaria</h2>

            <div className="catalogo-perfil">
              <div className="catalogo-avatar">
                {(user?.nombre || "U").charAt(0).toUpperCase()}
              </div>
              <span>{user?.nombre || "Usuario"}</span>
            </div>
          </header>

          <main className="catalogo-contenido">
            <section className="catalogo-bienvenida">
              <h1>Catálogo de libros</h1>
              <p>
                Explora nuestra colección y encuentra tu próximo
                conocimiento.
              </p>
            </section>

            <section className="catalogo-resumen">
              <div className="catalogo-resumen-card">
                <span>Total de libros</span>
                <strong>{libros.length}</strong>
              </div>

              <div className="catalogo-resumen-card">
                <span>Libros disponibles</span>
                <strong>
                  {libros.filter((libro) => libro.stockDisponible > 0).length}
                </strong>
              </div>

              <div className="catalogo-resumen-card">
                <span>Resultados de búsqueda</span>
                <strong>{librosFiltrados.length}</strong>
              </div>
            </section>

            <section className="catalogo-seccion">
              <div className="catalogo-seccion-header">
                <h2>Explorar colección</h2>

                <input
                  className="catalogo-busqueda"
                  type="search"
                  placeholder="Buscar por título, autor o categoría..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              {librosFiltrados.length === 0 ? (
                <div className="catalogo-mensaje">
                  No se encontraron libros.
                </div>
              ) : (
                <div className="catalogo-grid">
                  {librosFiltrados.map((libro, index) => (
                    <article className="catalogo-libro" key={libro.id}>
                      <div
                        className="catalogo-portada"
                        style={{
                          background: [
                            "linear-gradient(135deg, #2456a5, #102d69)",
                            "linear-gradient(135deg, #438b92, #20535f)",
                            "linear-gradient(135deg, #a46d43, #633b2d)",
                            "linear-gradient(135deg, #625b9b, #302c62)",
                          ][index % 4],
                        }}
                      >
                        <span>BIBLIOTECA UTR</span>
                        <strong>{libro.titulo}</strong>
                        <small>{libro.autor}</small>
                      </div>

                      <div className="catalogo-libro-info">
                        <h3>{libro.titulo}</h3>
                        <p><strong>Autor:</strong> {libro.autor}</p>
                        <p><strong>ISBN:</strong> {libro.isbn || "No disponible"}</p>
                        <p><strong>Categoría:</strong> {libro.categoria || "General"}</p>
                        <p>
                          <strong>Existencias:</strong>{" "}
                          {libro.stockDisponible} disponibles de {libro.stockTotal}
                        </p>

                        {libro.stockDisponible > 0 ? (
                          <>
                            <span className="catalogo-estado">
                              Disponible
                            </span>

                            <button
                              className="catalogo-boton"
                              onClick={() => seleccionarLibro(libro)}
                              disabled={enviando}
                            >
                              Solicitar préstamo
                            </button>
                          </>
                        ) : (
                          <span className="catalogo-estado agotado">
                            No disponible
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>

        {libroSeleccionado && (
          <div className="catalogo-modal-fondo">
            <section
              className="catalogo-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-solicitud"
            >
              <h2 id="titulo-solicitud">Solicitar préstamo</h2>
              <p><strong>Libro:</strong> {libroSeleccionado.titulo}</p>
              <p><strong>Autor:</strong> {libroSeleccionado.autor}</p>

              <form onSubmit={solicitarPrestamo}>
                <label htmlFor="fechaDevolucion">
                  Fecha estimada de devolución
                </label>

                <input
                  id="fechaDevolucion"
                  type="date"
                  value={fechaDevolucion}
                  min={new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => setFechaDevolucion(e.target.value)}
                  required
                />

                <div className="catalogo-modal-acciones">
                  <button
                    type="submit"
                    className="catalogo-boton"
                    disabled={enviando}
                  >
                    {enviando ? "Enviando..." : "Confirmar"}
                  </button>

                  <button
                    type="button"
                    className="catalogo-boton catalogo-cancelar"
                    disabled={enviando}
                    onClick={() => setLibroSeleccionado(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </>
  );
}
