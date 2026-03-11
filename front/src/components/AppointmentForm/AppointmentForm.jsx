import { ErrorMessage, Field, Form, Formik } from "formik";
import { validateAppointment } from "../../Helpers/validateAppointment";
import styles from "./AppointmentForm.module.css";
import { useEffect, useState } from "react";
import api from "../../helpers/api";

function AppointmentForm({ onAddAppointment }) {
  const [showForm, setShowForm] = useState(false);
  const [services, setServices] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const initialState = {
    date: "",
    time: "",
    treatment: "",
  };

  useEffect(() => {
    api
      .get("/services")
      .then((r) => setServices(r.data))
      .catch(() => {});
    api
      .get("/schedules")
      .then((r) => setSchedules(r.data))
      .catch(() => {});
  }, []);

  const availableTimes = [...new Set(schedules.map((s) => s.time))].sort();

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await api.post("/appointments/schedule", values);
      onAddAppointment(response.data);
      alert("¡Turno reservado con éxito!");
      resetForm();
      setShowForm(false);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Ocurrió un error al reservar el turno";
      alert(message);
    }
  };

  return (
    <div className={styles.formContainer}>
      {!showForm ? (
        <button
          className={styles.reserveButton}
          onClick={() => setShowForm(true)}
        >
          Reservar Turno
        </button>
      ) : (
        <Formik
          initialValues={initialState}
          validate={validateAppointment}
          onSubmit={handleSubmit}
        >
          <Form className={styles.appointmentForm}>
            <div className={styles.inputGroup}>
              <label>Tratamiento</label>
              <Field as="select" name="treatment">
                <option value="">Seleccioná un tratamiento</option>
                {services.length > 0
                  ? services.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} — ${s.price} ({s.durationMinutes} min)
                      </option>
                    ))
                  : // Fallback si no hay servicios cargados aún
                    [
                      "Uñas semipermanentes",
                      "Pestañas pelo por pelo",
                      "Lifting de pestañas",
                      "Depilación láser",
                      "Limpieza facial",
                      "Masaje relajante",
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
              </Field>
              <p>
                <ErrorMessage name="treatment" />
              </p>
            </div>

            <div className={styles.inputGroup}>
              <label>Fecha de Reserva</label>
              <Field type="date" name="date" />
              <p>
                <ErrorMessage name="date" />
              </p>
            </div>

            <div className={styles.inputGroup}>
              <label>Hora de Reserva</label>
              <Field as="select" name="time">
                <option value="">Seleccioná una hora</option>
                {(availableTimes.length > 0
                  ? availableTimes
                  : [
                      "08:00",
                      "09:00",
                      "10:00",
                      "11:00",
                      "12:00",
                      "13:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                    ]
                ).map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </Field>
              <p>
                <ErrorMessage name="time" />
              </p>
            </div>

            <div className={styles.buttonsGroup}>
              <button type="submit">Confirmar Turno</button>
              <button type="button" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            </div>
          </Form>
        </Formik>
      )}
    </div>
  );
}

export default AppointmentForm;
