import {volHeadPbSWRegex, pbSIRegex, headDRegex, pbDRegex} from './regexs.js';
import {analyzeHead} from './analyzeTag.js';

export default function checkHead(textObjs) {
  let followVol, pbId, lastBio;

  textObjs.forEach((textObj) => {
    let {fileName: fn, text} = textObj;

    text.replace(volHeadPbSWRegex, (tag) => {
      if (pbDRegex.test(tag)) {
        pbId = pbSIRegex.exec(tag)[1];
      }
      else if (headDRegex.test(tag)) {
        let bio = analyzeHead(fn, pbId, tag);
        lastBio = bio;
      }
      else {
        followVol = true;
      }
    });
  });
};