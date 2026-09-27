import { prefixBase } from './base-path.mjs';

export const withBase = (path: string) => prefixBase(path, import.meta.env.BASE_URL);
