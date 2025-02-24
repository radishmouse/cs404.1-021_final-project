export function mapDepthToColor(depth: number) {
  const base = 10;
  const rate = 1.8;
  const red = Math.min(255, Math.floor(base * Math.pow(rate, depth)));
  const green = Math.min(255, Math.floor(base * 0.1 * Math.pow(rate, depth)));
  const blue = Math.min(255, Math.floor(base * Math.pow(rate, depth)));
  return [red, green, blue];
}
