const volHeadPbRegex = /<(vol|head).+?>|<pb.+?>(?=([\s\S](?!<pb))*?(?=<head))/g;
const pbRegex =  /<pb id="(.+?)"/;
const tNameRegex = /^[\u0f00-\u0fff ()]+?[།གཀ༑ཿ)]$/;

import {pbExist, headExist} from './detectTag.js';
import {analyzeHead} from './analyzeTag.js';
import {warn, reportErr} from './handleErr.js';

export default function checkHeadN(textObjs) {
  let errMessages = [];
  let followVol, pbId, lastHeadBio;

  textObjs.forEach((textObj) => {
    let {fn, text} = textObj;

    text.replace(volHeadPbRegex, (tag) => {
      if (pbExist(tag)) {
        pbId = pbRegex.exec(tag)[1];
      }
      else if (headExist(tag)) {
        let headBio = analyzeHead(fn, pbId, tag);
        check1stHeadAndOrder(errMessages, lastHeadBio, headBio, followVol);
        checkTname(fn, pbId, tag, headBio.tName)

        lastHeadBio = headBio, followVol = false;
      }
      else {
        followVol = true;
      }
    });
  });

  reportErr('Wrong Head Order!', errMessages);
};

function check1stHeadAndOrder(store, lastBio, bio, followVol) {
  let {fn, pb, tag, headN} = bio;
  let bioMessage = fn + ' ' + pb + ' ' + tag;

  if (lastBio && ! followVol) {
    let {fn: lastFn, pb: lastPb, tag: lastTag, headN: lastHeadN} = lastBio;
    let lastBioMessage = lastFn + ' ' + lastPb + ' ' + lastTag;
    checkHeadOrder(lastHeadN, headN, lastBioMessage, bioMessage);
  }
  else {
    check1stHead(store, headN, bioMessage);
  }
}

function check1stHead(store, headN, bioMessage) {
  if (headN !== 1) {
    store.push('Head n is not 1 after vol tag or from the beginning! ' + bioMessage);
  }
}

function checkHeadOrder(lastHeadN, headN, lastBioMessage, bioMessage) {
  if (headN - lastHeadN > 1) {
    warn('Head n might be missing!', lastBioMessage, bioMessage);
  } 
}

function checkTname(fn, pbId, tag, tname) {
  if (! tNameRegex.test(tname)) {
    warn('Head tibetan name might be wrong!', fn, pbId, tag);
  }
}