const pbRegex = /<pb.+?>/g;

import {analyzePb4, analyzePb, analyzeVol} from './analyzeTag.js';
import {detectVol} from './detectTag.js';
import {saveErr, saveErrs, warn, reportErr} from './handleErr.js';

export default function checkVolPbOrder(textObjs) {
  let [repo1stPbBio, pbAnalyzer, pbOrderChecker] = init(textObjs[0], pbWithSuffix);
  let [lastFn, lastVol1n, lastTextPbBio] = ['first-file', 0];
  let errMessages = [];

  checkRepo1stPb(repo1stPbBio);

  textObjs.forEach((textObj, pbWithSuffix) => {
    let [fn, text, volExist, vol1n] = setVariables(textObj, pbAnalyzer);
    let pbBios = text.match(pbRegex).map(pbAnalyzer.bind(null, fn));
    let [text1stPbBio, ...restPbBios] = pbBios;

    saveErrs(errMessages, checkFileContinuity(volExist, fn, vol1n, text1stPbBio, lastFn, lastVol1n, lastTextPbBio, pbOrderChecker));

    restPbBios.forEach((pbBio, index) => {
      saveErr(errMessages, checkPbVol1n(vol1n, pbBio));
      saveErr(errMessages, checkPbVol2nAndOrder(pbBios[index], pbBio, pbOrderChecker));
    });

    [lastFn, lastVol1n, lastTextPbBio] = [fn, vol1n, pbBios[pbBios.length - 1]];
  });

  reportErr('Wrong Volumn Pb Order!', errMessages);
};
// init
function init(textObj, pbWithSuffix) {
  let {fn, text} = textObj;
  let [pbAnalyzer, pbOrderChecker] = setPbTool(pbWithSuffix);
  let pb1stBio = pbAnalyzer(fn, text);
  return [pb1stBio, pbAnalyzer, pbOrderChecker];
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

// check1stPb
function checkRepo1stPb(pbBio) {
  let {fn, tag, pbVol1n, pbVol2n, pbNL, pbN} = pbBio;
  if (! vol1nIs1(pbVol1n) || ! vol2nIs1(pbVol2n) || ! pbIsFirst(pbNL || String(pbN))) {
    warn('Pb is not start from 1-1-1a, 1-1-0a, 1-1-1, or 1-1-0', fn, tag);
  }
}

function vol1nIs1(vol1n) {
  return 1 === vol1n;
}

function vol2nIs1(vol2n) {
  return 1 === vol2n;
}

function pbIsFirst(pbId) {
  return '1a' === pbId || '0a' === pbId || '1' === pbId || '0' === pbId;
}
// setVariables
function setVariables(textObj, pbAnalyzer) {
  let {fn, text} = textObj;
  let volExist = detectVol(text);
  let vol1n = volExist ? analyzeVol(fn, text).vol1n : pbAnalyzer(fn, text).pbVol1n;
  return [fn, text, volExist, vol1n];
}
// checkFileContinuity
function checkFileContinuity(volExist, fn, vol1n, text1stPbBio, lastFn, lastVol1n, lastTextPbBio, pbOrderChecher) {
  let errMessages = [];
  let messages = ['Volumn not continuous!', lastFn, lastVol1n, fn, vol1n];

  if (volExist) {
    if (numberJump(lastVol1n, vol1n)) {
      warn(messages);
    }
    else if (lessNumber(lastVol1n, vol1n)) {
      saveErr(errMessages, messages.join(' '));
    }
    saveErr(errMessages, checkVol1stPb(vol1n, text1stPbBio));
  }
  else {
    saveErr(checkContinuityByPbTag(lastTextPbBio, text1stPbBio, pbOrderChecher));
  }

  return errMessages;
}

function checkVol1stPb(vol1n, pbBio) {
  let {fn, pbVol1n, pbVol2n, pbNL} = pbBio;
  if (pbVol1n !== vol1n || ! vol2nIs1(pbVol2n) || ! pbIsFirst(pbNL)) {
    return 'Vol tag is not follow by first pbId ' + fn;
  } 
}

function checkContinuityByPbTag(lastPbBio, pbBio, pbOrderChecker) {
  let {fn: lastFn, tag: lastTag, pbVol1n: lastPbVol1n, pbVol2n: lastPbVol2n} = lastPbBio;
  let {fn, tag, pbVol1n, pbVol2n, pbNL, pbN} = pbBio;
  let messages = ['Wrong pb order!', lastFn, lastTag, fn, tag];

  if (sameNumber(lastPbVol1n ,pbVol1n)) {
    if (sameNumber(lastPbVol2n, pbVol2n)) {
      return pbOrderChecker(lastPbBio, pbBio, true);
    }
    else if (numberAdd1(lastPbVol2n, pbVol2n) && pbIsFirst(pbNL || String(pbN))) {
      return;
    }
  }
  else if (numberAdd1(lastPbVol1n, pbVol1n)) {
    if (vol2nIs1(pbVol2n) && pbIsFirst(pbNL || String(pbN))) {
      return;
    }
  }
  else {
    return messages.join(' ');
  }
}

function checkPbVol1n(vol1n, pbBio) {
  if (! sameNumber(vol1n, pbBio.pbVol1n)) {
    return 'Wrong pb id! Volumn ' + vol1n + ' ' + pbBio.tag;
  }
}

function checkPbVol2nAndOrder(lastPbBio, pbBio, pbOrderChecker) {
  let {fn: lastFn, tag: lastTag, pbVol2n: lastPbVol2n} = lastPbBio;
  let {fn, tag, pbVol2n, pbNL, pbN} = pbBio;
  let messages = ['Wrong pb order!', lastFn, lastTag, fn, tag];

  if (sameNumber(lastPbVol2n, pbVol2n)) {
    return pbOrderChecker(lastPbBio, pbBio);
  }
  if (numberAdd1(lastPbVol2n, pbVol2n) && pbIsFirst(pbNL || String(pbN))) {
    return;
  }
  else {
    return messages.join(' ');
  }
}