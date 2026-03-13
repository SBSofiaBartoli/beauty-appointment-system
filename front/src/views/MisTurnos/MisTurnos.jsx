import { useEffect, useState } from "react";
import styles from "./MisTurnos.module.css";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
import AppointmentForm from "../../components/AppointmentForm/AppointmentForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";
import api from "../../helpers/api";
import stickerNails from "../../assets/emptyState.png";

function MisTurnos() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

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

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchAppointments();
  }, [user, navigate]);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Mis <em>Turnos</em>
          </h1>
          <p className={styles.subtitle}>
            {appointments.length > 0
              ? `${appointments.filter((a) => a.status === "active").length} turno${appointments.filter((a) => a.status === "active").length !== 1 ? "s" : ""} activo${appointments.filter((a) => a.status === "active").length !== 1 ? "s" : ""}`
              : "Sin turnos aún"}
          </p>
        </div>
      </div>

      <AppointmentForm
        onAddAppointment={(a) => setAppointments((p) => [a, ...p])}
      />

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Cargando tus turnos...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className={styles.emptyState}>
          <img src={stickerNails} alt="" className={styles.emptySticker} />
          <h3 className={styles.emptyTitle}>¡Todavía no tenés turnos!</h3>
          <p className={styles.emptySub}>
            Reservá tu primer turno y empezá a brillar ✨
          </p>
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>Fecha</span>
            <span>Hora</span>
            <span>Tratamiento</span>
            <span>Estado</span>
            <span>Acción</span>
          </div>
          <div className={styles.tableBody}>
            {appointments.map((a) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                onCancel={fetchAppointments}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default MisTurnos;
