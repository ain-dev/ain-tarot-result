/**
 * Read a dynamic route segment as the raw id.
 *
 * `useParams()` returns the segment still percent-encoded (`a%2Fb` stays
 * `a%2Fb`), so decode it once here; the API helpers then encode it exactly
 * once when they build the request URL. Encoding the useParams value directly
 * turned `%2F` into `%252F`.
 */
export const decodeRouteParam = (
  value: string | string[] | undefined,
): string => {
  const raw = (Array.isArray(value) ? value[0] : value) ?? '';
  try {
    return decodeURIComponent(raw);
  } catch {
    // Malformed escape such as a lone `%`: the value is already raw.
    return raw;
  }
};
