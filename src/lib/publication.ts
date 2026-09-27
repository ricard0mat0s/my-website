type Publishable = { id: string; data: { draft: boolean; published?: string } };

// Dates are editorial values, never inferred from the filesystem or build date.
// Future-dated notes stay private until a build on or after their publication day.
export function publishedNotes<T extends Publishable>(entries: T[], today = new Date().toISOString().slice(0, 10)): T[] {
  return entries.filter(({ data }) => !data.draft && !!data.published && data.published <= today)
    .sort((a, b) => b.data.published!.localeCompare(a.data.published!) || a.id.localeCompare(b.id));
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${value}T00:00:00Z`));
}

export const kindLabels = { note: 'Note', experiment: 'Experiment log', article: 'Article' } as const;
