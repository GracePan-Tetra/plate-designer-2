/** Converts a hex color to rgba with the given opacity. */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Linearly interpolates between two hex colors. t ∈ [0, 1]. */
export function interpolateColor(hex1: string, hex2: string, t: number): string {
  const clamp = Math.max(0, Math.min(1, t));
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  const r = Math.round(r1 + (r2 - r1) * clamp);
  const g = Math.round(g1 + (g2 - g1) * clamp);
  const b = Math.round(b1 + (b2 - b1) * clamp);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** Gradient endpoints for numerical columns — light lavender → dark indigo */
export const GRADIENT_LOW = '#EDE9FE';
export const GRADIENT_HIGH = '#1E1B4B';

/**
 * Maps a numerical value to a gradient color based on its position in [min, max].
 * A value of 0 returns white (Control).
 */
export function getGradientColor(value: number, min: number, max: number): string {
  if (value === 0) return '#FFFFFF';
  if (max === min) return GRADIENT_HIGH;
  const t = (value - min) / (max - min);
  return interpolateColor(GRADIENT_LOW, GRADIENT_HIGH, t);
}
