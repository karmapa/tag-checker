const pbRegex = /<pb.+?>/g;

import {analyzePb4, analyzePb, analyzeVol} from './analyzeTag.js';
import {volExist} from './detectTag.js';
import {warn, reportErr} from './handleErr.js';
import {lessNumber, sameNumber, numberAdd1, numberJump} from './compareNumber.js';

export default function checkPbOrder(textObjs, pbWithSuffix) {
  let [repo1stPbBio, pbAnalyzer, pbOrderChecker] = init(textObjs[0], pbWithSuffix);
  let lastVolBio, textsVol1n, lastTextPbBio, errMessages = [];

  checkRepo1stPb(repo1stPbBio);

  textObjs.forEach((textObj) => {
    let [fn, text, volInText, volBio, textVol1n] = setVariables(textObj, textsVol1n, pbAnalyzer);
    let pbBios = text.match(pbRegex).map(pbAnalyzer.bind(null, fn));
    let [text1stPbBio, ...restPbBios] = pbBios;

    if (volInText) {
      textsVol1n = textVol1n;
      if (lastVolBio) {
        checkPbAfterVol(errMessages, lastVolBio, volBio, text1stPbBio);
      }
      lastVolBio = volBio;
    }

    if (lastTextPbBio) {
      checkPbAcross2file(errMessages, lastTextPbBio, text1stPbBio, pbOrderChecker);
    }
/*
    restPbBios.forEach((pbBio, index) => {
      checkPbVol1n(errMessages, vol1n, pbBio);
      checkPbVol2nAndOrderInFile(errMessages, pbBios[index], pbBio, pbOrderChecker);
    });
*/
    lastTextPbBio = pbBios[pbBios.length - 1];
  });

  reportErr('Wrong Pb Order!', errMessages);
};

function init(textObj, pbWithSuffix) {
  let {fn, text} = textObj;
  let [pbAnalyzer, pbOrderChecker] = setPbTool(pbWithSuffix);
  let pb1stBio = pbAnalyzer(fn, text);
  return [pb1stBio, pbAnalyzer, pbOrderChecker];
}

function setPbTool(pbWithSuffix) {
  return pbWithSuffix ? [analyzePb4, check2Pb4Order] : [analyzePb, check2PbOrder];
}

function check2Pb4Order(store, lastBio, pbBio, looseMode) {
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

function check2PbOrder(store, lastBio, pbBio, looseMode) {
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

function checkRepo1stPb(pbBio) {
  let {fn, tag, pbVol1n, pbVol2n, pbNL, pbN} = pbBio;
  if (1 !== pbVol1n || 1 !== pbVol2n || ! pbIs1st(pbNL || pbN)) {
    warn('Pb is not start from 1-1-1a, 1-1-0a, 1-1-1, or 1-1-0', fn, tag);
  }
}

function pbIs1st(pbId) {
  return '1a' === pbId || '0a' === pbId || 1 === pbId || 0 === pbId;
}

function setVariables(textObj, textsVol1n, pbAnalyzer) {
  let {fn, text} = textObj;
  let volInText = volExist(text);
  if (volInText) {
    var volBio = analyzeVol(fn, text);
    var textVol1n = volBio.vol1n;
  }
  else if (textsVol1n) {
    textVol1n = textsVol1n;
  }
  else {
    var {pbVol1n: textVol1n} = pbAnalyzer(fn, text);
  }
  return [fn, text, volInText, volBio, textVol1n];
}

function checkPbAfterVol(store, lastVolBio, volBio, text1stPbBio) {
  let {vol1n: lastVol1n, vol2n: lastVol2n} = lastVolBio;
  let {vol1n, vol2n} = volBio;
  let {fn, tag, pbVol2n, pbNL, pbN} = text1stPbBio;
  if (lastVol1n !== vol1n) {
    if (1 !== pbVol2n || ! pbIs1st(pbNL || pbN)) {
      store.push('Pb not start x-1-1a or x-1-1! ' + fn + ' ' + tag);
    }
  }
  else if (! pbIs1st(pbNL || pbN)) {
    warn('Pb not start from 1a or 1!', fn, tag);
  }
}

function checkPbAcross2file(store, lastPbBio, pbBio, pbOrderChecker) {
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
    else if (! (numberAdd1(lastPbVol2n, pbVol2n) && pbIs1st(pbNL || pbN))) {
      warn(message);
    }
  }
  else if (! (numberAdd1(lastPbVol1n, pbVol1n) && sameNumber(1, pbVol2n) && pbIs1st(pbNL || pbN))) {
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
  else if (numberAdd1(lastPbVol2n, pbVol2n) && pbIs1st(pbNL || pbN)) {
    return;
  }
  else {
    store.push(message);
  }
}