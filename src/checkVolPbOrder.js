const pbRegex = /<pb.+?>/g;

import {analyzePb4, analyzePb, analyzeVol} from './analyzeTag.js';
import {volExist} from './detectTag.js';
import {warn, reportErr} from './handleErr.js';
import {lessNumber, sameNumber, numberAdd1, numberJump} from './compareNumber.js';

export default function checkVolPbOrder(textObjs, pbWithSuffix) {
  let [repo1stPbBio, firstText, pbAnalyzer, pbOrderChecker] = init(textObjs[0], pbWithSuffix);
  let [lastFn, lastVol1n, lastVol2n, lastTextPbBio] = ['first-file', 0, 0];
  let errMessages = [];

  checkRepo1stVol(firstText);
  checkRepo1stPb(repo1stPbBio);

  textObjs.forEach((textObj) => {
    let [fn, text, volInText, vol1n, vol2n] = setVariables(textObj, pbAnalyzer);
    let pbBios = text.match(pbRegex).map(pbAnalyzer.bind(null, fn));
    let [text1stPbBio, ...restPbBios] = pbBios;

    if (volInText) {
      checkFileContinuityByVol(errMessages, lastFn, lastVol1n, fn, vol1n, text1stPbBio);
    }
    else if (lastTextPbBio) {
      checkFileContinuityByPb(errMessages, lastTextPbBio, text1stPbBio, pbOrderChecker);
    }

    restPbBios.forEach((pbBio, index) => {
      checkPbVol1n(errMessages, vol1n, pbBio);
      checkPbVol2nAndOrderInFile(errMessages, pbBios[index], pbBio, pbOrderChecker);
    });

    lastTextPbBio = pbBios[pbBios.length - 1];
    [lastFn, lastVol1n] = [fn, vol1n];
    lastVol2n = lastTextPbBio.pbVol2n;
  });

  reportErr('Wrong Volumn Pb Order!', errMessages);
};

function init(textObj, pbWithSuffix) {
  let {fn, text} = textObj;
  let [pbAnalyzer, pbOrderChecker] = setPbTool(pbWithSuffix);
  let pb1stBio = pbAnalyzer(fn, text);
  return [pb1stBio, text, pbAnalyzer, pbOrderChecker];
}

function setPbTool(pbWithSuffix) {
  return pbWithSuffix ? [analyzePb4, checkPb4Order] : [analyzePb, checkPbOrder];
}

function checkPb4Order(store, lastBio, pbBio, looseMode) {
  let {pbN: lastPbN, pbL: lastPbL, tag: lastTag, fn: lastFn} = lastBio;
  let {pbN, pbL, tag, fn} = pbBio;

  if (sameNumber(lastPbN, pbN) && correctPbL(lastPbL + pbL) || numberAdd1(lastPbN, pbN) && 'a' === pbL) {
      return;
  }
  else if (looseMode && numberJump(lastPbN, pbN) && 'a' === pbL) {
    warn('Pb may be missing!', lastFn, lastTag, fn, tag);
  }
  else {
    store.push('Wrong pb order! ' + lastFn + ' ' + lastTag + ' ' + fn + ' ' + tag);
  }
}

function correctPbL(str) {
  if ('ab' === str || 'bc' === str || 'cd' === str) {
    return true;
  }
}

function checkPbOrder(store, lastBio, pbBio, looseMode) {
  let {pbN: lastPbN, tag: lastTag, fn: lastFn} = lastBio;
  let {pbN, tag, fn} = pbBio;

  if (sameNumber(lastPbN, pbN) || numberAdd1(lastPbN, pbN)) {
    return;
  }
  else if (looseMode && numberJump(lastPbN, pbN)) {
    warn('Pb may be missing!', lastFn, lastTag, fn, tag);
  }
  else {
    store.push('Wrong pb order! ' + lastFn + ' ' + lastTag + ' ' + fn + ' ' + tag);
  }
}

function checkRepo1stVol(text) {
  let volN = analyzeVol('first file', text).volN;
  if (! volExist(text) || volN !== '1' && volN !== '1-1') {
    warn('No vol tag or volN not 1 or 1-1 in first file!');
  }
}

function checkRepo1stPb(pbBio) {
  let {fn, tag, pbVol1n, pbVol2n, pbNL, pbN} = pbBio;
  if (! sameNumber(pbVol1n, 1) || ! sameNumber(pbVol2n, 1) || ! pbIsFirst(pbNL || pbN)) {
    warn('Pb is not start from 1-1-1a, 1-1-0a, 1-1-1, or 1-1-0', fn, tag);
  }
}

function pbIsFirst(pbId) {
  return '1a' === pbId || '0a' === pbId || 1 === pbId || 0 === pbId;
}

function setVariables(textObj, pbAnalyzer) {
  let {fn, text} = textObj;
  let volInText = volExist(text);
  if (volInText) {
    var {vol1n, vol2n} = analyzeVol(fn, text);
  }
  else {
    var {pbVol1n: vol1n, pbVol2n: vol2n} = pbAnalyzer(fn, text);
  }
  return [fn, text, volInText, vol1n, vol2n];
}

function checkFileContinuityByVol(store, lastFn, lastVol1n, fn, vol1n, text1stPbBio) {
  let message = 'Volumn not continuous! ' + lastFn + ' ' + lastVol1n + ' ' + fn + ' ' + vol1n;

  if (numberJump(lastVol1n, vol1n)) {
    warn(message);
  }
  else if (! numberAdd1(lastVol1n, vol1n)) {
    store.push(message);
  }
  checkVol1stPb(store, vol1n, text1stPbBio);
}

function checkVol1stPb(store, vol1n, pbBio) {
  let {fn, pbVol1n, pbVol2n, pbNL, pbN} = pbBio;
  if (! sameNumber(vol1n, pbVol1n) || ! sameNumber(pbVol2n, 1) || ! pbIsFirst(pbNL || pbN)) {
    store.push('Vol tag is not follow by first pbId ' + fn);
  } 
}

function checkFileContinuityByPb(store, lastPbBio, pbBio, pbOrderChecker) {
  let {fn: lastFn, tag: lastTag, pbVol1n: lastPbVol1n, pbVol2n: lastPbVol2n} = lastPbBio;
  let {fn, tag, pbVol1n, pbVol2n, pbNL, pbN} = pbBio;
  let message = 'Wrong pb order! ' + lastFn + ' ' + lastTag + ' ' + fn + ' ' + tag;

  if (lessNumber(lastPbVol1n, pbVol1n)) {
    store.push(message);
  }
  else if (sameNumber(lastPbVol1n, pbVol1n)) {
    if (lessNumber(lastPbVol2n, pbVol2n)) {
      store.push(message);
    }
    else if (sameNumber(lastPbVol2n, pbVol2n)) {
      pbOrderChecker(store, lastPbBio, pbBio, true);
    }
    else if (! (numberAdd1(lastPbVol2n, pbVol2n) && pbIsFirst(pbNL || pbN))) {
      warn(message);
    }
  }
  else if (! (numberAdd1(lastPbVol1n, pbVol1n) && sameNumber(1, pbVol2n) && pbIsFirst(pbNL || pbN))) {
    warn(message, 'Vol tag may be missing');
  }
}

function checkPbVol1n(store, vol1n, pbBio) {
  if (! sameNumber(vol1n, pbBio.pbVol1n)) {
    store.push('Wrong pb id! Volumn ' + vol1n + ' ' + pbBio.tag);
  }
}

function checkPbVol2nAndOrderInFile(store, lastPbBio, pbBio, pbOrderChecker) {
  let {fn: lastFn, tag: lastTag, pbVol2n: lastPbVol2n} = lastPbBio;
  let {fn, tag, pbVol2n, pbNL, pbN} = pbBio;
  let message = 'Wrong pb order! ' + lastFn + ' ' + lastTag + ' ' + fn + ' ' + tag;

  if (sameNumber(lastPbVol2n, pbVol2n)) {
    pbOrderChecker(store, lastPbBio, pbBio);
  }
  else if (numberAdd1(lastPbVol2n, pbVol2n) && pbIsFirst(pbNL || pbN)) {
    return;
  }
  else {
    store.push(message);
  }
}