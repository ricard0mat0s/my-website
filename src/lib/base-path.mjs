/** Prefix site-root paths, leaving external URLs and page anchors unchanged.
 * @param {string} path
 * @param {string} base
 */
export function prefixBase(path, base = '/') {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return `${base.replace(/\/$/, '')}${path}`;
}
