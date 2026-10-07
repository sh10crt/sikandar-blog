import { notFound } from "next/navigation";
import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { getArticleBySlug } from "../../lib/articles";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  let article;

  try {
    article = getArticleBySlug(slug);
  } catch {
    notFound();
  }

  const processedContent = await remark()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(article.content);

  const contentHtml = processedContent.toString();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-xl font-bold tracking-tight text-white"
          >
            SIKANDAR<span className="text-cyan-400">.</span>
          </a>

          <div className="flex gap-6 text-sm text-slate-300">
            <a
              href="/"
              className="transition hover:text-cyan-400"
            >
              Home
            </a>

            <a
              href="/blog"
              className="font-medium text-cyan-400 transition"
            >
              Blog
            </a>

            <a
              href="/#about"
              className="transition hover:text-cyan-400"
            >
              About
            </a>
          </div>
        </nav>
      </header>

      {/* Article Header */}
      <section className="relative overflow-hidden">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 py-20 sm:py-28">
          <a
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
          >
            ← Back to Blog
          </a>

          <div className="mt-10">
            <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
              {article.category}
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              {article.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              {article.description}
            </p>

            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
              <span>{article.date}</span>

              <span className="h-1 w-1 rounded-full bg-slate-600" />

              <span>Sikandar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="border-t border-white/10 bg-slate-900/60">
        <article className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <div
            className="
              article-content
              text-lg
              leading-8
              text-slate-300
            "
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-16 border-t border-white/10 pt-8">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                Topics
              </p>

              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 transition hover:border-cyan-400/30 hover:text-cyan-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-16 border-t border-white/10 pt-8">
            <a
              href="/blog"
              className="inline-flex rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-105"
            >
              ← Explore more articles
            </a>
          </div>
        </article>
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