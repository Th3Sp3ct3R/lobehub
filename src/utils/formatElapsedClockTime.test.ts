import { describe, expect, it } from 'vitest';

import { formatElapsedClockTime } from './formatElapsedClockTime';

describe('formatElapsedClockTime', () => {
  it('formats elapsed milliseconds as mm:ss below one hour', () => {
    expect(formatElapsedClockTime(0)).toBe('00:00');
    expect(formatElapsedClockTime(33_000)).toBe('00:33');
    expect(formatElapsedClockTime(65_000)).toBe('01:05');
  });

  it('formats elapsed milliseconds as h:mm:ss at one hour or above', () => {
    expect(formatElapsedClockTime(3_661_000)).toBe('1:01:01');
  });

  it('clamps negative elapsed time to zero', () => {
    expect(formatElapsedClockTime(-1_000)).toBe('00:00');
  });
});
