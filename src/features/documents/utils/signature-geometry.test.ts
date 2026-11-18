import { describe, expect, it } from 'vitest';
import {
  moveStamp,
  stampAtPoint,
  stampHeightFrac,
} from './signature-geometry';

// A4-like portrait page and a wide signature image (260x90).
const PAGE_ASPECT = 0.75;
const IMAGE_ASPECT = 260 / 90;

describe('stampHeightFrac', () => {
  it('converts image aspect into a fraction of page height', () => {
    // width 0.26 of a 0.75-aspect page -> height = 0.26 * 0.75 / 2.888 ≈ 0.0675
    const height = stampHeightFrac(0.26, IMAGE_ASPECT, PAGE_ASPECT);
    expect(height).toBeCloseTo(0.0675, 3);
  });

  it('returns 0 for invalid input', () => {
    expect(stampHeightFrac(0.26, 0, PAGE_ASPECT)).toBe(0);
    expect(stampHeightFrac(0.26, IMAGE_ASPECT, 0)).toBe(0);
    expect(stampHeightFrac(0.26, NaN, PAGE_ASPECT)).toBe(0);
  });
});

describe('stampAtPoint', () => {
  it('centres the stamp on the clicked point', () => {
    const stamp = stampAtPoint(0.5, 0.5, 0.26, IMAGE_ASPECT, PAGE_ASPECT);
    expect(stamp.x).toBeCloseTo(0.5 - 0.13, 5);
    expect(stamp.y).toBeCloseTo(0.5 - stamp.height / 2, 5);
    expect(stamp.width).toBeCloseTo(0.26, 5);
  });

  it('clamps the stamp inside the page at the corners', () => {
    const topLeft = stampAtPoint(0, 0, 0.26, IMAGE_ASPECT, PAGE_ASPECT);
    expect(topLeft.x).toBe(0);
    expect(topLeft.y).toBe(0);

    const bottomRight = stampAtPoint(1, 1, 0.26, IMAGE_ASPECT, PAGE_ASPECT);
    expect(bottomRight.x).toBeCloseTo(1 - 0.26, 5);
    expect(bottomRight.y).toBeCloseTo(1 - bottomRight.height, 5);
  });
});

describe('moveStamp', () => {
  const placed = stampAtPoint(0.5, 0.5, 0.26, IMAGE_ASPECT, PAGE_ASPECT);

  it('moves to the requested top-left', () => {
    const moved = moveStamp(placed, 0.1, 0.2);
    expect(moved.x).toBeCloseTo(0.1, 5);
    expect(moved.y).toBeCloseTo(0.2, 5);
    expect(moved.width).toBe(placed.width);
    expect(moved.height).toBe(placed.height);
  });

  it('keeps the stamp inside the page', () => {
    const moved = moveStamp(placed, -1, 2);
    expect(moved.x).toBe(0);
    expect(moved.y).toBeCloseTo(1 - placed.height, 5);
  });
});
