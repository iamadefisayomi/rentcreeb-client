/**
 * Return a "clean" route path that keeps only human-friendly segments.
 * Examples:
 *   "/messages/68c6d4.../68c6cd..." -> "/messages"
 *   "/dashboard/tools/message/abc123;xyz/..." -> "/dashboard/tools/message"
 */
export function getCleanPath(input: string): string {
  // Normalize input -> pathname (works with absolute URLs and relative paths)
  let pathname = "/";
  try {
    if (input.startsWith("/")) {
      pathname = input;
    } else {
      // try parse absolute URL, fallback to relative with base
      try {
        pathname = new URL(input).pathname;
      } catch {
        pathname = new URL(input, "http://example.com").pathname;
      }
    }
  } catch {
    // fallback
    pathname = "/";
  }

  // Split & trim segments
  const parts = pathname
    .split("/")
    .map((p) => p.trim())
    .filter(Boolean);

  // Heuristics for junk / id-like segments
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isLongHex = /^[0-9a-f]{8,}$/i; // e.g. mongo hex ids
  const hasWeirdChars = /[;,=%<>]/; // characters unlikely in normal slugs
  const okSlug = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/i; // typical slug (letters, digits, hyphen/underscore groups)

  function isJunkSegment(seg: string): boolean {
    if (isUUID.test(seg)) return true;
    if (isLongHex.test(seg)) return true;
    if (hasWeirdChars.test(seg)) return true;
    // very long segments are probably IDs or encoded data
    if (seg.length >= 20) return true;
    // if many digits relative to length (common for id-like strings)
    const digits = (seg.match(/\d/g) || []).length;
    if (seg.length >= 8 && digits / seg.length > 0.5) return true;
    // keep only tidy slugs; if it doesn't match okSlug, treat as junk
    if (!okSlug.test(seg)) return true;
    return false;
  }

  // Filter out junk segments
  const cleanParts = parts.filter((p) => !isJunkSegment(p));

  // Ensure we always return at least "/" (or "/" + cleaned segments)
  return "/" + cleanParts.join("/");
}
