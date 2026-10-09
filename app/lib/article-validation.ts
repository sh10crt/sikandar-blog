const MAX_TAGS = 20;
const MAX_TAG_LENGTH = 40;
const MAX_TAG_INPUT_LENGTH = 1000;

export function getTextField(
  formData: FormData,
  name: string,
  fallback?: string
): string {
  const value = formData.get(name);

  if (value === null && fallback !== undefined) {
    return fallback;
  }

  if (typeof value !== "string") {
    throw new Error(`Invalid ${name} field.`);
  }

  return value.trim();
}

export function makeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidSlug(slug: string): boolean {
  return (
    slug.length > 0 &&
    slug.length <= 100 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  );
}

export function parseTags(value: string): string[] {
  if (value.length > MAX_TAG_INPUT_LENGTH) {
    throw new Error("Tags must be 1,000 characters or fewer.");
  }

  const tags = value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  if (tags.length > MAX_TAGS) {
    throw new Error("You can add a maximum of 20 tags.");
  }

  if (tags.some((tag) => tag.length > MAX_TAG_LENGTH)) {
    throw new Error("Each tag must be 40 characters or fewer.");
  }

  return tags;
}