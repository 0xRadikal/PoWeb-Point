// Collision-resistant unique id generator shared across the app.
//
// Prefers crypto.randomUUID (secure contexts / modern browsers). Falls back to
// a timestamp + high-entropy random suffix so that ids created within the same
// millisecond do not collide — which a bare `${Date.now()}` would.
export const generateId = (prefix: string): string => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `${prefix}-${crypto.randomUUID()}`;
    }
  } catch {
    // fall through to the timestamp-based fallback below
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};
