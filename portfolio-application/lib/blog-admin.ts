import fs from "node:fs/promises";
import path from "node:path";

export const blogDir = path.join(process.cwd(), "content", "blog");

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function sanitizeFrontmatter(value: string) {
  return value.replace(/"/g, '\\"').trim();
}

export function buildMarkdownPost(params: {
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  tags: string;
  content: string;
}) {
  return `---
title: "${sanitizeFrontmatter(params.title)}"
excerpt: "${sanitizeFrontmatter(params.excerpt)}"
publishedAt: "${sanitizeFrontmatter(params.publishedAt)}"
readTime: "${sanitizeFrontmatter(params.readTime)}"
tags: "${sanitizeFrontmatter(params.tags)}"
---

${params.content}
`;
}

export function getBlogFilePathFromSlug(slug: string) {
  return path.join(blogDir, `${slug}.md`);
}

export async function ensureBlogDirectory() {
  await fs.mkdir(blogDir, { recursive: true });
}
