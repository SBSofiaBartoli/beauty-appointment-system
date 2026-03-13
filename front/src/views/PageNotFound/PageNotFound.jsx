import { Link, useNavigate } from "react-router-dom";
import styles from "./PageNotFound.module.css";
import { useEffect } from "react";

function PageNotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>
          Página <em>no encontrada</em>
        </h1>
        <p className={styles.sub}>
          Te redirigimos al inicio en unos segundos...
        </p>
        <Link to="/" className={styles.btnHome}>
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

export default PageNotFound;
