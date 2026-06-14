export const VIEW_W = 1000;
export const VIEW_H = 500;
const PAD_X = 30;

export function project(lon, lat) {
  const x = PAD_X + ((lon + 180) / 360) * (VIEW_W - 2 * PAD_X);
  const y = ((90 - lat) / 180) * VIEW_H;
  return [x, y];
}
