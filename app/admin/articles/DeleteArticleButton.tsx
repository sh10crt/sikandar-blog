"use client";

import { useState } from "react";

type DeleteArticleButtonProps = {
  articleId: string;
  deleteAction: (formData: FormData) => void | Promise<void>;
};

export default function DeleteArticleButton({
  articleId,
  deleteAction,
}: DeleteArticleButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article? This action cannot be undone."
    );

    if (!confirmed) {
      event.preventDefault();
      return;
    }

    setIsDeleting(true);
  }

  return (
    <form action={deleteAction} onSubmit={handleSubmit}>
      <input
        type="hidden"
        name="id"
        value={articleId}
      />

      <button
        type="submit"
        disabled={isDeleting}
        className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </form>
  );
}