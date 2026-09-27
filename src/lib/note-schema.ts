import { z } from 'astro/zod';

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').refine(value => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}, 'Use a real calendar date');

export const noteSchema = z.object({
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  kind: z.enum(['note', 'experiment', 'article']).default('note'),
  topics: z.array(z.string().trim().min(1)).min(1).max(4),
  draft: z.boolean().default(true),
  published: date.optional(),
  updated: date.optional(),
  relatedProject: z.literal('personal-memory').optional(),
}).superRefine((data, context) => {
  if (!data.draft && !data.published) {
    context.addIssue({ code: 'custom', message: 'Published notes need a publication date.', path: ['published'] });
  }
  if (data.updated && (!data.published || data.updated < data.published)) {
    context.addIssue({ code: 'custom', message: 'Updated date must be on or after publication.', path: ['updated'] });
  }
});
