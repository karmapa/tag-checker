import {volExist} from './detectTag.js';
import {analyzeVol} from './analyzeTag.js';
import {numberJump, numberAdd1, sameNumber} from './compareNumber.js';
import {warn, reportErr} from './handleErr.js';

export default function checkVolOrder(textObjs) {
  let lastVolBio, errMessages = [];

  check1stTextVol(textObjs[0].text);

  textObjs.forEach((textObj) => {
    let {fn, text} = textObj;

    if (volExist(text)) {
      let volBio = analyzeVol(fn, text);

      if (lastVolBio) {
        check2VolOrder(errMessages, lastVolBio, volBio);
      }
      lastVolBio = volBio;
    }
  });

  reportErr('Error! Wrong Tag Order!', errMessages);
};

function check1stTextVol(text) {
  let volN = analyzeVol('first file', text).volN;
  if (! volExist(text) || volN !== '1' && volN !== '1-1') {
    warn('No vol tag or volN not 1 or 1-1 in first file!');
  }
}

function check2VolOrder(store, lastBio, bio) {
  let {fn: lastFn, volN: lastVolN, vol1n: lastVol1n, vol2n: lastVol2n} = lastBio;
  let {fn, volN, vol1n, vol2n} = bio;
  let message = lastFn + ' ' + lastVolN + ' ' + fn + ' ' + volN;

  if (numberJump(lastVol1n, vol1n)) {
    warn('Vol might be missing!', message);
    checkVol2nIs1st(vol2n, message);
  }
  else if (numberAdd1(lastVol1n, vol1n)) {
    checkVol2nIs1st(vol2n, message);
  }
  else if (sameNumber(lastVol1n, vol1n)) {
    checkVol2nOrder(store, lastVol2n, vol2n, message);
  }
  else {
    store.push('Wrong vol order! ' + message);
  }
}

function checkVol2nIs1st(vol2n, message) {
  if (vol2n && 1 !== vol2n) {
    warn('Vol might be missing!', message);
  }
}

function checkVol2nOrder(store, lastVol2n, vol2n, message) {
  if (! lastVol2n || ! vol2n) {
    store.push('Wrong vol number! ' + message);
    return;
  }

  if (numberJump(lastVol2n, vol2n)) {
    warn('Vol might be missing!', message);
  }
  else if (! numberAdd1(lastVol2n, vol2n)) {
    store.push('Wrong vol order! ' + message);
  }
}