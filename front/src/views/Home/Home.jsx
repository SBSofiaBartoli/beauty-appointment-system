import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";
import api from "../../helpers/api";
import styles from "./Home.module.css";
import gatitoHome from "../../assets/gatitoHome.png";
import uñasRosas from "../../assets/uñasRosas.jpg";
import pestañas from "../../assets/pestañas.jpg";
import nailArt from "../../assets/nailArt.jpg";
import francesas from "../../assets/francesas.jpg";
import depilacion from "../../assets/depilacion.jpg";

const GALLERY_PLACEHOLDER = [
  {
    id: 1,
    src: uñasRosas,
    alt: "Uñas semipermanentes rosas",
    category: "Uñas",
  },
  { id: 2, src: pestañas, alt: "Pestañas pelo por pelo", category: "Pestañas" },
  { id: 3, src: nailArt, alt: "Uñas con nail art", category: "Uñas" },
  { id: 4, src: francesas, alt: "Diseño de uñas francesas", category: "Uñas" },
  { id: 5, src: depilacion, alt: "Depilación láser", category: "Láser" },
];

const CATEGORIES = ["Todos", "Uñas", "Pestañas", "Láser"];

function Home() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    api
      .get("/services")
      .then((r) => setServices(r.data))
      .catch(() => {});
  }, []);

  const filtered =
    activeCategory === "Todos"
      ? GALLERY_PLACEHOLDER
      : GALLERY_PLACEHOLDER.filter((p) => p.category === activeCategory);

  const SERVICE_ICONS = {
    "Uñas semipermanentes": "💅",
    "Pestañas pelo por pelo": "✨",
    "Lifting de pestañas": "👁️",
    "Depilación láser": "⚡",
    "Limpieza facial": "🌿",
    "Masaje relajante": "🤍",
  };

  return (
    <main className={styles.main}>
      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.heroTitle}>
            Tu momento
            <br />
            de <em>cuidado</em>
            <br />
            comienza aquí
          </h1>
        </div>

        <div className={styles.heroCenter}>
          <p className={styles.heroEyebrow}>Estética profesional · Córdoba</p>
          <p className={styles.heroDesc}>
            Uñas, pestañas, depilación láser, limpiezas faciales y más. Reservá
            tu turno de forma rápida y sencilla.
          </p>
          <div className={styles.heroActions}>
            {user ? (
              <Link to="/appointments" className={styles.btnPink}>
                Ver mis turnos
              </Link>
            ) : (
              <Link to="/register" className={styles.btnPink}>
                Reservar turno
              </Link>
            )}
            <a href="#servicios" className={styles.btnGhost}>
              Ver servicios
            </a>
          </div>
        </div>

        <div className={styles.heroRight}>
          <img src={gatitoHome} alt="sticker" className={styles.stickerHero} />
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section className={styles.servicesSection} id="servicios">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Nuestros <em>servicios</em>
          </h2>
          <p className={styles.sectionSub}>
            Tratamientos personalizados para cada cliente
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {(services.length > 0
            ? services
            : [
                {
                  id: 1,
                  name: "Uñas semipermanentes",
                  price: 8500,
                  durationMinutes: 60,
                },
                {
                  id: 2,
                  name: "Pestañas pelo por pelo",
                  price: 12000,
                  durationMinutes: 90,
                },
                {
                  id: 3,
                  name: "Lifting de pestañas",
                  price: 7000,
                  durationMinutes: 45,
                },
                {
                  id: 4,
                  name: "Depilación láser",
                  price: 15000,
                  durationMinutes: 30,
                },
                {
                  id: 5,
                  name: "Limpieza facial",
                  price: 9000,
                  durationMinutes: 50,
                },
                {
                  id: 6,
                  name: "Masaje relajante",
                  price: 10000,
                  durationMinutes: 60,
                },
              ]
          ).map((s) => (
            <div key={s.id} className={styles.serviceCard}>
              <span className={styles.serviceIcon}>
                {SERVICE_ICONS[s.name] || "✦"}
              </span>
              <h3 className={styles.serviceName}>{s.name}</h3>
              <div className={styles.serviceMeta}>
                <span className={styles.servicePrice}>
                  ${Number(s.price).toLocaleString("es-AR")}
                </span>
                <span className={styles.serviceDuration}>
                  {s.durationMinutes} min
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALERÍA ── */}
      <section className={styles.gallerySection} id="galeria">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Nuestros <em>trabajos</em>
          </h2>
          <p className={styles.sectionSub}>
            Resultados reales de clientes reales
          </p>
        </div>

        <div className={styles.categoryFilters}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.catBtn} ${activeCategory === cat ? styles.catBtnActive : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.galleryGrid}>
          {filtered.map((item) => (
            <div key={item.id} className={styles.galleryItem}>
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.alt}
                  className={styles.galleryImg}
                />
              ) : (
                /* Placeholder si no hay fotos reales o no cargan */
                <div className={styles.galleryPlaceholder}>
                  <span className={styles.placeholderIcon}>📷</span>
                  <span className={styles.placeholderText}>{item.alt}</span>
                </div>
              )}
              <div className={styles.galleryOverlay}>
                <span className={styles.galleryCategory}>{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaText}>
            <h2 className={styles.ctaTitle}>
              ¿Lista para tu próximo <em>turno</em>?
            </h2>
            <p className={styles.ctaSub}>
              Reservá online en segundos, sin llamadas ni esperas.
            </p>
          </div>
          <div className={styles.ctaActions}>
            {user ? (
              <Link to="/appointments" className={styles.btnPinkLg}>
                Reservar ahora
              </Link>
            ) : (
              <>
                <Link to="/register" className={styles.btnPinkLg}>
                  Crear cuenta
                </Link>
                <Link to="/login" className={styles.btnGhostDark}>
                  Ya tengo cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
