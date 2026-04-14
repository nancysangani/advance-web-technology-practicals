import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { env } from "./config/env";
import { fetchHealth, type HealthResponse } from "./lib/api";

const InsightsPanel = lazy(() => import("./components/InsightsPanel"));

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => env.VITE_APP_TITLE, []);

  useEffect(() => {
    let mounted = true;
    fetchHealth()
      .then((data) => {
        if (mounted) setHealth(data);
      })
      .catch((err: Error) => {
        if (mounted) setError(err.message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="page-shell">
      <div className="orb orb-left" />
      <div className="orb orb-right" />

      <header className="hero reveal">
        <p className="kicker">Production-Ready Full Stack</p>
        <h1>{title}</h1>
        <p className="subtitle">
          Optimized bundles, validated environment management, and cloud
          deployment built in.
        </p>
        <div className="status-row">
          <span className="chip">React + Vite</span>
          <span className="chip">Express API</span>
          <span className="chip">Vercel + Render</span>
        </div>
      </header>

      <main className="content">
        <section className="panel reveal">
          <h2>API Health</h2>
          {error ? (
            <p className="error">{error}</p>
          ) : (
            <>
              <p className="status-text">
                {health?.message ?? "Checking backend..."}
              </p>
              <p className="meta">Server time: {health?.now ?? "..."}</p>
            </>
          )}
        </section>

        <Suspense
          fallback={
            <section className="panel">Loading performance insights...</section>
          }
        >
          <InsightsPanel />
        </Suspense>
      </main>
    </div>
  );
}
