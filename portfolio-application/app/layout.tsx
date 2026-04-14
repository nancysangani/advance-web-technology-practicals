import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body"
});

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display"
});

const siteUrl = "https://example-portfolio.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aster Studio | Next.js Portfolio & Blog",
    template: "%s | Aster Studio"
  },
  description:
    "Server-rendered portfolio and blog built with Next.js for fast loading, rich SEO metadata, and exceptional reading experience.",
  keywords: [
    "Next.js portfolio",
    "server rendered blog",
    "SEO optimized website",
    "web design",
    "frontend developer"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    title: "Aster Studio | Next.js Portfolio & Blog",
    description:
      "A server-rendered portfolio and blog that balances performance, discoverability, and strong visual design.",
    url: siteUrl,
    siteName: "Aster Studio"
  },
  twitter: {
    card: "summary_large_image",
    title: "Aster Studio | Next.js Portfolio & Blog",
    description:
      "A server-rendered portfolio and blog that balances performance, discoverability, and strong visual design."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <div className="page-shell">
          <header className="site-header">
            <div className="container nav-wrap">
              <Link className="brand" href="/">
                Aster Studio
              </Link>
              <nav className="nav">
                <Link href="/blog">Blog</Link>
                <Link href="/blog/new">Write</Link>
                <Link href="/about">About</Link>
              </nav>
            </div>
          </header>
          <main className="container">{children}</main>
          <footer className="site-footer">
            <div className="container footer-wrap">
              <p>Built with Next.js App Router, Server Components, and SEO-first metadata.</p>
              <p>{new Date().getFullYear()} Aster Studio</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
