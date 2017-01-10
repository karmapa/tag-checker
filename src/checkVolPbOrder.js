import {analyzePb4, analyzePb} from './analyzeTag.js';
import reportErr from './reportErr.js';

export default function checkVolPbOrder(textObjs) {
  let [pb1stBio, pbAnalyzer] = init(textObjs[0]);

  check1stPb(pb1stBio);
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