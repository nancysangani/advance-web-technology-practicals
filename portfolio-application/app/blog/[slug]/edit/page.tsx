import fs from "node:fs/promises";
import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import {
  buildMarkdownPost,
  ensureBlogDirectory,
  getBlogFilePathFromSlug,
  slugify
} from "@/lib/blog-admin";
import { getPostBySlug } from "@/lib/posts";

type EditPostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: EditPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return { title: "Edit Post" };
  }
  return { title: `Edit: ${post.title}` };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  async function updateBlogPost(formData: FormData) {
    "use server";

    const title = String(formData.get("title") ?? "").trim();
    const excerpt = String(formData.get("excerpt") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const tags = String(formData.get("tags") ?? "").trim();
    const readTime = String(formData.get("readTime") ?? "").trim() || "4 min read";
    const publishedAt = String(formData.get("publishedAt") ?? "").trim();
    const customSlug = String(formData.get("slug") ?? "").trim();

    if (!title || !excerpt || !content || !publishedAt) {
      throw new Error("Title, excerpt, content, and date are required.");
    }

    const nextSlug = slugify(customSlug || title);
    if (!nextSlug) {
      throw new Error("Unable to generate a valid slug.");
    }

    await ensureBlogDirectory();

    const oldFilePath = getBlogFilePathFromSlug(params.slug);
    const newFilePath = getBlogFilePathFromSlug(nextSlug);

    if (nextSlug !== params.slug) {
      try {
        await fs.access(newFilePath);
        throw new Error("A post with this slug already exists.");
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          throw error;
        }
      }
    }

    const markdown = buildMarkdownPost({
      title,
      excerpt,
      publishedAt,
      readTime,
      tags,
      content
    });

    await fs.writeFile(newFilePath, markdown, "utf8");

    if (nextSlug !== params.slug) {
      try {
        await fs.unlink(oldFilePath);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          throw error;
        }
      }
    }

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${params.slug}`);
    revalidatePath(`/blog/${nextSlug}`);
    revalidatePath("/sitemap.xml");
    redirect(`/blog/${nextSlug}`);
  }

  return (
    <section className="section">
      <div className="section-head">
        <h1>Edit Blog Post</h1>
      </div>
      <form action={updateBlogPost} className="article form-card">
        <label className="field">
          <span>Title *</span>
          <input name="title" required defaultValue={post.title} />
        </label>
        <label className="field">
          <span>Slug</span>
          <input name="slug" defaultValue={post.slug} />
        </label>
        <label className="field">
          <span>Excerpt *</span>
          <textarea name="excerpt" required rows={3} defaultValue={post.excerpt} />
        </label>
        <div className="grid grid-2">
          <label className="field">
            <span>Published date *</span>
            <input name="publishedAt" type="date" required defaultValue={post.publishedAt} />
          </label>
          <label className="field">
            <span>Read time</span>
            <input name="readTime" defaultValue={post.readTime} />
          </label>
        </div>
        <label className="field">
          <span>Tags (comma-separated)</span>
          <input name="tags" defaultValue={post.tags.join(", ")} />
        </label>
        <label className="field">
          <span>Content *</span>
          <textarea name="content" required rows={14} defaultValue={post.content.join("\n\n")} />
        </label>
        <button className="btn btn-primary" type="submit">
          Update Post
        </button>
      </form>
    </section>
  );
}
