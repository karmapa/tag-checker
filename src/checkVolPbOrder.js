const pbRegex = /<pb.+?>/g;

import {analyzePb4, analyzePb, analyzeVol} from './analyzeTag.js';
import {detectVol} from './detectTag.js';
import {saveErr} from './helper.js';
import reportErr from './reportErr.js';

export default function checkVolPbOrder(textObjs) {
  let [pb1stBio, pbAnalyzer] = init(textObjs[0]);
  let [lastFn, lastVol1n, lastTextPbBio] = ['first-file', 0];
  let errMessages = [];

  check1stPb(pb1stBio);

  textObjs.forEach((textObj) => {
    let [fn, text, hasVol, vol1n] = setVariables(textObj, pbAnalyzer);

    let wrongVol1nIn2Files = checkVol1nIn2Files(fn, vol1n, lastFn, lastVol1n, hasVol);
    saveErr(errMessages, [wrongVol1nIn2Files]);

    let pbBios = text.match(pbRegex).map(pbAnalyzer.bind(null, fn));
    check1stPb(lastTextPbBio, pbBios[0]);

    [lastFn, lastVol1n] = [fn, vol1n];
  });

  reportErr('Wrong Volumn Pb Order!', errMessages);
};

function init(textObj) {
  let {fn, text} = textObj;
  let prePbBio = analyzePb4(fn, text);
  let pbHasSuffix = detectPbType(prePbBio);
  let [pbAnalyzer] = setPbTool(pbHasSuffix);
  let pb1stBio = pbAnalyzer(fn, text);
  return [pb1stBio, pbAnalyzer];
}

function detectPbType(pbBio) {
  return pbBio.pbL ? true : false;
}

function setPbTool(pbHasSuffix) {
  if (pbHasSuffix) {
    return [analyzePb4];
  }
  return [analyzePb];
}

function check1stPb(pbBio) {
  let {fn, tag, pbVol1n, pbVol2n, pbNL} = pbBio;
  if (! vol1nIs1(pbVol1n) || ! pbIsFirst(pbVol2n + '-' + pbNL)) {
    console.log('Warning! Pb is not start from 1-1-1a, 1-1-0a, 1-1-1, or 1-1-0', fn, tag);
  }
}

function vol1nIs1(vol1n) {
  return 1 === vol1n;
}

function pbIsFirst(pbId) {
  return pbId === '1-1a' || pbId === '1-0a' || pbId === '1-1' || pbId === '1-0';
}

function setVariables(textObj, pbAnalyzer) {
  let {fn, text} = textObj;
  let hasVol = detectVol(text);
  let vol1n = hasVol ? analyzeVol(fn, text).vol1n : pbAnalyzer(fn, text).pbVol1n;
  return [fn, text, hasVol, vol1n];
}

function checkVol1nIn2Files(fn, vol1n, lastFn, lastVol1n, hasVol) {
  let lessVol1n = vol1n < lastVol1n;
  let sameVol1n = vol1n === lastVol1n;
  let vol1nAdd1 = vol1n === lastVol1n + 1;
  let vol1nJump = vol1n > lastVol1n + 1;
  let message = [lastFn, 'volumn', lastVol1n, fn, 'volumn', vol1n];

  if (hasVol && vol1nAdd1 || ! hasVol && sameVol1n) {
    return;
  }
  else if (hasVol && vol1nJump) {
    console.log('Warning', ...message, 'Volumn not continuous! Texts may be missing');
  }
  else if (! hasVol && vol1nJump) {
    console.log('Warning', ...message, 'Volumn not continuous! Texts or vol tag may be missing');
  }
  else if (! hasVol && vol1nAdd1) {
    console.log('Warning', ...message, 'A vol tag may be missing');
  }
  else {
    return 'Error! Wrong vol order: ' + message.join(' ');
  }
}

function check1stPb(lastPbBio, pbBio) {

}


