import { prefixBase } from './base-path.mjs';
import { defineHastPlugin } from 'satteri';

/** Keep root-relative Markdown links and public images inside the deployed site.
 * @param {{ base: string }} options
 */
export default function markdownBase({ base }) {
  return defineHastPlugin({
    name: 'portfolio-base-path',
    element: {
      filter: ['a', 'img'],
      visit(node, context) {
        for (const key of ['href', 'src']) {
          const value = node.properties[key];
          if (typeof value === 'string') context.setProperty(node, key, prefixBase(value, base));
        }
      },
    },
  });
}
