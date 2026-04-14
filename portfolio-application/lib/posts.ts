import fs from "node:fs";
import path from "node:path";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  content: string[];
};

const blogDirectory = path.join(process.cwd(), "content", "blog");
const fallbackDate = "1970-01-01";

function parseFrontmatter(markdownFile: string) {
  const normalized = markdownFile.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");

  if (!normalized.startsWith("---\n")) {
    return { frontmatter: {}, body: normalized };
  }

  const closingDelimiterIndex = normalized.indexOf("\n---\n", 4);

  if (closingDelimiterIndex === -1) {
    return { frontmatter: {}, body: normalized };
  }

  const rawFrontmatter = normalized.slice(4, closingDelimiterIndex);
  const body = normalized.slice(closingDelimiterIndex + 5).trim();

  const frontmatterEntries = rawFrontmatter
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const frontmatter = frontmatterEntries.reduce<Record<string, string>>((acc, line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) return acc;
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^"(.*)"$/, "$1");
    acc[key] = value;
    return acc;
  }, {});

  return { frontmatter, body };
}

function getPostContent(body: string) {
  return body
    .split("\n\n")
    .map((paragraph) => paragraph.replace(/\n/g, " ").trim())
    .filter(Boolean)
    .map((paragraph) => paragraph.replace(/^#+\s*/, ""));
}

function getSlugFromFilename(filename: string) {
  return filename.replace(/\.md$/, "");
}

function getPostsFromFiles(): BlogPost[] {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  const markdownFiles = fs
    .readdirSync(blogDirectory)
    .filter((file) => file.toLowerCase().endsWith(".md") && !file.startsWith("_"));

  return markdownFiles.flatMap((filename) => {
    try {
      const filePath = path.join(blogDirectory, filename);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { frontmatter, body } = parseFrontmatter(fileContent);
      const parsedDate = new Date(frontmatter.publishedAt ?? fallbackDate);
      const publishedAt = Number.isNaN(parsedDate.getTime())
        ? fallbackDate
        : (frontmatter.publishedAt ?? fallbackDate);

      return {
        slug: getSlugFromFilename(filename),
        title: frontmatter.title ?? getSlugFromFilename(filename),
        excerpt: frontmatter.excerpt ?? "No excerpt provided.",
        publishedAt,
        readTime: frontmatter.readTime ?? "3 min read",
        tags: frontmatter.tags
          ? frontmatter.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [],
        content: getPostContent(body)
      };
    } catch (error) {
      console.error(`Skipping invalid blog file: ${filename}`, error);
      return [];
    }
  });
}

export const projects = [
  {
    title: "Finance Dashboard Redesign",
    summary:
      "A performant analytics interface with server-rendered summaries and chart hydration only where needed.",
    stack: "Next.js, TypeScript, PostgreSQL"
  },
  {
    title: "Global Learning Portal",
    summary:
      "Multi-locale content platform with SEO-safe routing and metadata templates for each region.",
    stack: "Next.js, i18n Routing, CMS"
  },
  {
    title: "Creative Agency Website",
    summary:
      "Portfolio-led marketing site with case studies, dynamic OG assets, and Lighthouse-focused performance budget.",
    stack: "Next.js, Edge Caching, Design System"
  }
];

export function getAllPosts() {
  return getPostsFromFiles().sort(
    (a, b) => {
      const aTime = new Date(a.publishedAt).getTime();
      const bTime = new Date(b.publishedAt).getTime();
      return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
    }
  );
}

export function getPostBySlug(slug: string) {
  return getPostsFromFiles().find((post) => post.slug === slug);
}

export function formatPostDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
