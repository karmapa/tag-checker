const vol = /vol/;

export function detectVol(str) {
  return vol.test(str);
}