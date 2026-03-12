import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";
import logo from "../../assets/Logo2.png";
import { useAuth } from "../../context/Authcontext";

function NavBar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogOut = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.brand}>
          <img src={logo} alt="Logo Urban Shine" className={styles.logo} />
          <div className={styles.logoCircle}>D</div>
          <span className={styles.brandName}>Dimissi</span>
        </Link>
        <ul className={styles.navLinks}>
          <li>
            <Link
              to="/"
              className={`${styles.link} ${isActive("/") ? styles.linkActive : ""}`}
            >
              Inicio
            </Link>
          </li>

          {user ? (
            <>
              {isAdmin ? (
                <>
                  <li>
                    <Link
                      to="/admin/appointments"
                      className={`${styles.link} ${isActive("/admin/appointments") ? styles.linkActive : ""}`}
                    >
                      Turnos
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/services"
                      className={`${styles.link} ${isActive("/admin/services") ? styles.linkActive : ""}`}
                    >
                      Servicios
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/stats"
                      className={`${styles.link} ${isActive("/admin/stats") ? styles.linkActive : ""}`}
                    >
                      Estadísticas
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/appointments"
                    className={`${styles.link} ${isActive("/appointments") ? styles.linkActive : ""}`}
                  >
                    Mis Turnos
                  </Link>
                </li>
              )}
              <li>
                <span className={styles.greeting}>
                  Hola, {user.name.split(" ")[0]} 👋
                </span>
              </li>
              <li>
                <button onClick={handleLogOut} className={styles.btnLogout}>
                  Salir
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className={styles.btnLogin}>
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className={`${styles.link} ${isActive("/register") ? styles.linkActive : ""}`}
                >
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;
