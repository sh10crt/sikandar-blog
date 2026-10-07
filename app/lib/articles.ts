import fs from "fs";
import path from "path";

const articlesDirectory = path.join(
  process.cwd(),
  "content",
  "articles"
);

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
};

type ParsedArticle = Article & {
  content: string;
};

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function parseFrontMatter(
  fileContents: string,
  slug: string
): {
  data: Record<string, unknown>;
  content: string;
} {
  const lines = fileContents.split(/\r?\n/);

  if (lines[0]?.trim() !== "---") {
    throw new Error(`Missing front matter for article: ${slug}`);
  }

  const closingIndex = lines.findIndex(
    (line, index) => index > 0 && line.trim() === "---"
  );

  if (closingIndex === -1) {
    throw new Error(`Invalid front matter for article: ${slug}`);
  }

  const frontMatterLines = lines.slice(1, closingIndex);
  const content = lines.slice(closingIndex + 1).join("\n");

  const data: Record<string, unknown> = {};
  let currentArrayKey: string | null = null;

  for (const line of frontMatterLines) {
    const trimmed = line.trim();

    if (trimmed === "") {
      continue;
    }

    // YAML-style array item:
    //   - phishing
    if (currentArrayKey && trimmed.startsWith("- ")) {
      const value = trimmed
        .slice(2)
        .trim()
        .replace(/^["']|["']$/g, "");

      const currentValue = data[currentArrayKey];

      if (Array.isArray(currentValue)) {
        currentValue.push(value);
      }

      continue;
    }

    const match = line.match(
      /^([A-Za-z0-9_-]+):\s*(.*)$/
    );

    if (!match) {
      throw new Error(
        `Invalid front matter line in article: ${slug}`
      );
    }

    const key = match[1];
    const rawValue = match[2].trim();

    if (rawValue === "") {
      data[key] = [];
      currentArrayKey = key;
      continue;
    }

    currentArrayKey = null;

    const value = rawValue.replace(
      /^["']|["']$/g,
      ""
    );

    data[key] = value;
  }

  return {
    data,
    content,
  };
}

function parseArticle(
  slug: string,
  data: Record<string, unknown>,
  content: string
): ParsedArticle {
  if (typeof data.title !== "string" || data.title.trim() === "") {
    throw new Error(`Invalid title for article: ${slug}`);
  }

  if (
    typeof data.description !== "string" ||
    data.description.trim() === ""
  ) {
    throw new Error(
      `Invalid description for article: ${slug}`
    );
  }

  if (
    typeof data.category !== "string" ||
    data.category.trim() === ""
  ) {
    throw new Error(`Invalid category for article: ${slug}`);
  }

  if (typeof data.date !== "string" || data.date.trim() === "") {
    throw new Error(`Invalid date for article: ${slug}`);
  }

  const parsedDate = new Date(data.date);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date for article: ${slug}`);
  }

  let tags: string[] = [];

  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      throw new Error(`Invalid tags for article: ${slug}`);
    }

    if (!data.tags.every((tag) => typeof tag === "string")) {
      throw new Error(`Invalid tag value for article: ${slug}`);
    }

    tags = data.tags
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return {
    slug,
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category.trim(),
    tags,
    date: data.date.trim(),
    content,
  };
}

export function getAllArticles(): ParsedArticle[] {
  const filenames = fs.readdirSync(articlesDirectory);

  const articles = filenames
    .filter((filename) => {
      const slug = filename.replace(/\.md$/, "");

      return (
        filename.endsWith(".md") &&
        isValidSlug(slug)
      );
    })
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");

      const fullPath = path.join(
        articlesDirectory,
        filename
      );

      const fileContents = fs.readFileSync(
        fullPath,
        "utf8"
      );

      const { data, content } = parseFrontMatter(
        fileContents,
        slug
      );

      return parseArticle(
        slug,
        data,
        content
      );
    });

  return articles.sort((a, b) => {
    return (
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
    );
  });
}

export function getArticleBySlug(
  slug: string
): ParsedArticle {
  if (!isValidSlug(slug)) {
    throw new Error("Invalid article slug");
  }

  const fullPath = path.join(
    articlesDirectory,
    `${slug}.md`
  );

  const resolvedArticlesDirectory =
    path.resolve(articlesDirectory);

  const resolvedFilePath =
    path.resolve(fullPath);

  if (
    !resolvedFilePath.startsWith(
      `${resolvedArticlesDirectory}${path.sep}`
    )
  ) {
    throw new Error("Invalid article path");
  }

  if (!fs.existsSync(resolvedFilePath)) {
    throw new Error("Article not found");
  }

  const fileContents = fs.readFileSync(
    resolvedFilePath,
    "utf8"
  );

  const { data, content } = parseFrontMatter(
    fileContents,
    slug
  );

  return parseArticle(
    slug,
    data,
    content
  );
}