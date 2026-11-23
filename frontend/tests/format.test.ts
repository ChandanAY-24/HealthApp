import { describe, it, expect } from 'vitest';
import { formatNumber, calculateBmi, formatDate } from '../src/ui/format';

describe('Format Utilities', () => {
  it('formats numbers with specified decimal places', () => {
    expect(formatNumber(1250, 0)).toBe('1,250');
    expect(formatNumber(98.642, 1)).toBe('98.6');
  });

  it('calculates BMI correctly and categorizes it', () => {
    const res = calculateBmi(72, 178);
    expect(res.bmi).toBe(22.7);
    expect(res.category).toBe('Normal');

    const obese = calculateBmi(110, 175);
    expect(obese.category).toBe('Obese');
  });

  it('formats dates consistently', () => {
    const formatted = formatDate('2026-11-23');
    expect(formatted).toContain('2026');
  });
});
