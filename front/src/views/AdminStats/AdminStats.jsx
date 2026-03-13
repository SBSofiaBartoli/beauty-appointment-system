import { useEffect, useState } from "react";
import api from "../../helpers/api";
import { useAuth } from "../../context/Authcontext";
import { useNavigate } from "react-router-dom";
import styles from "./AdminStats.module.css";

function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    api
      .get("/admin/stats")
      .then((r) => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAdmin, navigate]);

  if (loading) return <p className={styles.msg}>Cargando estadísticas...</p>;
  if (!stats)
    return (
      <p className={styles.msg}>No se pudieron cargar las estadísticas.</p>
    );

  const cancelRate =
    stats.total > 0 ? ((stats.cancelled / stats.total) * 100).toFixed(1) : 0;
  const maxMonth = Math.max(
    ...(stats.byMonth.map((m) => Number(m.count)) || [1]),
    1,
  );

  const KPIs = [
    { label: "Turnos totales", value: stats.total, accent: "default" },
    { label: "Activos", value: stats.active, accent: "green" },
    {
      label: `Cancelados (${cancelRate}%)`,
      value: stats.cancelled,
      accent: "red",
    },
    {
      label: "Ingresos est.",
      value: `$${Number(stats.estimatedRevenue).toLocaleString("es-AR")}`,
      accent: "pink",
    },
  ];

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>
          Panel de <em>Estadísticas</em>
        </h1>
        <p className={styles.subtitle}>Resumen general del negocio</p>
      </div>

      <div className={styles.kpiGrid}>
        {KPIs.map((k) => (
          <div
            key={k.label}
            className={`${styles.kpi} ${styles[`kpi_${k.accent}`]}`}
          >
            <span className={styles.kpiValue}>{k.value}</span>
            <span className={styles.kpiLabel}>{k.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.twoCol}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Turnos por mes</h2>
          {stats.byMonth.length === 0 ? (
            <p className={styles.noData}>Sin datos aún</p>
          ) : (
            <ul className={styles.barList}>
              {stats.byMonth.map((m) => (
                <li key={m.month} className={styles.barRow}>
                  <span className={styles.barLabel}>{m.month}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: `${(Number(m.count) / maxMonth) * 100}%`,
                      }}
                    />
                  </div>
                  <span className={styles.barCount}>{m.count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Top tratamientos</h2>
          {stats.topTreatments.length === 0 ? (
            <p className={styles.noData}>Sin datos aún</p>
          ) : (
            <ul className={styles.rankList}>
              {stats.topTreatments.map((t, i) => (
                <li key={t.treatment} className={styles.rankRow}>
                  <span className={styles.rankNum}>#{i + 1}</span>
                  <span className={styles.rankName}>{t.treatment}</span>
                  <span className={styles.rankCount}>{t.count} turnos</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminStats;
