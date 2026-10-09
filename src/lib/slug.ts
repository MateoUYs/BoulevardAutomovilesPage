const slugSafePattern = /[^a-z0-9]+/g;

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(slugSafePattern, "-")
    .replace(/^-+|-+$/g, "");
}

export function shortId(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toLowerCase();
}

export function buildCarSlug(input: {
  brand: string;
  model: string;
  year: number;
  id: string;
}) {
  return `${slugify(`${input.brand} ${input.model} ${input.year}`)}-${shortId(input.id)}`;
}
