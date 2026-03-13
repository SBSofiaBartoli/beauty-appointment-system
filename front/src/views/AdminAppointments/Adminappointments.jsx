import { useEffect, useState } from "react";
import api from "../../helpers/api";
import { useAuth } from "../../context/Authcontext";
import { useNavigate } from "react-router-dom";
import styles from "./AdminAppointments.module.css";

const FILTERS = [
  { key: "all", label: "Todos" },
  { key: "active", label: "Activos" },
  { key: "cancelled", label: "Cancelados" },
];

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) navigate("/");
    else fetchAppointments();
  }, [isAdmin, navigate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointments");
      setAppointments(res.data);
    } catch (error) {
      if (error.response?.status !== 404) console.error(error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("¿Cancelar este turno?")) return;
    try {
      await api.put(`/appointments/cancel/${id}`);
      fetchAppointments();
    } catch (error) {
      alert(error.response?.data?.message || "Error al cancelar");
    }
  };

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const formatDate = (d) => {
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
  };

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>
          Gestión de <em>Turnos</em>
        </h1>
        <p className={styles.subtitle}>{appointments.length} turnos en total</p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`${styles.filterBtn} ${filter === f.key ? styles.filterActive : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className={styles.filterCount}>
                {f.key === "all"
                  ? appointments.length
                  : appointments.filter((a) => a.status === f.key).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>No hay turnos para mostrar.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Tratamiento</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td className={styles.tdBold}>{a.user?.name || "—"}</td>
                  <td>{formatDate(a.date)}</td>
                  <td>{a.time}</td>
                  <td>{a.treatment}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${a.status === "active" ? styles.badgeActive : styles.badgeCancelled}`}
                    >
                      <span className={styles.dot} />
                      {a.status === "active" ? "Activo" : "Cancelado"}
                    </span>
                  </td>
                  <td>
                    {a.status === "active" && (
                      <button
                        className={styles.btnCancel}
                        onClick={() => handleCancel(a.id)}
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default AdminAppointments;
