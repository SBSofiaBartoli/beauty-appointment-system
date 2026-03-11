import { useState } from "react";
import { validateRegister } from "../../Helpers/validateRegister";
import styles from "./Register.module.css";
import { useNavigate, Link } from "react-router-dom";
import api from "../../helpers/api";

function Register() {
  const navigate = useNavigate();
  const initialState = {
    name: "",
    email: "",
    birthdate: "",
    nDni: "",
    username: "",
    password: "",
  };

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setForm({
      ...form,
      [name]: value,
    });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errorsMessages = validateRegister(form);
    if (Object.keys(errorsMessages).length > 0) {
      setErrors(errorsMessages);
      return;
    }
    setErrors({});
    setServerError("");
    setLoading(true);
    try {
      await api.post("/users/register", form);
      alert("¡Cuenta creada correctamente! 🎉 Ya podés iniciar sesión.");
      navigate("/login");
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Ocurrió un error al registrarse",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.registerContainer}>
      <h2>Crear Cuenta</h2>
      {serverError && <p className={styles.serverError}>{serverError}</p>}
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>Nombre completo</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={form.name}
          />
          {errors.name && <p>{errors.name}</p>}
        </div>
        <div className={styles.inputGroup}>
          <label>E-mail</label>
          <input
            type="text"
            name="email"
            onChange={handleChange}
            value={form.email}
          />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div className={styles.inputGroup}>
          <label>Fecha de Nacimiento</label>
          <input
            type="date"
            name="birthdate"
            onChange={handleChange}
            value={form.birthdate}
          />
          {errors.birthdate && <p>{errors.birthdate}</p>}
        </div>
        <div className={styles.inputGroup}>
          <label>Nº DNI</label>
          <input
            type="number"
            name="nDni"
            onChange={handleChange}
            value={form.nDni}
          />
          {errors.nDni && <p>{errors.nDni}</p>}
        </div>
        <div className={styles.inputGroup}>
          <label>Nombre de Usuario</label>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            value={form.username}
          />
          {errors.username && <p>{errors.username}</p>}
        </div>
        <div className={styles.inputGroup}>
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={form.password}
          />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "REGISTRARSE"}
        </button>
      </form>
      <p className={styles.loginLink}>
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </main>
  );
}

export default Register;
