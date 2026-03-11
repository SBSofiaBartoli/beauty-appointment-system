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

  return (
    <div className={styles.appointmentCard}>
      <span>{formatDate(appointment.date)}</span>
      <span>{appointment.time}</span>
      <span>{appointment.treatment}</span>
      <span
        className={`${styles.status} ${appointment.status === "cancelled" ? styles.cancelled : styles.active}`}
      >
        {appointment.status === "cancelled" ? "Cancelado" : "Activo"}
      </span>
      <span>
        {appointment.status !== "cancelled" && (
          <button onClick={handleCancel} className={styles.cancelButton}>
            Cancelar
          </button>
        )}
      </span>
    </div>
  );
}

export default AppointmentCard;
