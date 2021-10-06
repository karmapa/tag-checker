const vol = /<vol /;
const head = /<head /;
const bampo = /<bampo /;
const pb = /<pb /;
const pbWithSuffix = /<pb id="\d+?-(\d+?-)?\d+?[abcd]"\/>/;

export function detectPbType(str) {
  return pbWithSuffix.test(str);
};

export function volExist(str) {
  return vol.test(str);
};

export function headExist(str) {
  return head.test(str);
};

export function bampoExist(str) {
  return bampo.test(str);
}

export function pbExist(str, regex = pb) {
  return regex.test(str);
};