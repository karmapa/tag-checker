const divPosRegex1 = /^(<sutra.+?>\r?\n)?<division.+?>\r?\n<vol.+?>\r?\n<pb/;
const divPosRegex2 = /^<division.+?>\r?\n<vol.+?>\r?\n<pb/;
const volPosRegex1 = /^(<sutra.+?>\r?\n)?<vol.+?>\r?\n<pb/;
const volPosRegex2 = /^<vol/;
const volRegex = /<vol/g;
const divRegex = /<division n="(\d+?)"/g;
const wrongSutraPosRegex = /<sutra[^>]+?>(?!(\r?\n<vol|\r?\n<division|<head n="1"))/g;
const volHeadRegex = /<vol.+?>\r?\n<pb.+?>\r?\n(<[A-z]p id.+?>)?<head n="1"/;

import {warn, reportErr} from './handleErr.js';
import {countTag} from './helper.js';
import {numberAdd1, numberJump} from './compareNumber.js';
import {getPageLineInfo, reportLongLinePage} from './checkPageLine.js';

export default function checkStructure(textObjs) {
  let multiVols = [], multiDivs = [], wrongDivOrders = [], wrongTagPoses = [];
  let lastDivN = 0, lastDivFile = 'First div n is not 1';

  let charsPerLineCollect = [];
  let pageLineInfo = [];

  textObjs.forEach((textObj) => {
    let {fn, text} = textObj;
    let divNumber = 0;

    let volNumber = countTag(text, volRegex);
    checkMultiVol(multiVols, fn, volNumber);

    text.replace(divRegex, (divTag, divN) => {
      checkMultiDiv(multiDivs, fn, divNumber ++);

      divN = Number(divN);
      checkDivOrder(wrongDivOrders, lastDivFile, lastDivN, fn, divN);

      lastDivN = divN, lastDivFile = fn;
    });

    if (1 === divNumber || 1 === volNumber) {
      checkTagPos(wrongTagPoses, text, divNumber, fn);
    }

    checkSutraPos(wrongTagPoses, fn, text);

    pageLineInfo.push(getPageLineInfo(charsPerLineCollect, fn, text));
  });

  if (multiVols.length > 0) {
    warn(...multiVols);
  }

  reportErr('Structure Error', [...multiDivs, ...wrongDivOrders, ...wrongTagPoses]);

  reportLongLinePage(charsPerLineCollect, pageLineInfo);
}

function checkMultiVol(store, fn, volNumber) {
  if (volNumber > 1) {
    store.push('Many vol tag in ' + fn);
  }
}

function checkMultiDiv(store, fn, divNumber) {
  if (2 === divNumber) {
    store.push('Many division tag in ' + fn);
  }
}

function checkDivOrder(store, lastDivFile, lastDivN, fn, divN) {
  if (numberAdd1(lastDivN, divN)) {
    return;
  }
  else if (numberJump(lastDivN, divN)) {
    warn('Division may be missing!', lastDivFile, lastDivN, fn, divN);
  }
  else {
    store.push('Wrong Division Order' + lastDivFile + ' ' + lastDivN + ' ' + fn + ' ' + divN);
  }
}

function checkTagPos(store, text, divNumber, fn) {
  if (divNumber) {
    if (! text.match(divPosRegex1)) {
      store.push('Wrong division tag position! ' + fn);
    }
    else if (text.match(divPosRegex2)) {
      warn('No sutra tag before division tag!', fn);
    }
  }
  else if (! text.match(volPosRegex1)) {
    store.push('Wrong vol tag position! ' + fn);
  }
  else if (text.match(volPosRegex2)) {
    warn('No sutra tag before vol tag!', fn);
  }

  if (! text.match(volHeadRegex)) {
    warn('Vol is not followed by head tag!', fn);
  }
}

function checkSutraPos(store, fn, text) {
  let wrongSutraPoses = text.match(wrongSutraPosRegex);
  if (wrongSutraPoses) {
    wrongSutraPoses.forEach((sutraTag) => {
      warn(fn + ' Wrong sutra tag position! ' + sutraTag);
    });
  }
}