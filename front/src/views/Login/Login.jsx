import { ErrorMessage, Field, Form, Formik } from "formik";
import { validateLogin } from "../../Helpers/validateLogin";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";
import api from "../../helpers/api";
import { Link } from "react-router-dom";
import stickerLaser from "../../assets/gatitoLogin.png";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const initialState = {
    username: "",
    password: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.post("/users/login", values);
      login(response.data.user, response.data.token);
      navigate(
        response.data.user.role === "admin"
          ? "/admin/appointments"
          : "/appointments",
      );
    } catch (error) {
      alert(error.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <img src={stickerLaser} alt="" className={styles.sticker} />
        <div className={styles.cardHeader}>
          <h1 className={styles.title}>
            Bienvenida,
            <br />
            <em>de nuevo</em>
          </h1>
          <p className={styles.subtitle}>Ingresá para gestionar tus turnos</p>
        </div>

        <Formik
          initialValues={initialState}
          validate={validateLogin}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className={styles.form} noValidate>
              {status && <div className={styles.serverError}>⚠ {status}</div>}

              <div className={styles.inputGroup}>
                <label className={styles.label}>Usuario</label>
                <Field
                  type="text"
                  name="username"
                  className={styles.input}
                  placeholder="tu_usuario"
                />
                <p className={styles.error}>
                  <ErrorMessage name="username" />
                </p>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Contraseña</label>
                <Field
                  type="password"
                  name="password"
                  className={styles.input}
                  placeholder="••••••••"
                />
                <p className={styles.error}>
                  <ErrorMessage name="password" />
                </p>
              </div>

              <button
                type="submit"
                className={styles.btnSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </button>

              <p className={styles.footerLink}>
                ¿No tenés cuenta? <Link to="/register">Registrate aquí</Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}

export default Login;
