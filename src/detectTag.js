const vol = /vol/;
const pbWithSuffix = /<pb id="\d+?-\d+?-\d+?[abcd]"\/>/;

export function detectPbType(str) {
  return pbWithSuffix.test(str);
};

export function pbExist(str, regex) {
  return regex.test(str);
};

export function detectVol(str) {
  return vol.test(str);
};