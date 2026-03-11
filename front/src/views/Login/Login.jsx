import { ErrorMessage, Field, Form, Formik } from "formik";
import { validateLogin } from "../../Helpers/validateLogin";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";
import api from "../../helpers/api";

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
    <main className={styles.loginContainer}>
      <h2>Iniciar Sesión</h2>
      <Formik
        initialValues={initialState}
        validate={validateLogin}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className={styles.inputGroup}>
              <label>Nombre de Usuario</label>
              <Field type="text" name="username" />
              <p>
                <ErrorMessage name="username" />
              </p>
            </div>
            <div className={styles.inputGroup}>
              <label>Contraseña</label>
              <Field type="password" name="password" />
              <p>
                <ErrorMessage name="password" />
              </p>
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Ingresando..." : "INGRESAR"}
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
}

export default Login;
