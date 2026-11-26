
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Registro() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      await register(
        nombre.trim(),
        matricula.trim(),
        email.trim(),
        password
      );

      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (error) {
      setError(error.message || "No fue posible completar el registro.");
    } finally {
      setLoading(false);
    }
  };

  const estilos = `
    * {
      box-sizing: border-box;
    }

    .registro-page {
      min-height: 100vh;
      display: flex;
      background: #f3f5fa;
      font-family: Arial, Helvetica, sans-serif;
    }

    .registro-presentacion {
      width: 42%;
      min-height: 100vh;
      padding: 55px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: white;
      background: linear-gradient(145deg, #102d69, #2456a5);
    }

    .registro-marca {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 2px;
    }

    .registro-mensaje {
      max-width: 440px;
      margin: auto 0;
    }

    .registro-mensaje h1 {
      margin: 0 0 20px;
      font-size: clamp(32px, 4vw, 48px);
      line-height: 1.2;
    }

    .registro-mensaje p {
      color: #d9e5ff;
      font-size: 15px;
      line-height: 1.8;
    }

    .registro-pie {
      color: #c6d8fa;
      font-size: 12px;
    }

    .registro-contenedor {
      width: 58%;
      min-height: 100vh;
      padding: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .registro-tarjeta {
      width: 100%;
      max-width: 510px;
      padding: 35px;
      border: 1px solid #e8edf5;
      border-radius: 12px;
      background: white;
      box-shadow: 0 12px 35px #17376b12;
    }

    .registro-etiqueta {
      display: inline-block;
      margin-bottom: 12px;
      color: #2456a5;
      font-size: 11px;
      font-weight: bold;
      letter-spacing: 2px;
    }

    .registro-tarjeta h2 {
      margin: 0 0 9px;
      color: #18376e;
      font-size: 26px;
    }

    .registro-descripcion {
      margin: 0 0 24px;
      color: #7b8799;
      font-size: 13px;
      line-height: 1.6;
    }

    .registro-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .registro-campo {
      margin-bottom: 17px;
    }

    .registro-campo.completo {
      grid-column: 1 / -1;
    }

    .registro-campo label {
      display: block;
      margin-bottom: 7px;
      color: #34445e;
      font-size: 13px;
      font-weight: bold;
    }

    .registro-campo input {
      width: 100%;
      padding: 12px;
      border: 1px solid #dce2ed;
      border-radius: 6px;
      outline: none;
      color: #26334a;
      font-size: 13px;
    }

    .registro-campo input:focus {
      border-color: #376bd0;
      box-shadow: 0 0 0 3px #376bd018;
    }

    .registro-error {
      padding: 11px;
      margin-bottom: 15px;
      border-radius: 5px;
      background: #fdeaea;
      color: #bd3434;
      font-size: 12px;
    }

    .registro-boton {
      width: 100%;
      padding: 13px;
      margin-top: 5px;
      border: none;
      border-radius: 6px;
      background: #2456a5;
      color: white;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
    }

    .registro-boton:hover:not(:disabled) {
      background: #173f83;
    }

    .registro-boton:disabled {
      opacity: .6;
      cursor: not-allowed;
    }

    .registro-login {
      margin: 22px 0 0;
      color: #718096;
      font-size: 13px;
      text-align: center;
    }

    .registro-login a {
      color: #2456a5;
      font-weight: bold;
      text-decoration: none;
    }

    .registro-login a:hover {
      text-decoration: underline;
    }

    @media (max-width: 750px) {
      .registro-page {
        flex-direction: column;
      }

      .registro-presentacion {
        width: 100%;
        min-height: 230px;
        padding: 28px;
      }

      .registro-mensaje {
        margin: 30px 0;
      }

      .registro-mensaje h1 {
        font-size: 30px;
      }

      .registro-pie {
        display: none;
      }

      .registro-contenedor {
        width: 100%;
        min-height: auto;
        padding: 20px 14px;
      }

      .registro-tarjeta {
        padding: 25px 20px;
      }
    }

    @media (max-width: 430px) {
      .registro-grid {
        grid-template-columns: 1fr;
        gap: 0;
      }

      .registro-campo.completo {
        grid-column: auto;
      }
    }
  `;

  return (
    <>
      <style>{estilos}</style>

      <main className="registro-page">
        <section className="registro-presentacion">
          <div className="registro-marca">
            BIBLIOTECA UTR
          </div>

          <div className="registro-mensaje">
            <h1>Forma parte de nuestra comunidad.</h1>
            <p>
              Crea tu cuenta y disfruta de los recursos
              bibliográficos de la Biblioteca Universitaria UTR.
              Explora nuevas ideas y continúa aprendiendo.
            </p>
          </div>

          <div className="registro-pie">
            Biblioteca Universitaria UTR · 2026
          </div>
        </section>

        <section className="registro-contenedor">
          <div className="registro-tarjeta">
            <span className="registro-etiqueta">
              BIBLIOTECA UNIVERSITARIA
            </span>

            <h2>Crear una cuenta</h2>

            <p className="registro-descripcion">
              Completa tus datos para registrarte en la plataforma.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="registro-grid">
                <div className="registro-campo completo">
                  <label htmlFor="nombre">Nombre completo</label>
                  <input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ingresa tu nombre completo"
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="registro-campo">
                  <label htmlFor="matricula">Matrícula</label>
                  <input
                    id="matricula"
                    type="text"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    placeholder="Tu matrícula"
                    required
                  />
                </div>

                <div className="registro-campo">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="registro-campo">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crea una contraseña"
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="registro-campo">
                  <label htmlFor="confirmPassword">
                    Confirmar contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="registro-error" role="alert">
                  {error}
                </div>
              )}

              <button
                className="registro-boton"
                type="submit"
                disabled={loading}
              >
                {loading ? "Registrando..." : "Crear cuenta"}
              </button>
            </form>

            <p className="registro-login">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login">Inicia sesión</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
