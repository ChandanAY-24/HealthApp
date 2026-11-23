import { describe, it, expect, beforeEach } from 'vitest';
import { parseCurrentRoute } from '../src/router';

describe('Router', () => {
  beforeEach(() => {
    (globalThis as any).window = {
      location: { hash: '' },
    };
  });

  it('parses home route by default when hash is empty', () => {
    window.location.hash = '';
    expect(parseCurrentRoute()).toBe('home');
  });

  it('parses valid route hash', () => {
    window.location.hash = '#/vitals';
    expect(parseCurrentRoute()).toBe('vitals');

    window.location.hash = '#/care';
    expect(parseCurrentRoute()).toBe('care');
  });
});
