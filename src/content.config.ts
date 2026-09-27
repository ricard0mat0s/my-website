import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { noteSchema } from './lib/note-schema';

const exploring = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/exploring' }),
  schema: z.object({
    title: z.string(),
    topic: z.string(),
    order: z.number(),
    icon: z.enum(['spark', 'code']),
    relatedLabel: z.string(),
    relatedHref: z.string().startsWith('/'),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: noteSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    subtitle: z.string().min(1),
    status: z.string().min(1),
    stack: z.string().min(1),
    repository: z.url({ protocol: /^https?$/ }).optional(),
    draft: z.boolean().default(true),
    order: z.number().default(100),
  }),
});

export const collections = { exploring, notes, projects };
