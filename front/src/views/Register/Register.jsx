import { useState } from "react";
import { validateRegister } from "../../Helpers/validateRegister";
import styles from "./Register.module.css";
import { useNavigate, Link } from "react-router-dom";
import api from "../../helpers/api";
import stickerNails from "../../assets/gatitoRegister.png";

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

  const Field = ({ name, label, type = "text", placeholder }) => (
    <div className={styles.inputGroup}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${styles.input} ${errors[name] ? styles.inputError : ""}`}
      />
      {errors[name] && <p className={styles.error}>{errors[name]}</p>}
    </div>
  );

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h1 className={styles.title}>
            Crear
            <br />
            <em>cuenta</em>
          </h1>
          <p className={styles.subtitle}>Completá tus datos para comenzar</p>
        </div>

        {serverError && (
          <div className={styles.serverError}>⚠ {serverError}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.twoCol}>
            <Field
              name="name"
              label="Nombre completo"
              placeholder="Sofía García"
            />
            <Field
              name="nDni"
              label="Nº DNI"
              type="number"
              placeholder="xxxxxxxx"
            />
          </div>
          <Field
            name="email"
            label="E-mail"
            type="email"
            placeholder="sofi@gmail.com"
          />
          <Field name="birthdate" label="Fecha de nacimiento" type="date" />
          <div className={styles.twoCol}>
            <Field
              name="username"
              label="Nombre de usuario"
              placeholder="sofi_garcia"
            />
            <Field
              name="password"
              label="Contraseña"
              type="password"
              placeholder="Mínimo 7 caracteres"
            />
          </div>

          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>

          <p className={styles.footerLink}>
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </form>
        {/* Sticker decorativo */}
        <img
          src={stickerNails}
          alt=""
          className={styles.sticker}
          aria-hidden="true"
        />
      </div>
    </main>
  );
}

export default Register;
