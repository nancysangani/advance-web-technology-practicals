# Next.js Server-Rendered Portfolio + Blog

This project is a server-rendered portfolio and blog application built with Next.js App Router.

## Why this setup

- SEO-first metadata strategy (route metadata + Open Graph + canonical links)
- Server Components for reduced client-side JavaScript
- `sitemap.xml` and `robots.txt` generated from app routes
- Responsive, token-based UI with a polished visual style

## Pages

- `/` Home with portfolio highlights and latest blog posts
- `/blog` Blog index page
- `/blog/[slug]` Dynamic post detail pages
- `/about` Architecture and strategy notes

## Add your own blog post

Recommended (no code editing):
1. Start dev server: `npm run dev`
2. Open `http://localhost:3000/blog/new`
3. Fill the form and publish
4. Open any post to edit or delete it

Alternative (manual markdown):
1. Create a new file in `content/blog` with a unique filename (this becomes the URL slug).
2. Copy `content/blog/_template.md` and fill in frontmatter + content.
3. Refresh `/blog`.

Example:
- File: `content/blog/my-first-post.md`
- URL: `/blog/my-first-post`

Required frontmatter fields:
- `title`
- `excerpt`
- `publishedAt` (`YYYY-MM-DD`)
- `readTime`
- `tags` (comma-separated)

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## SEO files

- `app/sitemap.ts` for sitemap generation
- `app/robots.ts` for robots policy

Update `baseUrl` in `app/layout.tsx`, `app/sitemap.ts`, and `app/robots.ts` with your production domain.
