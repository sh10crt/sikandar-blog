import { Suspense } from "react";
import { getPublishedArticles } from "../lib/articles";
import ArticleBrowser from "./ArticleBrowser";

async function PublishedArticles() {
  const articles = await getPublishedArticles();

  return <ArticleBrowser articles={articles} />;
}

function ArticlesLoading() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
      <p className="text-slate-300">Loading articles...</p>
    </div>
  );
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-xl font-bold tracking-tight text-white"
          >
            Sikandar<span className="text-cyan-400">.</span>
          </a>

          <nav className="flex items-center gap-6 text-sm text-slate-300">
            <a
              href="/"
              className="transition hover:text-white"
            >
              Home
            </a>

            <a
              href="/blog"
              className="font-semibold text-cyan-400"
            >
              Blog
            </a>

            <a
              href="/#about"
              className="transition hover:text-white"
            >
              About
            </a>
          </nav>
        </div>
      </header>

      <section className="border-b border-white/10 bg-gradient-to-b from-cyan-950/30 to-slate-950 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            The Blog
          </p>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Cybersecurity, technology and ideas.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Practical articles about cybersecurity, scams, social
            engineering, digital forensics, technology and the things I
            learn along the way.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Suspense fallback={<ArticlesLoading />}>
            <PublishedArticles />
          </Suspense>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Sikandar. All rights reserved.</p>
          <p>Technology • Cybersecurity • Ideas</p>
        </div>
      </footer>
    </main>
  );
}