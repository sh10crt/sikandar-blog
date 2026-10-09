
import { Suspense } from "react";
import { requireAdmin } from "../../lib/supabase/admin";
import DeleteArticleButton from "./DeleteArticleButton";

async function deleteArticle(formData: FormData) {
  "use server";

  await requireAdmin();

  const { createClient } = await import("../../lib/supabase/server");
  const supabase = await createClient();

  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    throw new Error("Invalid article ID.");
  }

  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error("Unable to delete article.");
  }

  const { redirect } = await import("next/navigation");
  redirect("/admin/articles");
}

async function ArticlesContent() {
  await requireAdmin();

  const { createClient } = await import("../../lib/supabase/server");
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from("articles")
    .select(
      "id, title, slug, category, status, created_at, updated_at"
    )
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Admin / Manage Articles
          </p>

          <h1 className="text-4xl font-black text-white">
            Articles
          </h1>

          <p className="mt-3 text-slate-400">
            Create and manage your blog articles.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/articles/new"
            className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            + New Article
          </a>

          <a
            href="/admin"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Back to Dashboard
          </a>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6">
          <h2 className="text-xl font-bold text-red-300">
            Unable to load articles
          </h2>

          <p className="mt-2 text-red-200/80">
            There was a problem loading your article database.
          </p>
        </div>
      ) : !articles || articles.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-2xl font-bold text-white">
            No articles yet
          </h2>

          <p className="mt-3 text-slate-400">
            Your Supabase article database is currently empty.
          </p>

          <p className="mt-2 text-slate-500">
            Click &quot;+ New Article&quot; above to create your first article.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Title
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Created
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="transition hover:bg-white/5"
                  >
                    <td className="px-6 py-5">
                      <div className="font-semibold text-white">
                        {article.title}
                      </div>

                      <div className="mt-1 text-sm text-slate-500">
                        /{article.slug}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-300">
                      {article.category}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={
                          article.status === "published"
                            ? "rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300"
                            : "rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300"
                        }
                      >
                        {article.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-400">
                      {new Date(
                        article.created_at
                      ).toLocaleDateString("en-GB")}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`/admin/articles/${article.id}/edit`}
                          className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                        >
                          Edit
                        </a>

                        <DeleteArticleButton
                          articleId={article.id}
                          deleteAction={deleteArticle}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ArticlesLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
        <p className="text-slate-300">
          Loading articles...
        </p>
      </div>
    </div>
  );
}

export default function AdminArticlesPage() {
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
              className="transition hover:text-white"
            >
              Blog
            </a>

            <a
              href="/admin"
              className="font-semibold text-cyan-400"
            >
              Admin
            </a>
          </nav>
        </div>
      </header>

      <Suspense fallback={<ArticlesLoading />}>
        <ArticlesContent />
      </Suspense>
    </main>
  );
}
