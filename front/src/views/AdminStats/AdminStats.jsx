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

  return (
    <main className={styles.container}>
      <h1>Panel de Estadísticas</h1>

      <div className={styles.kpiGrid}>
        <div className={styles.kpi}>
          <span className={styles.kpiValue}>{stats.total}</span>
          <span className={styles.kpiLabel}>Turnos totales</span>
        </div>
        <div className={`${styles.kpi} ${styles.kpiGreen}`}>
          <span className={styles.kpiValue}>{stats.active}</span>
          <span className={styles.kpiLabel}>Activos</span>
        </div>
        <div className={`${styles.kpi} ${styles.kpiRed}`}>
          <span className={styles.kpiValue}>{stats.cancelled}</span>
          <span className={styles.kpiLabel}>Cancelados ({cancelRate}%)</span>
        </div>
        <div className={`${styles.kpi} ${styles.kpiGold}`}>
          <span className={styles.kpiValue}>
            ${Number(stats.estimatedRevenue).toLocaleString("es-AR")}
          </span>
          <span className={styles.kpiLabel}>Ingresos estimados</span>
        </div>
      </div>

      <div className={styles.twoCol}>
        <section className={styles.section}>
          <h2>Turnos por mes</h2>
          {stats.byMonth.length === 0 ? (
            <p className={styles.empty}>Sin datos</p>
          ) : (
            <ul className={styles.list}>
              {stats.byMonth.map((m) => (
                <li key={m.month} className={styles.listItem}>
                  <span>{m.month}</span>
                  <div className={styles.barWrap}>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${Math.min((m.count / Math.max(...stats.byMonth.map((x) => x.count))) * 100, 100)}%`,
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
          <h2>Tratamientos más solicitados</h2>
          {stats.topTreatments.length === 0 ? (
            <p className={styles.empty}>Sin datos</p>
          ) : (
            <ul className={styles.list}>
              {stats.topTreatments.map((t, i) => (
                <li key={t.treatment} className={styles.listItem}>
                  <span className={styles.rank}>#{i + 1}</span>
                  <span className={styles.treatName}>{t.treatment}</span>
                  <span className={styles.barCount}>{t.count} turnos</span>
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
