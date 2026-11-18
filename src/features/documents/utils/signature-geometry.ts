/**
 * Normalized signature-stamp geometry. Positions are stored as fractions
 * of the page (0-1) so a stamp lands identically at any zoom level and on
 * any page size the backend eventually renders.
 */

export interface StampGeometry {
  /** Left edge, as a fraction of page width. */
  x: number;
  /** Top edge, as a fraction of page height. */
  y: number;
  /** Width, as a fraction of page width. */
  width: number;
  /** Height, as a fraction of page height. */
  height: number;
}

/** Stamp width used when the user first drops a signature on the page. */
export const DEFAULT_STAMP_WIDTH = 0.26;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Stamp height as a fraction of page height. `imageAspect` is the
 * signature image's width/height; `pageAspect` is the page's width/height.
 */
export function stampHeightFrac(
  widthFrac: number,
  imageAspect: number,
  pageAspect: number,
): number {
  if (
    !Number.isFinite(imageAspect) ||
    imageAspect <= 0 ||
    !Number.isFinite(pageAspect) ||
    pageAspect <= 0
  ) {
    return 0;
  }
  return (widthFrac * pageAspect) / imageAspect;
}

/** Drop a stamp centred on a page point, clamped inside the page. */
export function stampAtPoint(
  fracX: number,
  fracY: number,
  widthFrac: number,
  imageAspect: number,
  pageAspect: number,
): StampGeometry {
  const width = clamp(widthFrac, 0.05, 1);
  const height = stampHeightFrac(width, imageAspect, pageAspect);
  return {
    width,
    height,
    x: clamp(fracX - width / 2, 0, Math.max(0, 1 - width)),
    y: clamp(fracY - height / 2, 0, Math.max(0, 1 - height)),
  };
}

/** Move a stamp so its top-left sits at a page point, clamped inside. */
export function moveStamp(
  geometry: StampGeometry,
  fracLeft: number,
  fracTop: number,
): StampGeometry {
  return {
    ...geometry,
    x: clamp(fracLeft, 0, Math.max(0, 1 - geometry.width)),
    y: clamp(fracTop, 0, Math.max(0, 1 - geometry.height)),
  };
}
