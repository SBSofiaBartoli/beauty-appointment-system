# 🐱 Dimissi

### Sistema de gestión de turnos para centros de estética

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Node](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Status](https://img.shields.io/badge/status-active-success)

Dimissi es una **aplicación web Full Stack** diseñada para gestionar turnos en centros de estética.

Los clientes pueden:

- registrarse
- iniciar sesión
- reservar turnos
- cancelar reservas

Los administradores pueden:

- gestionar servicios
- administrar horarios
- ver estadísticas del negocio

El proyecto implementa **autenticación JWT, arquitectura modular y un panel administrativo**.

---

# 🎥 Demo

![Demo](./screenshots/demo.gif)

💡 El GIF muestra el flujo completo:

1. login
2. reserva de turno
3. gestión de turnos
4. panel administrativo

---

# ✨ Features

### 👤 Usuarios

- Registro e inicio de sesión
- Autenticación con JWT
- Gestión de perfil

### 📅 Turnos

- Reservar turno
- Cancelar turno
- Ver turnos propios

### 🛠 Panel Admin

- Ver todos los turnos
- Gestionar servicios
- Gestionar horarios

### 📊 Estadísticas

El dashboard administrativo muestra:

- total de turnos
- turnos cancelados
- ingresos estimados
- turnos por mes
- tratamientos más solicitados

---

# 🧰 Tech Stack

| Capa            | Tecnologías                    |
| --------------- | ------------------------------ |
| **Frontend**    | React 19 · Vite · React Router |
| **Backend**     | TypeScript · Express           |
| **ORM**         | TypeORM                        |
| **Database**    | PostgreSQL                     |
| **Auth**        | JSON Web Tokens                |
| **HTTP Client** | Axios                          |
| **Forms**       | Formik                         |
| **Estilos**     | CSS Modules                    |

---

# 🏗 Arquitectura

```text
┌───────────────┐
│   Frontend    │
│ React + Vite  │
└───────┬───────┘
        │ HTTP (Axios)
        ▼
┌───────────────┐
│    Backend    │
│ Express API   │
│ TypeScript    │
└───────┬───────┘
        │ ORM
        ▼
┌───────────────┐
│  PostgreSQL   │
│   Database    │
└───────────────┘
```

El backend sigue una arquitectura por capas:

• Controllers → endpoints HTTP
• Services → lógica de negocio
• Entities → modelos de base de datos
• DTOs → validación de datos

---

# 🗂 Estructura del proyecto

```text
dimissi
│
├── back
│   └── src
│       ├── config
│       ├── controllers
│       ├── dto
│       ├── entities
│       ├── middlewares
│       ├── routes
│       ├── services
│       └── server.ts
│
└── front
    └── src
        ├── assets
        ├── components
        ├── context
        ├── helpers
        └── views
```

---

# 🗄 Modelo de datos

```text
User
│
├── id
├── username
├── email
└── role
        │
        │ 1..*
        ▼
Appointment
│
├── id
├── date
├── time
├── status
└── serviceId
        │
        │ *..1
        ▼
Service
│
├── id
├── name
├── price
└── duration
```

---

# 🔐 Autenticación

```text
{
  "id": "user_id",
  "role": "admin | client"
}
```

Expiración del token: 8 horas
El rol se valida en:
• middleware backend
• contexto de autenticación en frontend

---

# 📦 Instalación

Requisitos

• Node.js 18+
• PostgreSQL
• npm

1 Clonar repositorio

```text
git clone <repo-url>
cd dimissi
```

2 Configurar backend

```text
cd back
npm install
```

Crear archivo .env

```text
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=db_name
JWT_SECRET=una_clave_secreta_larga
FRONTEND_URL=http://localhost:5173
```

3 Configurar frontend

```text
cd ../front
npm install
```

4 Ejecutar aplicación
Backend y frontend

```text
npm run dev
```

---

# 🎨 Sistema de diseño

Variables CSS definidas en index.css.
| Variable | Color |
| ------------- | ------- |
| `--black` | #0D0D0D |
| `--off-white` | #F8F6F3 |
| `--pink` | #F2A7C3 |
| `--pink-dk` | #D4779A |
| `--teal` | #5BBFBF |

### Tipografías:

• Playfair Display
• Nunito

# ⚙ Decisiones técnicas

### Axios interceptor

El cliente HTTP:

• inyecta automáticamente el token en cada request
• redirige a login cuando recibe un 401.

### CSS Modules

Cada componente tiene su propio archivo .module.css.

Beneficios:

• evita conflictos de estilos
• mantiene los estilos encapsulados

### Optimización de render

El componente Field del formulario de registro se define fuera del render para evitar re-mount de inputs y pérdida de foco.

---

# 🔮 Mejoras futuras

• recordatorios automáticos por email
• calendario visual
• integración de pagos online
• notificaciones en tiempo real

---

### 👩‍💻 Autor

Desarrollado por Sofia Bartoli
Full Stack Developer
