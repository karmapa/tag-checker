const divPosRegex = /^<sutra.+?>\n<division.+?>\n<vol.+?>\n<pb/;
const volPosRegex1 = /^(<sutra.+?>\n)?<vol.+?>\n<pb/;
const volPosRegex2 = /^<vol/;

import {volDgRegex, divSIgRegex} from './regexs.js';
import reportErr from './reportErr.js';

export default function checkStructure(textObjs) {
  let multiVols = [], multiDivs = [], repeatDivs = [], allWrongTagPoses = [];
  let divNs = {};
  let lastDivN = 0, lastDivFile = 'First div n is not 1';

  textObjs.forEach((textObj) => {
    let {fn, text} = textObj;
    let divNumber = 0;

    let volNumber = (text.match(volDgRegex) || []).length;
    if (volNumber > 1) {
      multiVols.push('Many vol tag in ' + fn);
    }

    text.replace(divSIgRegex, (divTag, divN) => {
      if (2 === ++ divNumber) {
        multiDivs.push('Many division tag in ' + fn);
      }

      divN = Number(divN);
      let storedDivN = divNs[divN];
      if (! storedDivN) {
        divNs[divN] = fn;
      }
      else {
        repeatDivs.push('Repeat div n in ' + storedDivN + ' and ' + fn);
      }

      if (divN - lastDivN !== 1) {
        console.log('Warning! Div n is not ordered!', lastDivFile, lastDivN, fn, divN);
      }
      lastDivN = divN, lastDivFile = fn;
    });

    if (1 === divNumber || 1 === volNumber) {
      let wrongTagPoses = checkTagPos(text, divNumber, fn);
      if (wrongTagPoses.length > 0) {
        allWrongTagPoses = allWrongTagPoses.concat(wrongTagPoses);
      }
    }
  });

  reportErr('Structure Error', multiVols.concat(multiDivs, repeatDivs, allWrongTagPoses));
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
      console.log('Warning! Vol not follow sutra!', fn);
    }
  }

  return wrongTagPoses;
}