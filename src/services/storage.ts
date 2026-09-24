const PREFIX = 'pra.';

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(`${PREFIX}${key}`);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private browsing or embedded previews.
  }
}
