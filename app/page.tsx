
import { getPublishedArticles } from "./lib/articles";

export const instant = false;

export default async function Home() {
  const articles = (await getPublishedArticles()).slice(0, 3);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      {/* Navigation */}
      <header className="border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <a
            href="/"
            className="self-center text-xl font-bold tracking-tight text-white sm:self-auto"
          >
            SIKANDAR<span className="text-cyan-400">.</span>
          </a>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-300 sm:gap-6">
            <a href="/" className="transition hover:text-cyan-400">
              Home
            </a>
            <a href="/blog" className="transition hover:text-cyan-400">
              Blog
            </a>
            <a href="#about" className="transition hover:text-cyan-400">
              About
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 lg:py-28">
          <div className="min-w-0">
            <div className="mb-6 inline-flex max-w-full rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs text-cyan-300 sm:text-sm">
              Technology • Cybersecurity • Ideas
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Exploring technology.
              <span className="mt-2 block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Understanding cybersecurity.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:mt-8 sm:text-lg sm:leading-8">
              Welcome to my corner of the internet. I write about
              cybersecurity, technology, digital forensics, scams, projects,
              ideas and the things I learn along the way.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
              <a
                href="/blog"
                className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-105 sm:px-7"
              >
                Explore the blog →
              </a>

              <a
                href="#about"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:border-cyan-400/50 hover:bg-white/5 sm:px-7"
              >
                About me
              </a>
            </div>
          </div>

          {/* Profile Photo — visible on mobile, tablet and desktop */}
          <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[340px]">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-purple-600/30 blur-2xl" />

            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl shadow-cyan-500/10">
              <img
                src="/sikandar.png"
                alt="Sikandar"
                loading="eager"
                fetchPriority="high"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="border-y border-white/10 bg-slate-900/70">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              "Cybersecurity",
              "Digital Forensics",
              "Technology",
              "Scams & Phishing",
              "Networking",
              "Cloud",
              "Projects",
              "Ideas",
            ].map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300 sm:px-4 sm:text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section
        id="articles"
        className="mx-auto max-w-7xl scroll-mt-8 px-4 py-16 sm:px-6 sm:py-24"
      >
        <div className="mb-10 flex items-end justify-between gap-4 sm:mb-12">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
              Latest
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From the blog
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Recent thoughts, lessons and experiments from my journey through
              technology and cybersecurity.
            </p>
          </div>

          <a
            href="/blog"
            className="hidden shrink-0 text-sm font-medium text-cyan-400 transition hover:text-cyan-300 sm:block"
          >
            View all articles →
          </a>
        </div>

        {articles.length > 0 ? (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <article
                key={article.slug}
                className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/10 sm:hover:-translate-y-2"
              >
                <div
                  className={`h-2 ${
                    index === 0
                      ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                      : index === 1
                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                        : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}
                />

                <div className="flex flex-1 flex-col p-5 sm:p-7">
                  <p className="text-sm font-medium text-cyan-400">
                    {article.category}
                  </p>

                  <h3 className="mt-4 break-words text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    {article.title}
                  </h3>

                  <p className="mt-4 flex-1 break-words text-sm leading-7 text-slate-400 sm:text-base">
                    {article.description}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-sm text-slate-500">
                      {article.date}
                    </span>

                    <a
                      href={`/blog/${article.slug}`}
                      className="text-sm font-medium text-white transition hover:text-cyan-400 group-hover:text-cyan-400"
                    >
                      Read article →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center sm:p-10">
            <p className="text-slate-300">
              New articles are coming soon.
            </p>
            <a
              href="/blog"
              className="mt-4 inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              Visit the blog →
            </a>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <a
            href="/blog"
            className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
          >
            View all articles →
          </a>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="scroll-mt-8 border-t border-white/10 bg-gradient-to-b from-slate-900 to-slate-950"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-purple-400">
              About
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              I'm Sikandar.
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-300 sm:text-lg">
              I'm a technology and cybersecurity enthusiast who enjoys
              exploring how systems work, how they can be attacked and,
              most importantly, how they can be protected.
            </p>

            <p className="mt-5 text-base leading-8 text-slate-400 sm:text-lg">
              This website is my personal space to share what I learn, the
              projects I build, cybersecurity topics that interest me, and
              ideas I think are worth discussing.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left">
          <p>© 2026 Sikandar. All rights reserved.</p>
          <p>Technology • Cybersecurity • Ideas</p>
        </div>
      </footer>
    </main>
  );
}
