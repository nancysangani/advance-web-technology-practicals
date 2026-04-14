import type { Metadata } from "next";
import Link from "next/link";
import { formatPostDate, getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical and design writing focused on fast, SEO-friendly web products."
};

export const revalidate = 300;

export default function BlogPage() {
  const allPosts = getAllPosts();

  return (
    <section className="section">
      <div className="section-head">
        <h1>Blog</h1>
        <Link className="btn btn-secondary" href="/blog/new">
          Write New Post
        </Link>
      </div>
      {allPosts.length === 0 ? (
        <article className="card">
          <h3>No posts yet</h3>
          <p>Create your first blog post from the Write page.</p>
        </article>
      ) : (
        <div className="grid grid-2">
          {allPosts.map((post) => (
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
  );
}
