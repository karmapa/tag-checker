import {volSIRegex, pbSWgRegex} from './regexs.js';
import {analyzePb, analyzePb4} from './analyzeTag.js';
import reportErr from './reportErr.js';

export default function checkVolPbOrder(textObjs) {
  let errMessages = [];
  let {pbHasX, pbAnalyzer, pbOrderChecker} = findPbType(textObjs[0]);
  let lastTextVolN, lastFileName, lastTextPb;
/*
  textObjs.forEach((obj) => {
    let {text, fn, hasVol, textVolN, firstPb, isNewVolN} = initText(obj, pbRegex, lastTextVolN);
    let volMessage = [lastFileName, lastTextVolN, fn, textVolN].join(' ');
 
    if (textVolN === lastTextVolN && hasVol) {
      errMessages.push('Vol tag in ' + fn + 'may repeat or should be put in ' + lastFileName);
    }
    else if (lastTextVolN && textVolN !== lastTextVolN) {
      if (wrongVolOrder(lastTextVolN, textVolN, lastFileName, fn, volMessage)) {
        errMessages.push('Wrong vol order: ' + volMessage);
      };
      if (! hasVol) {
        console.log('Vol tag may miss in:', fn, firstPb);
      }
    }

    let pbs = text.match(pbsRegex);
    if (lastTextPb) {
      checkFirstPbId(isNewVolN, pbs[0], pbHasX, fn, lastTextPb, pbOrderChecker);
    }
    let wrongPbOrderMessages = getWrongPbOrder(pbs, pbsRegex, textVolN, fn, pbOrderChecker);
    errMessages = errMessages.concat(wrongPbOrderMessages);

    lastTextVolN = textVolN, lastFileName = fn, lastTextPb =  pbs[pbs.length - 1];
  });
*/
  reportErr('Wrong vol and pb', errMessages);
}

function findPbType(obj) {
  let {fn, text} = obj;
  let volBio = volSIRegex.exec(text);
  let {pbVolN, pbNL, pbL} = analyzePb4(fn, text);
  checkFirstVolNandPbId(fn, volBio, pbVolN, pbNL);

  let pbHasSuffix = pbL ? true : false;
  let pbOrderChecker = pbHasSuffix ? checkPb4order : checkPbOrder;
  let pbAnalyzer = pbHasSuffix ? analyzePb4 : analyzePb;
  return {
    pbHasX: pbHasSuffix, pbAnalyzer: pbAnalyzer, pbOrderChecker: pbOrderChecker
  };
}

function checkFirstVolNandPbId(fn, volBio, pbVolN, pbNL) {
  if (! volBio) {
    console.log('Warning! No vol in', fn);
  }
  else if ('1' !== volBio[1]){
    console.log('Warning! Vol not start from 1', fn);
  }

  if (pbVolN !== '1-1') {
    console.log('Warning! pbVolN not start from 1-1', fn);
  }

  checkPbFrom0or1ora(fn, pbNL);
}

function checkPbFrom0or1ora(fn, pbNL) {
  if (pbNL !== '0a' && pbNL !== '1a' && pbNL !== '0' && pbNL !== '1') {
    console.log('Warning! Pb not start from 0a or 1a or 0 or 1', fn);
  }
}

function checkFirstPbId(isNewVolN, firstPb, pbHasX, fn, lastTextPb, pbOrderChecker) {
  if (isNewVolN) {
    checkPbFrom0or1ora(firstPb, pbHasX, fn);
  }
  else {
    let suspectedPbSets = pbOrderChecker(lastTextPb, firstPb);
    if (suspectedPbSets) {
      console.log('Warning! LastPb:', lastTextPb, 'ThisPb:', firstPb, fn);
    }
  }
}

function checkPb4order(lastPb, thisPb) {
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
  else if (1 === thisNum - lastNum) {
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

function checkPbOrder(lastPb, thisPb) {
  let pbSets = [lastPb, thisPb];
  let thisPbId = Number(thisPb.match(pbNoXregex)[1]);
  let lastPbId = Number(lastPb.match(pbNoXregex)[1]);

  if (1 !== thisNum - lastNum) {
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
    text: text, fn: obj.fn, hasVol: hasVol, 
    textVolN: textVolN, firstPb: firstPb, isNewVolN: isNewVolN
  };
}

function wrongVolOrder(lastTextVolN, textVolN, lastFileName, fn, volMessage) {
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

function getWrongPbOrder(pbs, pbsRegex, textVolN, fn, pbOrderChecker) {
  let errMessages = [];
  let lastPb;

  pbs.forEach((pb) => {
    if (isPbVolNwrong(pb, textVolN)) {
      errMessages.push(fn + ' ' + pb + ', vol part should be ' + textVolN);
    }
    if (lastPb) {
      let wrongPbSets = pbOrderChecker(lastPb, pb);
      if (wrongPbSets) {
        errMessages.push('Wrong Pb Order! LastPb: ' + lastPb + ' ThisPb: ' + pb + ' ' + fn);
      }
    }

    lastPb = pb;
  });

  return errMessages;
}

function isPbVolNwrong(pb, textVolN) {
  let pbVolN = pb.match(pbVolNRegex)[1];
  return pbVolN !== textVolN;
}