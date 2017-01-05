import {volHeadPbSWRegex, headSIRegex, pbSIRegex, headDRegex, pbDRegex} from './regexs.js';

export default function checkHead(textObjs) {
  let followVol, pbId, lastBio;

  textObjs.forEach((textObj) => {
    let {text, fn} = textObj;

    text.replace(volHeadPbSWRegex, (tag) => {
      if (pbDRegex.test(tag)) {
        pbId = pbSIRegex.exec(tag)[1];
      }
      else if (headDRegex.test(tag)) {
        //let bio = analyzeHead(tag);
      }
      else {
        followVol = true;
      }
    });
  });
};