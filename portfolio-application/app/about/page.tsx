import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Architecture notes for this SEO-focused, server-rendered Next.js portfolio project."
};

const principles = [
  {
    title: "Server Rendering First",
    body: "Pages are rendered on the server with App Router defaults and light client JavaScript for fast initial paint."
  },
  {
    title: "SEO Built Into Routing",
    body: "Route metadata, canonical paths, Open Graph defaults, sitemap, and robots directives are part of the app foundation."
  },
  {
    title: "UI With System Thinking",
    body: "A compact token-driven style system keeps visual quality high while making expansion easy as content grows."
  }
];

export default function AboutPage() {
  return (
    <section className="section">
      <div className="section-head">
        <h1>About This Application</h1>
      </div>
      <div className="grid grid-3">
        {principles.map((item) => (
          <article className="card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
