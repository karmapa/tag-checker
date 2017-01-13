import {pbExist} from './detectTag.js';
import {reportErr} from './handleErr.js';

export function confirmPbInFile(fn, text, pbRegex) {
  if (! pbExist(text, pbRegex)) {
    reportErr('No Pb Tag', [fn]);
  }
};

export function numberJump(num1, num2) {
  return num2 - num1 > 1;
};

export function numberAdd1(num1, num2) {
  return num2 - 1 === num1;
};

export function sameNumber(num1, num2) {
  return num2 === num1;
};

export function lessNumber(num1, num2) {
  return num2 < num1;
};

