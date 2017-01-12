const pbRegex = /<pb.+?>/g;

import {analyzePb4, analyzePb, analyzeVol} from './analyzeTag.js';
import {detectVol} from './detectTag.js';
import {saveErr, saveErrs, warn, reportErr} from './handleErr.js';

export default function checkVolPbOrder(textObjs) {
  let [repo1stPbBio, pbAnalyzer] = init(textObjs[0]);
  let [lastFn, lastVol1n, lastTextPbBio] = ['first-file', 0];
  let errMessages = [];

  checkRopo1stPb(repo1stPbBio);

  textObjs.forEach((textObj) => {
    let [fn, text, volExist, vol1n] = setVariables(textObj, pbAnalyzer);
    let pbBios = text.match(pbRegex).map(pbAnalyzer.bind(null, fn));
    let text1stPbBio = pbBios[0];

    saveErrs(errMessages, checkFileContinuity(volExist, fn, vol1n, lastFn, lastVol1n, text1stPbBio));

    [lastFn, lastVol1n] = [fn, vol1n];
  });

  reportErr('Wrong Volumn Pb Order!', errMessages);
};
// init
function init(textObj) {
  let {fn, text} = textObj;
  let prePbBio = analyzePb4(fn, text);
  let pbWithSuffix = detectPbType(prePbBio);
  let [pbAnalyzer] = setPbTool(pbWithSuffix);
  let pb1stBio = pbAnalyzer(fn, text);
  return [pb1stBio, pbAnalyzer];
}

function detectPbType(pbBio) {
  return pbBio.pbL ? true : false;
}

function setPbTool(pbWithSuffix) {
  if (pbWithSuffix) {
    return [analyzePb4];
  }
  return [analyzePb];
}

function checkPb4Order(lastBio, pbBio) {
  
}
// check1stPb
function checkRepo1stPb(pbBio) {
  let {fn, tag, pbVol1n, pbVol2n, pbNL} = pbBio;
  if (! vol1nIs1(pbVol1n) || ! vol2nIs1(pbVol2n) || ! pbIsFirst(pbNL)) {
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
function checkFileContinuity(volExist, fn, vol1n, lastFn, lastVol1n, text1stPbBio) {
  let errMessages = [];
  let args = [fn, vol1n, lastFn, lastVol1n];
  let {pbVol2n, pbNL, tag} = text1stPbBio;

  if (volExist) {
    saveErr(errMessages, checkContinuityByVolTag(fn, vol1n, lastFn, lastVol1n, args));
    if (! pbIsFirst(pbVol2n + '-' + pbNL)) {
      saveErr(errMessages, 'Pb is not start from 1-1a, 1-0a, 1-1, or 1-0 ' + fn + ' ' + tag);
    }
  }
  else {
    checkContinuityByPbTag();
  }

  return errMessages;
}

function checkContinuityByVolTag(fn, vol1n, lastFn, lastVol1n, vars) {
  let lessVol1n = vol1n < lastVol1n;
  let vol1nJump = vol1n > lastVol1n + 1;

  if (vol1nJump) {
    warn(...message, 'Volumn not continuous! Texts may be missing');
  }
  else if (lessVol1n) {
    return 'Error! Wrong vol order: ' + args.join(' ');
  }
}

function checkVol1stPb() {};

function checkContinuityByPbTag(lastPbBio, pbBio) {
/*
  let lessVol1n = vol1n < lastVol1n;
  let sameVol1n = vol1n === lastVol1n;
  let vol1nAdd1 = vol1n === lastVol1n + 1;
  let vol1nJump = vol1n > lastVol1n + 1;
  let message = [lastFn, 'volumn', lastVol1n, fn, 'volumn', vol1n];

  if (volExist && vol1nAdd1 || ! volExist && sameVol1n) {
    return;
  }
  else if (volExist && vol1nJump) {
    warn(...message, 'Volumn not continuous! Texts may be missing');
  }
  else if (! volExist && vol1nJump) {
    warn(...message, 'Volumn not continuous! Texts or vol tag may be missing');
  }
  else if (! volExist && vol1nAdd1) {
    warn(...message, 'A vol tag may be missing');
  }
  else {
    return 'Error! Wrong vol order: ' + message.join(' ');
  }
*/
}


