export const validateAppointment = (formData) => {
  const errors = {};

  if (!formData.date) {
    errors.date = "La fecha es requerida";
  } else {
    const selectedDate = new Date(formData.date + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.date = "No podés reservar en fechas pasadas";
    } else if (selectedDate.getDay() === 0) {
      errors.date = "No se pueden reservar turnos los domingos";
    }
  }
  if (!formData.time) {
    errors.time = "La hora es requerida";
  }
  if (!formData.treatment) {
    errors.treatment = "El tratamiento es requerido";
  }

  return errors;
};
