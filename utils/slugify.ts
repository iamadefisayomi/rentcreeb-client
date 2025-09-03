import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId({ length: 6 });

export function slugify(text: string): string {
  const base = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

    return `${base}-${uid.randomUUID()}`;
}