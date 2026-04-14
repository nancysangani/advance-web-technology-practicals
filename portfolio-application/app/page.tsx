import Link from "next/link";
import { formatPostDate, getAllPosts } from "@/lib/posts";

export const revalidate = 300;

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <>
      <section className="hero">
        <span className="eyebrow">Server-rendered by default</span>
        <h1>Portfolio + Blog built for SEO and speed.</h1>
        <p>
          This Next.js application uses Server Components, route-level metadata, and lightweight
          UI patterns to deliver quick loads and strong discoverability without sacrificing design.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/blog">
            Explore Blog
          </Link>
          <Link className="btn btn-secondary" href="/about">
            About This Build
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Latest Insights</h2>
          <Link className="btn btn-secondary" href="/blog/new">
            Write a Post
          </Link>
        </div>
        {latestPosts.length === 0 ? (
          <article className="card">
            <h3>No blog posts published yet</h3>
            <p>Start writing from the new post page and your article will appear here automatically.</p>
          </article>
        ) : (
          <div className="grid grid-3">
            {latestPosts.map((post) => (
              <article className="card" key={post.slug}>
                <h3>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p>{post.excerpt}</p>
                <div className="meta">
                  <span>{formatPostDate(post.publishedAt)}</span>
                  <span>{post.readTime}</span>
                </div>
                <div className="tag-row">
                  {post.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
