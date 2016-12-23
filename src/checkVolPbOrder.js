const volRegex = /<vol n="(\d+?)-(\d+?)"/;
const volNRegex = /<vol n="(.+?)"/;
const pbVolNRegex = /<pb id="(\d+?-\d+?)-/;
const pbSLregex = /<pb id="(\d+?)-(\d+?)-(\d+?)([abcd])"/;
const pbNoSLregex = /<pb id="\d+?-\d+?-\d+?"/;
const volPbSLRegex = /<vol n="\d+?-\d+?"|<pb id="\d+?-\d+?-\d+?[abcd]"/g;
const volPbNoSLRegex = /<vol n="\d+?-\d+?"|<pb id="\d+?-\d+?-\d+?"/g;

import reportErr from './reportErr.js';

export default function checkVolPbOrder(textObjs) {
  let errMessages = [];
  let {pbRegex, volPbRegex} = initSet(textObjs[0]);
  let lastTextVolN, lastFileName, lastPbId;

  textObjs.forEach((textObj) => {
    let {text, fileName, hasVol, textVolN} = initText(textObj, volPbRegex);
    if (textVolN === lastTextVolN && hasVol) {
      errMessages.push('Vol tag should not in ' + fileName + ', repeat vol tag or vol tag should be put in ' + lastFileName);
    }

 //   let volPbs = text.match(volPbRegex);

  });
}

function initSet(textObj) {
  let text = textObj.text, fileName = textObj.fileName;
  let pbHasSuffixLetter = text.match(pbSLregex);
  let pbRegex = pbHasSuffixLetter ? pbSLregex : pbNoSLregex;
  let volPbRegex = pbHasSuffixLetter ? volPbSLRegex : volPbNoSLRegex;
  checkFirstVolN(text, fileName);
  return {pbRegex: pbRegex, volPbRegex: volPbRegex};
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
}

function initText(textObj, volPbRegex) {
  let text = textObj.text;
  let hasVol = /<vol/.test(text);
  let textVolN = hasVol ? text.match(volNRegex)[1] : text.match(pbVolNRegex)[1];
  return {text: text, fileName: textObj.fileName, hasVol: hasVol, textVolN: textVolN};
}
// vol tag 會在每個檔案前面
// 一個檔案只有一個 vol

// 換檔案 vol n 改變，要檢查 vol n 順序
// 換檔案 vol n 改變，要檢查有沒有 vol

// 每個檔案的 vol n 相同
