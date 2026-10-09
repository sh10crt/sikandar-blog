
import { Suspense } from "react";
import { requireAdmin } from "../lib/supabase/admin";

async function AdminContent() {
  const user = await requireAdmin();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Admin
          </p>

          <h1 className="text-4xl font-black text-white">
            Dashboard
          </h1>

          <p className="mt-3 text-slate-400">
            Manage your cybersecurity blog and articles.
          </p>
        </div>

        <a
          href="/admin/articles"
          className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Manage Articles
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold text-white">
            Article Management
          </h2>

          <p className="mt-3 leading-7 text-slate-400">
            Create, edit, publish and manage your blog articles.
          </p>

          <a
            href="/admin/articles"
            className="mt-6 inline-block text-cyan-400 hover:text-cyan-300"
          >
            Open articles →
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold text-white">
            Signed-in Account
          </h2>

          <p className="mt-3 break-all text-slate-400">
            {user.email}
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
        <p className="text-slate-300">
          Loading admin dashboard...
        </p>
      </div>
    </div>
  );
}

export default function AdminPage() {
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

      <Suspense fallback={<AdminLoading />}>
        <AdminContent />
      </Suspense>
    </main>
  );
}
