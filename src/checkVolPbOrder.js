const volRegex = /<vol n="(\d+?)-(\d+?)"/;
const volNRegex = /<vol n="(.+?)"/;
const pbVolNRegex = /<pb id="(\d+?-\d+?)-/;
const pbXregex = /<pb id="(\d+?)-(\d+?)-(\d+?)([abcd])"/;
const pbNoXregex = /<pb id="\d+?-\d+?-\d+?"/;
const volPbXRegex = /<vol n="\d+?-\d+?"|<pb id="\d+?-\d+?-\d+?[abcd]"/g;
const volPbNoXRegex = /<vol n="\d+?-\d+?"|<pb id="\d+?-\d+?-\d+?"/g;

import reportErr from './reportErr.js';

export default function checkVolPbOrder(textObjs) {
  let errMessages = [];
  let {pbRegex, volPbRegex} = initSetting(textObjs[0]);
  let lastTextVolN, lastFileName, lastPbId;

  textObjs.forEach((obj) => {
    let {text, fileName, hasVol, textVolN, firstPb} = initText(obj, pbRegex, volPbRegex);
    let volMessage = [lastFileName, lastTextVolN, fileName, textVolN].join(' ');
 
    if (textVolN === lastTextVolN && hasVol) {
      errMessages.push('Vol tag in ' + fileName + 'may repeat in or should be put in ' + lastFileName);
    }
    else if (lastTextVolN && textVolN !== lastTextVolN) {
      if (wrongVolOrder(lastTextVolN, textVolN, lastFileName, fileName, volMessage)) {
        errMessages.push('Wrong vol order: ' + volMessage);
      };
      if (! hasVol) {
        console.log('Vol tag may miss in:', fileName, firstPb);
      }
    }

    lastTextVolN = textVolN, lastFileName = fileName;
 //   let volPbs = text.match(volPbRegex);
  });
}

function initSetting(obj) {
  let text = obj.text;
  let pbHasSuffix = pbXregex.test(text);
  let pbRegex = pbHasSuffix ? pbXregex : pbNoXregex;
  let volPbRegex = pbHasSuffix ? volPbXRegex : volPbNoXRegex;
  checkFirstVolN(text, obj.fileName);
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

function initText(obj, pbRegex, volPbRegex) {
  let text = obj.text;
  let hasVol = /<vol/.test(text);
  let textVolN = hasVol ? text.match(volNRegex)[1] : text.match(pbVolNRegex)[1];
  let firstPb = text.match(pbRegex)[0];
  return {text: text, fileName: obj.fileName, hasVol: hasVol, textVolN: textVolN, firstPb: firstPb};
}

function wrongVolOrder(lastTextVolN, textVolN, lastFileName, fileName, volMessage) {
  let {major: lastMajor, minor: lastMinor} = splitVolN(lastTextVolN);
  let {major: thisMajor, minor: thisMinor} = splitVolN(textVolN);

  let majorEqual = thisMajor === lastMajor;
  let majorNormal = lastMajor + 1 === thisMajor;
  let majorJump = thisMajor - lastMajor > 1;
  let minorJump = thisMinor - lastMinor > 1;

  if (majorJump || majorEqual && minorJump || majorNormal && thisMinor > 1) {
    console.log('Warning! Missing vol: ', volMessage);
  }

  if (thisMajor < lastMajor || majorEqual && thisMinor < lastMajor) {
    return true;
  }
}

function splitVolN(volN) {
  let splits = volN.split('-');
  return {major: Number(splits[0]), minor: Number(splits[1])};
}

// 每個檔案的 vol n 相同