import { useEffect, useState } from "react";
import api from "../../helpers/api";
import { useAuth } from "../../context/Authcontext";
import { useNavigate } from "react-router-dom";
import styles from "./AdminServices.module.css";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  durationMinutes: "",
};

function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) navigate("/");
    else fetchServices();
  }, [isAdmin, navigate]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get("/services");
      setServices(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({ target: { name, value } }) =>
    setForm({ ...form, [name]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.durationMinutes) {
      alert("Nombre, precio y duración son obligatorios");
      return;
    }
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        durationMinutes: Number(form.durationMinutes),
      };
      if (editing) {
        await api.put(`/services/${editing}`, payload);
        alert("Servicio actualizado");
      } else {
        await api.post("/services", payload);
        alert("Servicio creado");
      }
      setForm(EMPTY_FORM);
      setEditing(null);
      fetchServices();
    } catch (error) {
      alert(error.response?.data?.message || "Error al guardar");
    }
  };

  const handleEdit = (s) => {
    setEditing(s.id);
    setForm({
      name: s.name,
      description: s.description || "",
      price: s.price,
      durationMinutes: s.durationMinutes,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Desactivar este servicio?")) return;
    try {
      await api.delete(`/services/${id}`);
      fetchServices();
    } catch (error) {
      alert(error.response?.data?.message || "Error al desactivar");
    }
  };

  return (
    <main className={styles.container}>
      <h1>Gestión de Servicios</h1>

      <section className={styles.formSection}>
        <h2>{editing ? "Editar Servicio" : "Nuevo Servicio"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            name="name"
            placeholder="Nombre del servicio"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="description"
            placeholder="Descripción (opcional)"
            value={form.description}
            onChange={handleChange}
          />
          <input
            name="price"
            type="number"
            placeholder="Precio ($)"
            value={form.price}
            onChange={handleChange}
          />
          <input
            name="durationMinutes"
            type="number"
            placeholder="Duración (minutos)"
            value={form.durationMinutes}
            onChange={handleChange}
          />
          <div className={styles.formBtns}>
            <button type="submit" className={styles.saveBtn}>
              {editing ? "Guardar Cambios" : "Crear Servicio"}
            </button>
            {editing && (
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => {
                  setEditing(null);
                  setForm(EMPTY_FORM);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className={styles.listSection}>
        <h2>Servicios Activos</h2>
        {loading ? (
          <p className={styles.msg}>Cargando...</p>
        ) : services.length === 0 ? (
          <p className={styles.msg}>No hay servicios cargados aún.</p>
        ) : (
          <div className={styles.grid}>
            {services.map((s) => (
              <div key={s.id} className={styles.card}>
                <h3>{s.name}</h3>
                {s.description && <p>{s.description}</p>}
                <div className={styles.meta}>
                  <span>${Number(s.price).toLocaleString("es-AR")}</span>
                  <span>{s.durationMinutes} min</span>
                </div>
                <div className={styles.cardBtns}>
                  <button
                    onClick={() => handleEdit(s)}
                    className={styles.editBtn}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className={styles.deleteBtn}
                  >
                    Desactivar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminServices;
