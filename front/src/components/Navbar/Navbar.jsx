import { Link, useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";
import logo from "../../assets/Logo2.png";
import { useAuth } from "../../context/Authcontext";

function NavBar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <img src={logo} alt="Logo Urban Shine" className={styles.logo} />
      <nav>
        <ul className={styles.navList}>
          <li>
            <Link to="/">Home</Link>
          </li>
          {user ? (
            <>
              {isAdmin ? (
                <>
                  <li>
                    <Link to="/admin/appointments">Turnos</Link>
                  </li>
                  <li>
                    <Link to="/admin/services">Servicios</Link>
                  </li>
                  <li>
                    <Link to="/admin/stats">Estadísticas</Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/appointments">Mis Turnos</Link>
                </li>
              )}
              <li>
                <span className={styles.userName}>
                  Hola, {user.name.split(" ")[0]}
                </span>
              </li>
              <li>
                <button onClick={handleLogOut}>Cerrar Sesión</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/register">Registrarse</Link>
              </li>
              <li>
                <Link to="/login">Iniciar Sesión</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;
