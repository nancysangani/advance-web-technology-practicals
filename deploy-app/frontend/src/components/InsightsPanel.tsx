type Insight = {
  label: string;
  value: string;
  hint: string;
};

const insights: Insight[] = [
  {
    label: "Initial JS",
    value: "< 160KB",
    hint: "Split chunks + dead-code elimination",
  },
  { label: "LCP", value: "< 1.8s", hint: "Font preconnect + fast hero paint" },
  {
    label: "Time to Deploy",
    value: "~5 min",
    hint: "One-click on Vercel + Render",
  },
];

export default function InsightsPanel() {
  return (
    <section className="panel reveal">
      <h2>Performance Snapshot</h2>
      <div className="insight-grid">
        {insights.map((item) => (
          <article key={item.label} className="insight-card">
            <p className="insight-label">{item.label}</p>
            <p className="insight-value">{item.value}</p>
            <p className="insight-hint">{item.hint}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
