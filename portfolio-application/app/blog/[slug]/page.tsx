import fs from "node:fs/promises";
import type { Metadata } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { getBlogFilePathFromSlug } from "@/lib/blog-admin";
import { formatPostDate, getAllPosts, getPostBySlug } from "@/lib/posts";

type PostPageProps = {
  params: {
    slug: string;
  };
};

export const revalidate = 300;

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`
    }
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  async function deleteBlogPost() {
    "use server";

    const filePath = getBlogFilePathFromSlug(params.slug);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${params.slug}`);
    revalidatePath("/sitemap.xml");
    redirect("/blog");
  }

  return (
    <article className="article">
      <span className="eyebrow">Article</span>
      <h1>{post.title}</h1>
      <p className="lead">{post.excerpt}</p>
      <div className="cta-row">
        <Link className="btn btn-secondary" href={`/blog/${post.slug}/edit`}>
          Edit Post
        </Link>
        <form action={deleteBlogPost}>
          <button className="btn btn-secondary btn-danger" type="submit">
            Delete Post
          </button>
        </form>
      </div>
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
      <section className="article-content">
        {post.content.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </article>
  );
}
