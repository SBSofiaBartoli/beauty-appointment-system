import styles from "./AppointmentCard.module.css";
import api from "../../helpers/api";

function AppointmentCard({ appointment, onCancel }) {
  const handleCancel = async () => {
    const appointmentDateTime = new Date(
      `${appointment.date}T${appointment.time}:00`,
    );
    const now = new Date();
    const diffHours = (appointmentDateTime - now) / (1000 * 60 * 60);

    if (diffHours < 12) {
      return alert(
        "Solo podés cancelar un turno con al menos 12 horas de anticipación",
      );
    }
    if (!window.confirm("¿Estás segura de que querés cancelar este turno?"))
      return;
    try {
      await api.put(`/appointments/cancel/${appointment.id}`);
      alert("Turno cancelado con éxito");
      onCancel();
    } catch (error) {
      alert(error.response?.data?.message || "Ocurrió un error al cancelar");
    }
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const isActive = appointment.status === "active";

  return (
    <div className={`${styles.row} ${!isActive ? styles.rowCancelled : ""}`}>
      <span className={styles.cell}>{formatDate(appointment.date)}</span>
      <span className={styles.cell}>{appointment.time}</span>
      <span className={`${styles.cell} ${styles.treatment}`}>
        {appointment.treatment}
      </span>
      <span className={styles.cell}>
        <span
          className={`${styles.badge} ${isActive ? styles.badgeActive : styles.badgeCancelled}`}
        >
          <span className={styles.dot} />
          {isActive ? "Activo" : "Cancelado"}
        </span>
      </span>
      <span className={styles.cell}>
        {isActive && (
          <button onClick={handleCancel} className={styles.btnCancel}>
            Cancelar
          </button>
        )}
      </span>
    </div>
  );
}

export default AppointmentCard;
