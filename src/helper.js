import {pbExist} from './detectTag.js';
import {reportErr} from './handleErr.js';

export function confirmPbInFile(fn, text, pbRegex) {
  if (! pbExist(text, pbRegex)) {
    reportErr('No Pb Tag', [fn]);
  }
};

export function countTag(str, regex) {
  let matches = str.match(regex);
  return matches ? matches.length : 0;
};