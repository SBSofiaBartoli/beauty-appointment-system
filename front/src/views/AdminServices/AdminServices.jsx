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
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>
          Gestión de <em>Servicios</em>
        </h1>
        <p className={styles.subtitle}>
          Administrá los tratamientos disponibles
        </p>
      </div>

      <div className={styles.layout}>
        {/* Form */}
        <aside className={styles.formPanel}>
          <h2 className={styles.panelTitle}>
            {editing ? "Editar servicio" : "Nuevo servicio"}
          </h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            {[
              {
                name: "name",
                label: "Nombre",
                type: "text",
                placeholder: "Uñas semipermanentes",
              },
              {
                name: "description",
                label: "Descripción",
                type: "text",
                placeholder: "Opcional",
              },
              {
                name: "price",
                label: "Precio ($)",
                type: "number",
                placeholder: "8500",
              },
              {
                name: "durationMinutes",
                label: "Duración (min)",
                type: "number",
                placeholder: "60",
              },
            ].map((f) => (
              <div key={f.name} className={styles.inputGroup}>
                <label className={styles.label}>{f.label}</label>
                <input
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            ))}
            <div className={styles.formActions}>
              <button type="submit" className={styles.btnSave}>
                {editing ? "Guardar cambios" : "Crear servicio"}
              </button>
              {editing && (
                <button
                  type="button"
                  className={styles.btnCancelEdit}
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
        </aside>

        {/* List */}
        <section className={styles.listPanel}>
          <h2 className={styles.panelTitle}>Servicios activos</h2>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
            </div>
          ) : services.length === 0 ? (
            <p className={styles.empty}>No hay servicios cargados aún.</p>
          ) : (
            <div className={styles.grid}>
              {services.map((s) => (
                <div key={s.id} className={styles.card}>
                  <h3 className={styles.cardName}>{s.name}</h3>
                  {s.description && (
                    <p className={styles.cardDesc}>{s.description}</p>
                  )}
                  <div className={styles.cardMeta}>
                    <span className={styles.cardPrice}>
                      ${Number(s.price).toLocaleString("es-AR")}
                    </span>
                    <span className={styles.cardDuration}>
                      {s.durationMinutes} min
                    </span>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      onClick={() => handleEdit(s)}
                      className={styles.btnEdit}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className={styles.btnDelete}
                    >
                      Desactivar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminServices;
