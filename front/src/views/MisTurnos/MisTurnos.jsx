import { useEffect, useState } from "react";
import styles from "./MisTurnos.module.css";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
import AppointmentForm from "../../components/AppointmentForm/AppointmentForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";
import api from "../../helpers/api";

function MisTurnos() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const getAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/appointments");
      setAppointments(response.data);
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
    } else {
      getAppointments();
    }
  }, [user, navigate]);

  return (
    <main className={styles.myAppointmentsContainer}>
      <AppointmentForm
        onAddAppointment={(appt) => setAppointments((prev) => [...prev, appt])}
      />
      <h1>Mis Turnos</h1>
      <div className={styles.appointmentsHeader}>
        <span>Fecha</span>
        <span>Hora</span>
        <span>Tratamiento</span>
        <span>Estado</span>
        <span>Acción</span>
      </div>
      <div className={styles.appointmentsList}>
        {loading ? (
          <p className={styles.loading}>Cargando turnos...</p>
        ) : appointments.length === 0 ? (
          <p className={styles.empty}>No tenés turnos reservados aún.</p>
        ) : (
          appointments.map((appoint) => (
            <AppointmentCard
              key={appoint.id}
              appointment={appoint}
              onCancel={getAppointments}
            />
          ))
        )}
      </div>
    </main>
  );
}

export default MisTurnos;
