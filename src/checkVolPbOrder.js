const pbRegex = /<pb id="\d+?-\d+?-\d+?[abcd]"/;
const volPbRegex = /<vol n="\d+?-\d+?"|<pb id="\d+?-\d+?-\d+?[abcd]"/g;
const volPbWoLetterSuffixRegex = /<vol n="\d+?-\d+?"|<pb id="\d+?-\d+?-\d+?"/g;

import reportErr from './reportErr.js';

export default function checkVolPbOrder(textObjs) {
  let majorVol, minorVol, pbNum, pbLetter;

  let pbHasSuffixLetter = textObjs[0].text.match(pbRegex);
  let findingRegex = pbHasSuffixLetter ? volPbRegex : volPbWoLetterSuffixRegex;

  textObjs.forEach((textObj) => {
    let fileName = textObj.fileName;
    let text = textObj.text;

//    while(volPbRegex.exec(text)) {
      //console.log(volPbRegex.exec(text));
//    };
  });
}