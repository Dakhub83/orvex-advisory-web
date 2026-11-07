const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

/**
 * Basic abuse brake. State lives in this server process, so on a platform that
 * runs many instances the limit applies per instance rather than globally.
 */
export function isRateLimited(key: string, now = Date.now()): boolean {
  for (const [entryKey, times] of hits) {
    const recent = times.filter((time) => now - time < WINDOW_MS);
    if (recent.length === 0) hits.delete(entryKey);
    else hits.set(entryKey, recent);
  }

  const recent = hits.get(key) ?? [];
  if (recent.length >= MAX_PER_WINDOW) return true;
  hits.set(key, [...recent, now]);
  return false;
}
