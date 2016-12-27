const pbXregex = /<pb id="\d+?-\d+?-(\d+?)([abcd])"/;
const pbNoXregex = /<pb id="\d+?-\d+?-(\d+?)"/;
const volRegex = /<vol n="(\d+?)-(\d+?)"/;
const volNRegex = /<vol n="(.+?)"/;
const pbVolNRegex = /<pb id="(\d+?-\d+?)-/;


import reportErr from './reportErr.js';

export default function checkVolPbOrder(textObjs) {
  let errMessages = [];
  let {pbRegex, pbsRegex, pbHasX} = initSetting(textObjs[0]);
  let {firstPageChecker, pbOrderChecker} = initFunction(pbHasX);
  let lastTextVolN, lastFileName, lastTextPb;

  textObjs.forEach((obj) => {
    let {text, fileName, hasVol, textVolN, firstPb, isNewVolN} = initText(obj, pbRegex, lastTextVolN);
    let volMessage = [lastFileName, lastTextVolN, fileName, textVolN].join(' ');
 
    if (textVolN === lastTextVolN && hasVol) {
      errMessages.push('Vol tag in ' + fileName + 'may repeat or should be put in ' + lastFileName);
    }
    else if (lastTextVolN && textVolN !== lastTextVolN) {
      if (wrongVolOrder(lastTextVolN, textVolN, lastFileName, fileName, volMessage)) {
        errMessages.push('Wrong vol order: ' + volMessage);
      };
      if (! hasVol) {
        console.log('Vol tag may miss in:', fileName, firstPb);
      }
    }

    let pbs = text.match(pbsRegex);
    if (lastTextPb) {
      firstPageChecker(isNewVolN, pbs[0], pbHasX, fileName, lastTextPb);
    }
    let wrongPbOrderMessages = getWrongPbOrder(pbs, pbsRegex, textVolN, fileName);
    errMessages = errMessages.concat(wrongPbOrderMessages);

    lastTextVolN = textVolN, lastFileName = fileName, lastTextPb =  pbs[pbs.length - 1];
  });

  reportErr('Wrong vol and pb', errMessages);
}

function initSetting(obj) {
  let text = obj.text;
  let pbHasSuffix = pbXregex.test(text);
  let pbRegex = pbHasSuffix ? pbXregex : pbNoXregex;
  let pbsRegex = new RegExp(pbRegex, 'g');
  checkFirstVolNandPbId(text, obj.fileName, pbHasSuffix);
  return {
    pbRegex: pbRegex, pbsRegex: pbsRegex, pbHasX: pbHasSuffix
  };
}

function checkFirstVolNandPbId(text, fileName, pbHasSuffix) {
  let volInfo = text.match(volNRegex);
  if (! volInfo) {
    console.log('Warning! No vol in', fileName);
    volInfo = text.match(pbVolNRegex);
  }
  let volN = volInfo[1];
  if (volN !== '1-1') {
    console.log('Warning! Vol not start from 1-1', fileName);
  }

  checkPbFrom0or1ora(text, pbHasSuffix, fileName);
}

function checkPbFrom0or1ora(str, pbHasX, fileName) {
  let pbId = str.match(/<pb id="\d+?-\d+?-(\d+?[abcd])?"/)[1];
  if (pbHasX) {
    if (pbId !== '0a' && pbId !== '1a') {
      console.log('Warning! Pb not start from 0a or 1a', fileName);
    }
  }
  else {
    if (pbId !== '0' && pbId !== '1') {
      console.log('Warning! Pb not start from 0a or 1a', fileName);
    }
  }
}

function initFunction(pbHasX) {
  if (pbHasX) {
    return {firstPageChecker: firstXpageChecker, pbOrderChecker: xPbOrderChecker};
  }
  else {
    return {firstPageChecker: firstNoXpageChecker, pbOrderChecker: 'noXpbOrderChecker'};
  }
}

function firstXpageChecker(isNewVolN, firstPb, pbHasX, fileName, lastTextPb) {
  if (isNewVolN) {
    checkPbFrom0or1ora(firstPb, pbHasX, fileName);
  }
  else {
    let suspectedPbSets = xPbOrderChecker(lastTextPb, firstPb);
    if (suspectedPbSets) {
      console.log('Warning! LastPb:', lastTextPb, 'ThisPb:', firstPb);
    }
  }
}

function xPbOrderChecker(lastPb, thisPb) {
  let pbSets = [lastPb, thisPb];
  let thisPbId = thisPb.match(pbXregex), lastPbId = lastPb.match(pbXregex);;
  let thisNum = Number(thisPbId[1]), thisLetter = thisPbId[2];
  let lastNum = Number(lastPbId[1]), lastLetter = lastPbId[2];

  if (lastNum === thisNum) {
    if (lastLetter === 'a' && thisLetter !== 'b') {
      return pbSets;
    }
    else if (lastLetter === 'b' && thisLetter !== 'c') {
      return pbSets;
    }
    else if (lastLetter === 'c' && thisLetter !== 'd') {
      return pbSets;
    }
  }
  else if (1 === lastNum - thisNum) {
    if (lastLetter === 'b' && thisLetter !== 'a') {
      return pbSets;
    }
    else if (lastLetter === 'd' && thisLetter !== 'a') {
      return pbSets;
    }
  }
  else {
    return pbSets;
  }
}

function initText(obj, pbRegex, lastTextVolN) {
  let text = obj.text;
  let hasVol = /<vol/.test(text);
  let textVolN = hasVol ? text.match(volNRegex)[1] : text.match(pbVolNRegex)[1];
  let firstPb = text.match(pbRegex)[0];
  let isNewVolN = textVolN !== lastTextVolN;
  return {
    text: text, fileName: obj.fileName, hasVol: hasVol, 
    textVolN: textVolN, firstPb: firstPb, isNewVolN: isNewVolN
  };
}

function wrongVolOrder(lastTextVolN, textVolN, lastFileName, fileName, volMessage) {
  let {major: lastMajor, minor: lastMinor} = splitVolN(lastTextVolN);
  let {major: thisMajor, minor: thisMinor} = splitVolN(textVolN);

  let majorEqual = thisMajor === lastMajor;
  let majorNormal = lastMajor + 1 === thisMajor;
  let majorLess = thisMajor < lastMajor;
  let majorJump = thisMajor - lastMajor > 1;
  let minorJump = thisMinor - lastMinor > 1;

  if (majorJump || majorEqual && minorJump || majorNormal && thisMinor > 1) {
    console.log('Warning! Missing vol: ', volMessage);
  }

  if (majorLess || majorEqual && thisMinor < lastMinor) {
    return true;
  }
}

function splitVolN(volN) {
  let splits = volN.split('-');
  return {major: Number(splits[0]), minor: Number(splits[1])};
}

function getWrongPbOrder(pbs, pbsRegex, textVolN, fileName) {
  let errMessages = [];

  pbs.forEach((pb) => {
    if (isPbVolNwrong(pb, textVolN)) {
      errMessages.push(fileName + ' ' + pb + ', vol part should be ' + textVolN);
    }
  });

  return errMessages;
}

function isPbVolNwrong(pb, textVolN) {
  let pbVolN = pb.match(pbVolNRegex)[1];
  return pbVolN !== textVolN;
}