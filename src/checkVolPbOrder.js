import {analyzePb4, analyzePb, analyzeVol} from './analyzeTag.js';
import {detectVol} from './detectTag.js';
import {saveErr} from './helper.js';
import reportErr from './reportErr.js';

export default function checkVolPbOrder(textObjs) {
  let [pb1stBio, pbAnalyzer] = init(textObjs[0]);
  let [lastFn, lastVol1n] = ['no-last-file', 0];
  let errMessages = [];

  check1stPb(pb1stBio);

  textObjs.forEach((textObj) => {
    let [fn, text, hasVol, vol1n] = setVariables(textObj, pbAnalyzer);

    let wrongVol1nIn2Files = checkVol1nIn2Files(fn, vol1n, lastfn, lastVol1n, hasVol);
    saveErr(errMessages, [wrongVol1nIn2Files]);

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

