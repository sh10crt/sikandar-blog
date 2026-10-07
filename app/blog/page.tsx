import { getAllArticles } from "../lib/articles";
import ArticleBrowser from "./ArticleBrowser";

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-xl font-bold tracking-tight text-white"
          >
            SIKANDAR<span className="text-cyan-400">.</span>
          </a>

          <div className="flex gap-6 text-sm text-slate-300">
            <a href="/" className="transition hover:text-cyan-400">
              Home
            </a>

            <a href="/blog" className="font-medium text-cyan-400">
              Blog
            </a>

            <a href="/#about" className="transition hover:text-cyan-400">
              About
            </a>
          </div>
        </nav>
      </header>

      {/* Blog Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
            The Blog
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
            Articles{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              & Ideas
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Thoughts, projects, lessons and experiments from my journey through
            technology and cybersecurity.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="border-t border-white/10 bg-slate-900/70">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <ArticleBrowser articles={articles} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Sikandar. All rights reserved.
          </p>

          <p>Technology • Cybersecurity • Ideas</p>
        </div>
      </footer>
    </main>
  );
}