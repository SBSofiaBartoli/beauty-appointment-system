import { ErrorMessage, Field, Form, Formik } from "formik";
import { validateAppointment } from "../../Helpers/validateAppointment";
import styles from "./AppointmentForm.module.css";
import { useEffect, useState } from "react";
import api from "../../helpers/api";

function AppointmentForm({ onAddAppointment }) {
  const [showForm, setShowForm] = useState(false);
  const [services, setServices] = useState([]);
  const [schedules, setSchedules] = useState([]);

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
  const fallbackTimes = [
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
  ];
  const times = availableTimes.length > 0 ? availableTimes : fallbackTimes;

  const fallbackServices = [
    "Uñas semipermanentes",
    "Pestañas pelo por pelo",
    "Lifting de pestañas",
    "Depilación láser",
    "Limpieza facial",
    "Masaje relajante",
  ];

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const res = await api.post("/appointments/schedule", values);
      onAddAppointment(res.data);
      resetForm();
      setShowForm(false);
    } catch (error) {
      alert(error.response?.data?.message || "Error al reservar el turno");
    }
  };

  if (!showForm) {
    return (
      <div className={styles.wrapper}>
        <button className={styles.btnReserve} onClick={() => setShowForm(true)}>
          + Reservar turno
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.formCard}>
        <div className={styles.formCardHeader}>
          <h3 className={styles.formTitle}>
            Nuevo <em>turno</em>
          </h3>
          <button
            className={styles.btnClose}
            onClick={() => setShowForm(false)}
            type="button"
          >
            ✕
          </button>
        </div>

        <Formik
          initialValues={{ date: "", time: "", treatment: "" }}
          validate={validateAppointment}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className={styles.form} noValidate>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Tratamiento</label>
                <Field as="select" name="treatment" className={styles.input}>
                  <option value="">Seleccioná un tratamiento</option>
                  {services.length > 0
                    ? services.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} — ${Number(s.price).toLocaleString("es-AR")}{" "}
                          ({s.durationMinutes} min)
                        </option>
                      ))
                    : fallbackServices.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                </Field>
                <p className={styles.error}>
                  <ErrorMessage name="treatment" />
                </p>
              </div>

              <div className={styles.twoCol}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Fecha</label>
                  <Field type="date" name="date" className={styles.input} />
                  <p className={styles.error}>
                    <ErrorMessage name="date" />
                  </p>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Hora</label>
                  <Field as="select" name="time" className={styles.input}>
                    <option value="">Seleccioná</option>
                    {times.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </Field>
                  <p className={styles.error}>
                    <ErrorMessage name="time" />
                  </p>
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.btnConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Reservando..." : "Confirmar turno"}
                </button>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AppointmentForm;
