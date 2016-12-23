const volRegex = /<vol n="(\d+?)-(\d+?)"/;
const volNRegex = /<vol n="(.+?)"/;
const pbVolNRegex = /<pb id="(\d+?-\d+?)-/;
const pbSLregex = /<pb id="(\d+?)-(\d+?)-(\d+?)([abcd])"/;
const pbNoSLregex = /<pb id="\d+?-\d+?-\d+?"/;
const volPbSLRegex = /<vol n="\d+?-\d+?"|<pb id="\d+?-\d+?-\d+?[abcd]"/g;
const volPbNoSLRegex = /<vol n="\d+?-\d+?"|<pb id="\d+?-\d+?-\d+?"/g;

import reportErr from './reportErr.js';

export default function checkVolPbOrder(textObjs) {
  let {pbRegex, volPbRegex, firstVolN} = initSet(textObjs[0]);

  textObjs.forEach((textObj, index) => {
    let text = textObj.text, fileName = textObj.fileName;
    let volPbs = text.match(volPbRegex);

  });
}

function initSet(textObj) {
  let text = textObj.text, fileName = textObj.fileName;
  let pbHasSuffixLetter = text.match(pbSLregex);
  let pbRegex = pbHasSuffixLetter ? pbSLregex : pbNoSLregex;
  let volPbRegex = pbHasSuffixLetter ? volPbSLRegex : volPbNoSLRegex;
  let firstVolN = checkFirstVolN(text, fileName);
  return {pbRegex: pbRegex, volPbRegex: volPbRegex, firstVolN: firstVolN};
}

function checkFirstVolN(text, fileName) {
  let volInfo = text.match(volNRegex);
  if (! volInfo) {
    console.log('Warning! No vol in', fileName);
    volInfo = text.match(pbVolNRegex);
  }
  let volN = volInfo[1];
  if (volN !== '1-1') {
    console.log('Warning! Vol not start from 1-1', fileName);
  }
  return volN;
}