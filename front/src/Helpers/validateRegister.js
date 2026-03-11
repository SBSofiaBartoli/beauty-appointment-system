export const validateRegister = (formData) => {
  const errors = {};

  if (!formData.name) {
    errors.name = "El nombre es requerido";
  } else if (formData.name.length < 5) {
    errors.name = "El nombre tiene que tener 5 o mas caracteres";
  }

  if (!formData.username) {
    errors.username = "El nombre de usuario es requerido";
  } else if (formData.username.length < 5) {
    errors.username = "El nombre de usuario tiene que tener 5 o mas caracteres";
  }

  if (!formData.password) {
    errors.password = "La contraseña es requerida";
  } else if (formData.password.length < 7) {
    errors.password = "La contraseña tiene que tener 7 o mas caracteres";
  }

  if (!formData.nDni) {
    errors.nDni = "El numero de DNI es requerido";
  } else {
    const dniStr = String(formData.nDni);
    if (dniStr.length < 7 || dniStr.length > 8) {
      errors.nDni = "El número de DNI debe tener 7 u 8 dígitos";
    }
  }

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!formData.email) {
    errors.email = "El e-mail es requerido";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "E-mail inválido";
  }

  if (!formData.birthdate) {
    errors.birthdate = "La fecha de nacimiento es requerida";
  } else {
    const birthdate = new Date(formData.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) age--;
    if (age < 18) {
      errors.birthdate = "Debés ser mayor de 18 años para registrarte";
    }
  }

  return errors;
};
