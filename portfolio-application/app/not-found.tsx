import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero">
      <span className="eyebrow">404</span>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist or has been moved.</p>
      <div className="cta-row">
        <Link className="btn btn-primary" href="/">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
