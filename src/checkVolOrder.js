import {volExist} from "./detectTag.js";
import {analyzeVol} from "./analyzeTag.js";
import {warn, reportErr} from "./handleErr.js";

export default function checkVolOrder(textObjs) {
  let [firstText] = init(textObjs[0]);
  let errMessages = [];

  check1stTextVol(firstText);

  reportErr('Error! Wrong Tag Order!', errMessages);
};

function init(textObj) {
  let {fn, text} = textObj;
  return [text];
}

function check1stTextVol(text) {
  let volN = analyzeVol('first file', text).volN;
  if (! volExist(text) || volN !== '1' && volN !== '1-1') {
    warn('No vol tag or volN not 1 or 1-1 in first file!');
  }
}