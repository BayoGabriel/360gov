/**
 * Canvas helpers for signature capture: trimming transparent margins and
 * exporting a bounded-size PNG so stamps stay crisp without huge payloads.
 */

const ALPHA_THRESHOLD = 8;
const TRIM_PADDING_PX = 8;
const MAX_EXPORT_WIDTH = 600;

/**
 * Crops a canvas to the bounding box of its non-transparent pixels plus
 * padding. Returns null when the canvas is effectively empty.
 */
export function trimCanvas(
  source: HTMLCanvasElement,
  padding = TRIM_PADDING_PX,
): HTMLCanvasElement | null {
  const context = source.getContext('2d');
  if (!context) return null;
  const { width, height } = source;
  const { data } = context.getImageData(0, 0, width, height);

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] > ALPHA_THRESHOLD) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;

  const left = Math.max(0, minX - padding);
  const top = Math.max(0, minY - padding);
  const cropWidth = Math.min(width, maxX + padding + 1) - left;
  const cropHeight = Math.min(height, maxY + padding + 1) - top;

  const trimmed = document.createElement('canvas');
  trimmed.width = cropWidth;
  trimmed.height = cropHeight;
  trimmed
    .getContext('2d')
    ?.drawImage(
      source,
      left,
      top,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight,
    );
  return trimmed;
}

/**
 * PNG data URL of the canvas, downscaled to a sane stamp size. Transparent
 * background is preserved so the stamp blends onto the page.
 */
export function canvasToPngDataUrl(
  canvas: HTMLCanvasElement,
  maxWidth = MAX_EXPORT_WIDTH,
): string {
  if (canvas.width <= maxWidth) return canvas.toDataURL('image/png');
  const scale = maxWidth / canvas.width;
  const scaled = document.createElement('canvas');
  scaled.width = maxWidth;
  scaled.height = Math.max(1, Math.round(canvas.height * scale));
  const context = scaled.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(canvas, 0, 0, scaled.width, scaled.height);
  }
  return scaled.toDataURL('image/png');
}
