const vol = /<vol/;
const pb = /<pb/;
const pbWithSuffix = /<pb id="\d+?-\d+?-\d+?[abcd]"\/>/;

export function detectPbType(str) {
  return pbWithSuffix.test(str);
};

export function pbExist(str, regex = pb) {
  return regex.test(str);
};

export function volExist(str) {
  return vol.test(str);
};