const divPosRegex = /^<sutra.+?>\r?\n<division.+?>\r?\n<vol.+?>\r?\n<pb/;
const volPosRegex1 = /^(<sutra.+?>\r?\n)?<vol.+?>\r?\n<pb/;
const volPosRegex2 = /^<vol/;
const volRegex = /<vol/g;
const divRegex = /<division n="(\d+?)"/g;

import {saveErr, saveErrs, warn, reportErr} from './handleErr.js';
import {countTag} from './helper.js';

export default function checkStructure(textObjs) {
  let multiVols = [], multiDivs = [], wrongDivOrders = [], wrongTagPoses = [];
  let lastDivN = 0, lastDivFile = 'First div n is not 1';

  textObjs.forEach((textObj) => {
    let {fn, text} = textObj;
    let divNumber = 0;

    let volNumber = countTag(text, volRegex);
    if (volNumber > 1) {
      multiVols.push('Many vol tag in ' + fn);
    }

    text.replace(divRegex, (divTag, divN) => {
      if (2 === ++ divNumber) {
        saveErr(multiDivs, 'Many division tag in ' + fn);
      }

      divN = Number(divN);
      saveErr(wrongDivOrders, checkDivOrder(lastDivFile, lastDivN, fn, divN));

      lastDivN = divN, lastDivFile = fn;
    });

    if (1 === divNumber || 1 === volNumber) {
      saveErrs(wrongTagPoses, checkTagPos(text, divNumber, fn));
    }
  });

  reportErr('Structure Error', [...multiVols, ...multiDivs, ...wrongDivOrders, ...wrongTagPoses]);
}

function checkDivOrder(lastDivFile, lastDivN, fn, divN) {
  let divDiff = divN - lastDivN;
  if (divDiff > 1) {
    warn('Div n jump!', lastDivFile, lastDivN, fn, divN);
  }
  else if (divDiff < 1) {
    return 'Wrong Div Order' + lastDivFile + ' ' + lastDivN + ' ' + fn + ' ' + divN;
  }
}

function checkTagPos(text, divNumber, fn) {
  let wrongTagPoses = [];

  if (divNumber) {
    if (! text.match(divPosRegex)) {
      wrongTagPoses.push('Wrong division tag position! ' + fn);
    }
  }
  else {
    if (! text.match(volPosRegex1)) {
      wrongTagPoses.push('Wrong vol tag position! ' + fn);
    }
    else if (text.match(volPosRegex2)) {
      warn('No sutra tag before vol tag!', fn);
    }
  }

  return wrongTagPoses;
}