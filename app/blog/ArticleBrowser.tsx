"use client";

import { useMemo, useState } from "react";
import type { Article } from "../lib/articles";

type ArticleBrowserProps = {
  articles: Article[];
};

export default function ArticleBrowser({
  articles,
}: ArticleBrowserProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(
      new Set(articles.map((article) => article.category))
    ),
  ];

  const filteredArticles = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return articles.filter((article) => {
      const matchesCategory =
        category === "All" || article.category === category;

      const matchesSearch =
        searchTerm === "" ||
        article.title.toLowerCase().includes(searchTerm) ||
        article.description.toLowerCase().includes(searchTerm) ||
        article.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm)
        );

      return matchesCategory && matchesSearch;
    });
  }, [articles, category, search]);

  return (
    <>
      {/* Search */}
      <div className="mb-8">
        <label htmlFor="article-search" className="sr-only">
          Search articles
        </label>

        <input
          id="article-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search articles..."
          className="w-full rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        />
      </div>

      {/* Categories */}
      <div className="mb-10 flex flex-wrap gap-3">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
              category === item
                ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950"
                : "border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40 hover:text-cyan-300"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Results */}
      {filteredArticles.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-950 p-12 text-center">
          <h2 className="text-xl font-semibold text-white">
            No articles found
          </h2>

          <p className="mt-2 text-slate-400">
            Try a different search term or category.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article, index) => (
            <article
              key={article.slug}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950 transition duration-300 hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              <div
                className={`h-2 ${
                  index % 3 === 0
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                    : index % 3 === 1
                      ? "bg-gradient-to-r from-blue-500 to-purple-500"
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                }`}
              />

              <div className="flex flex-1 flex-col p-7">
                <p className="text-sm font-medium text-cyan-400">
                  {article.category}
                </p>

                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
                  {article.title}
                </h2>

                <p className="mt-4 flex-1 leading-7 text-slate-400">
                  {article.description}
                </p>

                {article.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-7 flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    {article.date}
                  </span>

                  <a
                    href={`/blog/${article.slug}`}
                    className="text-sm font-medium text-white transition group-hover:text-cyan-400"
                  >
                    Read article →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}