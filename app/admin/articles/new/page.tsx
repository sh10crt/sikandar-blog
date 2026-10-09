export const instant = false;

import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";

function makeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 20);
}

export default async function NewArticlePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  async function createArticle(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/admin/login");
    }

    const title = String(formData.get("title") ?? "").trim();
    const slugInput = String(formData.get("slug") ?? "").trim();
    const description = String(
      formData.get("description") ?? ""
    ).trim();
    const category = String(
      formData.get("category") ?? ""
    ).trim();
    const content = String(
      formData.get("content") ?? ""
    ).trim();
    const tagsInput = String(
      formData.get("tags") ?? ""
    ).trim();
    const status = String(
      formData.get("status") ?? "draft"
    );

    if (!title || title.length > 150) {
      throw new Error("Title is required and must be 150 characters or fewer.");
    }

    if (!description || description.length > 300) {
      throw new Error(
        "Description is required and must be 300 characters or fewer."
      );
    }

    if (!category || category.length > 80) {
      throw new Error(
        "Category is required and must be 80 characters or fewer."
      );
    }

    if (!content || content.length > 50000) {
      throw new Error(
        "Article content is required and must be 50,000 characters or fewer."
      );
    }

    if (status !== "draft" && status !== "published") {
      throw new Error("Invalid article status.");
    }

    const slug = makeSlug(slugInput || title);

    if (!slug || slug.length > 100) {
      throw new Error("Please provide a valid article slug.");
    }

    const tags = parseTags(tagsInput);

    const { error } = await supabase
      .from("articles")
      .insert({
        title,
        slug,
        description,
        content,
        category,
        tags,
        status,
        published_at:
          status === "published" ? new Date().toISOString() : null,
      });

    if (error) {
      if (error.code === "23505") {
        throw new Error(
          "An article with this slug already exists."
        );
      }

      throw new Error("Could not create the article.");
    }

    redirect("/admin/articles");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <a
            href="/admin/articles"
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            â† Back to Articles
          </a>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Admin
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Create New Article
          </h1>

          <p className="mt-3 text-slate-400">
            Write and publish a new article.
          </p>
        </div>

        <form
          action={createArticle}
          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8"
        >
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={150}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="Understanding Phishing"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="mb-2 block text-sm font-semibold"
            >
              Slug
            </label>

            <input
              id="slug"
              name="slug"
              type="text"
              maxLength={100}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="understanding-phishing"
            />

            <p className="mt-2 text-xs text-slate-500">
              Leave blank to generate the slug from the title.
            </p>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              required
              maxLength={300}
              rows={3}
              className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="A short description of the article..."
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold"
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                required
                maxLength={80}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                placeholder="Cybersecurity"
              />
            </div>

            <div>
              <label
                htmlFor="tags"
                className="mb-2 block text-sm font-semibold"
              >
                Tags
              </label>

              <input
                id="tags"
                name="tags"
                type="text"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                placeholder="phishing, scams, security"
              />

              <p className="mt-2 text-xs text-slate-500">
                Separate tags with commas.
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-semibold"
            >
              Article Content
            </label>

            <textarea
              id="content"
              name="content"
              required
              maxLength={50000}
              rows={20}
              className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-sm text-white outline-none focus:border-cyan-400"
              placeholder="Write your article here..."
            />

            <p className="mt-2 text-xs text-slate-500">
              Markdown is supported for headings, lists, links and other formatting.
            </p>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-semibold"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue="draft"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              type="submit"
              className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Save Article
            </button>

            <a
              href="/admin/articles"
              className="rounded-xl border border-slate-700 px-6 py-3 text-center font-semibold transition hover:border-slate-500"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
