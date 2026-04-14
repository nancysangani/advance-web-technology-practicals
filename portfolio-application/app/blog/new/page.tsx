import fs from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  buildMarkdownPost,
  ensureBlogDirectory,
  getBlogFilePathFromSlug,
  slugify
} from "@/lib/blog-admin";

async function createBlogPost(formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const tags = String(formData.get("tags") ?? "").trim();
  const readTime = String(formData.get("readTime") ?? "").trim() || "4 min read";
  const date = String(formData.get("publishedAt") ?? "").trim();
  const customSlug = String(formData.get("slug") ?? "").trim();

  if (!title || !excerpt || !content || !date) {
    throw new Error("Title, excerpt, content, and date are required.");
  }

  const generatedSlug = slugify(customSlug || title);
  if (!generatedSlug) {
    throw new Error("Unable to generate a valid slug.");
  }

  const filePath = getBlogFilePathFromSlug(generatedSlug);
  await ensureBlogDirectory();

  try {
    await fs.access(filePath);
    throw new Error("A post with this slug already exists.");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  const markdown = buildMarkdownPost({
    title,
    excerpt,
    publishedAt: date,
    readTime,
    tags,
    content
  });

  await fs.writeFile(filePath, markdown, "utf8");

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  redirect(`/blog/${generatedSlug}`);
}

export default function NewBlogPage() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="section">
      <div className="section-head">
        <h1>Create Blog Post</h1>
      </div>
      <form action={createBlogPost} className="article form-card">
        <label className="field">
          <span>Title *</span>
          <input name="title" required placeholder="Your post title" />
        </label>
        <label className="field">
          <span>Slug (optional)</span>
          <input name="slug" placeholder="my-first-post" />
        </label>
        <label className="field">
          <span>Excerpt *</span>
          <textarea name="excerpt" required rows={3} placeholder="Short summary for blog list and SEO" />
        </label>
        <div className="grid grid-2">
          <label className="field">
            <span>Published date *</span>
            <input name="publishedAt" type="date" required defaultValue={today} />
          </label>
          <label className="field">
            <span>Read time</span>
            <input name="readTime" defaultValue="4 min read" />
          </label>
        </div>
        <label className="field">
          <span>Tags (comma-separated)</span>
          <input name="tags" placeholder="Next.js, Portfolio, SEO" />
        </label>
        <label className="field">
          <span>Content *</span>
          <textarea
            name="content"
            required
            rows={14}
            placeholder="Write your post content here. Separate paragraphs with blank lines."
          />
        </label>
        <button className="btn btn-primary" type="submit">
          Publish Post
        </button>
      </form>
    </section>
  );
}
