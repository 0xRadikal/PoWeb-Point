import { describe, it, expect } from 'vitest';
import { generateId } from './id';

describe('generateId', () => {
  it('prefixes the id with the given prefix', () => {
    expect(generateId('s')).toMatch(/^s-/);
    expect(generateId('sec')).toMatch(/^sec-/);
  });

  it('produces unique ids across a tight loop (regression: Date.now collision)', () => {
    // Before the fix, `s-${Date.now()}` collided when many ids were created
    // within the same millisecond (e.g. duplicating slides rapidly).
    const ids = new Set<string>();
    for (let i = 0; i < 5000; i++) {
      ids.add(generateId('s'));
    }
    expect(ids.size).toBe(5000);
  });

  it('falls back to a unique id when crypto.randomUUID is unavailable', () => {
    const original = globalThis.crypto;
    try {
      // Simulate a non-secure context where randomUUID is missing.
      Object.defineProperty(globalThis, 'crypto', {
        value: undefined,
        configurable: true,
      });
      const a = generateId('s');
      const b = generateId('s');
      expect(a).toMatch(/^s-/);
      expect(a).not.toBe(b);
    } finally {
      Object.defineProperty(globalThis, 'crypto', {
        value: original,
        configurable: true,
      });
    }
  });
});
