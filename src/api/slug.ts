/**
 * Normalize a title or slug into the URL-safe form used as the key of
 * `slug-index.json` and the `slug` of `article.json`.
 *
 * The input is NFKC-normalized, full-width alphanumerics become ASCII,
 * whitespace runs become a single `-`, leading/trailing `-` are trimmed,
 * the result is lowercased and finally percent-encoded.
 *
 * Idempotent: `toUrlSlug(toUrlSlug(s)) === toUrlSlug(s)`. An already-encoded
 * slug (the template stores `toUrlSlug(title)` in the frontmatter, and
 * `hagaki generate` normalizes it again) is percent-decoded first, so it is
 * not encoded a second time. Input that is not valid percent-encoding (for
 * example a literal `100%`) is used as is.
 */
export function toUrlSlug(str: string): string {
    return encodeURIComponent(
        safeDecode(str)
            .normalize("NFKC")
            .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
                String.fromCharCode(s.charCodeAt(0) - 0xfee0),
            )
            .replace(/\s+/g, "-")
            .replace(/[\u3000]/g, "-")
            .replace(/--+/g, "-")
            .replace(/^-+|-+$/g, "")
            .toLowerCase(),
    );
}

/** Percent-decode `str`, or return it unchanged when it is malformed. */
export function safeDecode(str: string): string {
    try {
        return decodeURIComponent(str);
    } catch (e) {
        if (e instanceof URIError) return str;
        throw e;
    }
}
