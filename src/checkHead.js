import {volHeadPbSWRegex, pbSIRegex, headDRegex, pbDRegex} from './regexs.js';
import {analyzeHead} from './analyzeTag.js';
import reportErr from './reportErr.js';

export default function checkHeadN(textObjs) {
  let errMessages = [];
  let followVol, pbId, lastBio;

  textObjs.forEach((textObj) => {
    let {fileName: fn, text} = textObj;

    text.replace(volHeadPbSWRegex, (tag) => {
      if (pbDRegex.test(tag)) {
        pbId = pbSIRegex.exec(tag)[1];
      }
      else if (headDRegex.test(tag)) {
        let bio = analyzeHead(fn, pbId, tag);

        let errMessage = check1stHeadAndOrder(lastBio, bio, followVol);
        if (errMessage) {
          errMessages.push(errMessage);
        };

        lastBio = bio, followVol = false;
      }
      else {
        followVol = true;
      }
    });
  });

  reportErr('Wrong Head Order!', errMessages);
};

function check1stHeadAndOrder(lastBio, bio, followVol) {
  if (lastBio) {
    let {fn: lastFn, pb: lastPb, tag: lastTag, headN: lastHeadN} = lastBio;
  }
  let {fn, pb, tag, headN} = bio;
  let bioMessages = fn + ' ' + pb + ' ' + tag;

  if (followVol && headN !== 1) {
    return 'Head n is not 1 after vol tag! ' + bioMessages;
  }

  return;
};