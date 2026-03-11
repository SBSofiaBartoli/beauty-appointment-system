import { useEffect, useState } from "react";
import api from "../../helpers/api";
import { useAuth } from "../../context/Authcontext";
import { useNavigate } from "react-router-dom";
import styles from "./AdminAppointments.module.css";

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
    <main className={styles.container}>
      <h1>Gestión de Turnos</h1>

      <div className={styles.filters}>
        {["all", "active", "cancelled"].map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "Todos" : f === "active" ? "Activos" : "Cancelados"}
          </button>
        ))}
        <span className={styles.count}>
          {filtered.length} turno{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <p className={styles.msg}>Cargando...</p>
      ) : filtered.length === 0 ? (
        <p className={styles.msg}>No hay turnos para mostrar.</p>
      ) : (
        <div className={styles.tableWrapper}>
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
                  <td>{a.user?.name || "-"}</td>
                  <td>{formatDate(a.date)}</td>
                  <td>{a.time}</td>
                  <td>{a.treatment}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${a.status === "active" ? styles.badgeActive : styles.badgeCancelled}`}
                    >
                      {a.status === "active" ? "Activo" : "Cancelado"}
                    </span>
                  </td>
                  <td>
                    {a.status === "active" && (
                      <button
                        className={styles.cancelBtn}
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
