import {pbExist} from './detectTag.js';
import {reportErr} from './handleErr.js';

export function confirmPbInFile(fn, text, pbRegex) {
  if (! pbExist(text, pbRegex)) {
    reportErr('No Pb Tag', [fn]);
  }
};