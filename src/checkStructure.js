const allDivRegex = /<division n="(\d+?)"/g;
const allVolRegex = /<vol/g;
const first3pbRegex = /^([\s\S]*?<pb){1,4}/;
const divPosRegex = /^<sutra.+?>\n<division.+?>\n<vol.+?>\n<pb/;
const volPosRegex1 = /^(<sutra.+?>\n)?<vol.+?>\n<pb/;
const volPosRegex2 = /^<vol/;
const shortPageRegex = /<pb.+?>\n?(?!<sutra)(.+?\n){0,4}(?=<pb)/g;
const wrongVolPosRegex = /^<vol.+?>\n?<pb.+?>\n?<sutra/;

import reportErr from './reportErr.js';

export default function checkStructure(textObjs) {
  let multiVols = [], multiDivs = [], repeatDivs = [], allWrongTagPoses = [];
  let divNs = {};
  let lastDivN = 0, lastDivFile = 'First div n is not 1';

  textObjs.forEach((textObj) => {
    let fileName = textObj.fileName;
    let text = textObj.text;
    let divNumber = 0;
    let first3pbText = text.match(first3pbRegex)[0];

    let volNumber = (text.match(allVolRegex) || []).length;
    if (volNumber > 1) {
      multiVols.push('Many vol tag in ' + fileName);
    }

    text.replace(allDivRegex, (divTag, divN) => {
      if (2 === ++ divNumber) {
        multiDivs.push('Many division tag in ' + fileName);
      }

      divN = Number(divN);
      let storedDivN = divNs[divN];
      if (! storedDivN) {
        divNs[divN] = fileName;
      }
      else {
        repeatDivs.push('Repeat div n in ' + storedDivN + ' and ' + 'fileName');
      }

      if (divN - lastDivN !== 1) {
        console.log('Warning! Div n is not ordered!', lastDivFile, lastDivN, fileName, divN);
      }
      lastDivN = divN;
    });

    if ((divNumber + volNumber) !== 0 && (1 <= divNumber || 1 <= volNumber)) {
      let wrongTagPoses = checkTagPos(first3pbText, divNumber, volNumber, fileName);
      if (wrongTagPoses.length > 0) {
        allWrongTagPoses = allWrongTagPoses.concat(wrongTagPoses);
      }
    }
  });

  reportErr('Structure Error', multiVols.concat(multiDivs, repeatDivs, allWrongTagPoses));
}

function checkTagPos(text, divNumber, volNumber, fileName) {
  let wrongTagPoses = [];

  if (divNumber) {
    if (! text.match(divPosRegex)) {
      wrongTagPoses.push('Wrong division tag position! ' + fileName);
    }
  }
  else {
    if (! text.match(volPosRegex1)) {
      wrongTagPoses.push('Wrong vol tag position! ' + fileName);
    }
    else if (text.match(volPosRegex2)) {
      let simpleText = text.replace(shortPageRegex, '');
      if (text.match(wrongVolPosRegex)) {
        wrongTagPoses.push('Wrong vol tag position! ' + fileName);
      }
    }
  }

  return wrongTagPoses;
}