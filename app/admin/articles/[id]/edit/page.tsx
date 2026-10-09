export const instant = false;

import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";
import {
  getTextField,
  makeSlug,
  isValidSlug,
  parseTags,
} from "../../../../lib/article-validation";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function EditArticleContent({ id }: { id: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: article, error } = await supabase
    .from("articles")
    .select(
      "id, title, slug, description, category, tags, content, status"
    )
    .eq("id", id)
    .single();

  if (error || !article) {
    notFound();
  }

  const currentStatus = article.status;

  async function updateArticle(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/admin/login");
    }

    const title = getTextField(formData, "title");
    const slugInput = getTextField(formData, "slug");
    const description = getTextField(formData, "description");
    const category = getTextField(formData, "category");
    const content = getTextField(formData, "content");
    const tagsInput = getTextField(formData, "tags");
    const status = getTextField(formData, "status", "draft");

    if (!title || title.length > 150) {
      throw new Error(
        "Title is required and must be 150 characters or fewer."
      );
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
        "Content is required and must be 50,000 characters or fewer."
      );
    }

    if (status !== "draft" && status !== "published") {
      throw new Error("Invalid article status.");
    }

    const slug = makeSlug(slugInput || title);

    if (!isValidSlug(slug)) {
      throw new Error("Please provide a valid article slug.");
    }

    const tags = parseTags(tagsInput);

    const { error } = await supabase
      .from("articles")
      .update({
        title,
        slug,
        description,
        category,
        content,
        tags,
        status,
        published_at:
          status === "published"
            ? currentStatus === "published"
              ? undefined
              : new Date().toISOString()
            : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      if (error.code === "23505") {
        throw new Error(
          "An article with this slug already exists."
        );
      }

      throw new Error("Could not update the article.");
    }

    redirect("/admin/articles");
  }

  const tagsValue = Array.isArray(article.tags)
    ? article.tags.join(", ")
    : "";

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Admin / Edit Article
        </p>

        <h1 className="text-4xl font-black text-white">
          Edit Article
        </h1>

        <p className="mt-3 text-slate-400">
          Update your article and choose whether it stays private or becomes public.
        </p>
      </div>

      <form
        action={updateArticle}
        className="space-y-8 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
      >
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-slate-200"
          >
            Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            defaultValue={article.title}
            maxLength={150}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="mb-2 block text-sm font-semibold text-slate-200"
          >
            Slug
          </label>

          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={article.slug}
            maxLength={100}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
          />

          <p className="mt-2 text-sm text-slate-500">
            Example: phishing-awareness. Use letters, numbers and single hyphens.
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-slate-200"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            defaultValue={article.description}
            maxLength={300}
            rows={3}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-semibold text-slate-200"
          >
            Category
          </label>

          <input
            id="category"
            name="category"
            type="text"
            defaultValue={article.category}
            maxLength={80}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
          />
        </div>

        <div>
          <label
            htmlFor="tags"
            className="mb-2 block text-sm font-semibold text-slate-200"
          >
            Tags
          </label>

          <input
            id="tags"
            name="tags"
            type="text"
            defaultValue={tagsValue}
            maxLength={1000}
            placeholder="cybersecurity, phishing, security"
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
          />

          <p className="mt-2 text-sm text-slate-500">
            Separate tags with commas. Maximum 20 tags, 40 characters per tag.
          </p>
        </div>

        <div>
          <label
            htmlFor="content"
            className="mb-2 block text-sm font-semibold text-slate-200"
          >
            Article Content
          </label>

          <textarea
            id="content"
            name="content"
            defaultValue={article.content}
            rows={20}
            maxLength={50000}
            required
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 font-mono text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
          />

          <p className="mt-2 text-sm text-slate-500">
            Markdown is supported.
          </p>
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-semibold text-slate-200"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            defaultValue={article.status}
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          >
            <option value="draft">
              Draft — hidden from public
            </option>
            <option value="published">
              Published — visible publicly
            </option>
          </select>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6">
          <button
            type="submit"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Save Changes
          </button>

          <a
            href="/admin/articles"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}

export default async function EditArticlePage({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/95">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-xl font-bold tracking-tight text-white"
          >
            Sikandar<span className="text-cyan-400">.</span>
          </a>

          <nav className="flex items-center gap-6 text-sm text-slate-300">
            <a
              href="/admin/articles"
              className="font-semibold text-cyan-400"
            >
              Articles
            </a>

            <a
              href="/admin"
              className="transition hover:text-white"
            >
              Dashboard
            </a>
          </nav>
        </div>
      </header>

      <Suspense
        fallback={
          <div className="mx-auto max-w-4xl px-6 py-16">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
              <p className="text-slate-300">
                Loading article...
              </p>
            </div>
          </div>
        }
      >
        <EditArticleContent id={id} />
      </Suspense>
    </main>
  );
}