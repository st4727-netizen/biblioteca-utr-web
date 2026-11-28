
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Completa tu correo y contraseña.");
      return;
    }

    try {
      setLoading(true);

      const user = await login(email.trim(), password);

      if (user.rol === "ADMIN") {
        navigate("/");
      } else {
        navigate("/catalogo");
      }
    } catch (error) {
      setError(error.message || "No fue posible iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const estilos = `
    * {
      box-sizing: border-box;
    }

    .login-page {
      min-height: 100vh;
      display: flex;
      background: #f3f5fa;
      font-family: Arial, Helvetica, sans-serif;
    }

    .login-presentacion {
      width: 52%;
      min-height: 100vh;
      padding: 65px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: white;
      background: linear-gradient(145deg, #102d69, #2456a5);
    }

    .login-marca {
      font-size: 25px;
      font-weight: 800;
      letter-spacing: 2px;
    }

    .login-eslogan {
      max-width: 500px;
      margin: auto 0;
    }

    .login-eslogan h1 {
      margin: 0 0 20px;
      font-size: clamp(35px, 4vw, 55px);
      line-height: 1.15;
    }

    .login-eslogan p {
      max-width: 430px;
      color: #d9e5ff;
      font-size: 16px;
      line-height: 1.8;
    }

    .login-pie {
      color: #c6d8fa;
      font-size: 12px;
    }

    .login-contenedor {
      width: 48%;
      min-height: 100vh;
      padding: 35px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .login-tarjeta {
      width: 100%;
      max-width: 410px;
      padding: 42px;
      border: 1px solid #e8edf5;
      border-radius: 12px;
      background: white;
      box-shadow: 0 12px 35px #17376b12;
    }

    .login-etiqueta {
      display: inline-block;
      margin-bottom: 13px;
      color: #2456a5;
      font-size: 11px;
      font-weight: bold;
      letter-spacing: 2px;
    }

    .login-tarjeta h2 {
      margin: 0 0 10px;
      color: #18376e;
      font-size: 27px;
    }

    .login-descripcion {
      margin: 0 0 28px;
      color: #7b8799;
      font-size: 13px;
      line-height: 1.6;
    }

    .login-campo {
      margin-bottom: 19px;
    }

    .login-campo label {
      display: block;
      margin-bottom: 8px;
      color: #34445e;
      font-size: 13px;
      font-weight: bold;
    }

    .login-campo input {
      width: 100%;
      padding: 13px;
      border: 1px solid #dce2ed;
      border-radius: 6px;
      outline: none;
      background: #fff;
      color: #26334a;
      font-size: 14px;
    }

    .login-campo input:focus {
      border-color: #376bd0;
      box-shadow: 0 0 0 3px #376bd018;
    }

    .login-error {
      padding: 11px;
      margin-bottom: 17px;
      border-radius: 5px;
      background: #fdeaea;
      color: #bd3434;
      font-size: 12px;
    }

    .login-boton {
      width: 100%;
      padding: 13px;
      border: none;
      border-radius: 6px;
      background: #2456a5;
      color: white;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      transition: background .2s;
    }

    .login-boton:hover:not(:disabled) {
      background: #173f83;
    }

    .login-boton:disabled {
      opacity: .6;
      cursor: not-allowed;
    }

    .login-registro {
      margin: 25px 0 0;
      color: #718096;
      font-size: 13px;
      text-align: center;
    }

    .login-registro a {
      color: #2456a5;
      font-weight: bold;
      text-decoration: none;
    }

    .login-registro a:hover {
      text-decoration: underline;
    }

    @media (max-width: 750px) {
      .login-page {
        flex-direction: column;
      }

      .login-presentacion {
        width: 100%;
        min-height: 250px;
        padding: 30px;
      }

      .login-eslogan {
        margin: 35px 0;
      }

      .login-eslogan h1 {
        font-size: 32px;
      }

      .login-eslogan p {
        font-size: 13px;
      }

      .login-pie {
        display: none;
      }

      .login-contenedor {
        width: 100%;
        min-height: auto;
        padding: 25px 15px;
      }

      .login-tarjeta {
        padding: 28px 22px;
      }
    }
  `;

  return (
    <>
      <style>{estilos}</style>

      <main className="login-page">
        <section className="login-presentacion">
          <div className="login-marca">
            BIBLIOTECA UTR
          </div>

          <div className="login-eslogan">
            <h1>El conocimiento transforma tu futuro.</h1>
            <p>
              Descubre, aprende y crece a través de nuestra
              colección de libros. Tu próximo conocimiento
              comienza aquí.
            </p>
          </div>

          <div className="login-pie">
            Biblioteca Universitaria UTR · 2026
          </div>
        </section>

        <section className="login-contenedor">
          <div className="login-tarjeta">
            <span className="login-etiqueta">
              BIBLIOTECA UNIVERSITARIA
            </span>

            <h2>¡Bienvenido!</h2>

            <p className="login-descripcion">
              Ingresa tus datos para acceder a tu cuenta.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="login-campo">
                <label htmlFor="email">
                  Correo electrónico
                </label>

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

              <div className="login-campo">
                <label htmlFor="password">
                  Contraseña
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && (
                <div className="login-error" role="alert">
                  {error}
                </div>
              )}

              <button
                className="login-boton"
                type="submit"
                disabled={loading}
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </form>

            <p className="login-registro">
              ¿No tienes una cuenta?{" "}
              <Link to="/registro">Crear cuenta</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

