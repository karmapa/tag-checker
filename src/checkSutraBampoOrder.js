const sutraBampoPbRegex = /<(sutra|bampo).+?>|<pb.+?>(?=([\s\S](?!<pb))*?(?=<sutra|<bampo))/g;

import reportErr from './reportErr.js';
import analyzeTag from './analyzeTag.js';

export default function checkSutraBampoOrder(textObjs) {
  let lastBio, lackSutraInBampos, firstBampoAhead, errMessages = [];

  textObjs.forEach((textObj) => {
    let pb = 'beforePb', fn = textObj.fileName;

    textObj.text.replace(sutraBampoPbRegex, (tag) => {
      let tagBio = analyzeTag(tag, pb, fn);

      if (tagBio.type === 'pb') {
        pb = tagBio.pb;
      }
      else if (lastBio) {
        let wrongOrder = checkOrder(lastBio, tagBio, firstBampoAhead);
        if (wrongOrder) {
          errMessages = errMessages.concat(wrongOrder);
        }

        firstBampoAhead = isFirstBampoAhead(lastBio, tagBio);
        lastBio = tagBio;
      }
      else {
        checkFirstBio(tagBio);
        lastBio = tagBio;
      }
    });
  });

  reportErr('Wrong Sutra Bampo Order', errMessages);
}

function checkOrder(lastBio, bio, firstBampoAhead) {
  let {type: lastType, pb: lastPb, fn: lastFn, tag: lastTag} = lastBio;
  let {type, pb, fn, tag} = bio;
  let errInfo = lastTag + ' ' + lastFn + ' ' + lastPb + ', ' + tag + ' ' + fn + ' ' + pb;

  if (lastType === 'sutra' && type === 'sutra') {
    return checkSutraOrder(lastBio, bio, errInfo);
  }
  else if (lastType === 'sutra' && type === 'bampo') {
    return checkSutra_bampoOrder(lastBio, bio, firstBampoAhead, errInfo);
    // 如果 sutraNL 不同，firstBampoAhead 下，不要報錯
  }
  else if (lastType === 'bampo' && type === 'sutra') {
    checkBampo_sutraOrder(lastBio, bio);
  }
  else {
    checkBampoOrder(lastBio, bio, firstBampoAhead);
    // 如果 sutraNL 不同，不要報錯
  }
}

function checkSutraOrder(lastBio, bio, errInfo) {
  let errMessages = [];
  let {sutraN: lastSutraN, sutraL: lastSutraL} = lastBio;
  let {sutraN, sutraL} = bio;

  if (lastBio.sutraV !== bio.sutraV) {
    errMessages.push('Sutra id not consistent! ' + errInfo);
  }

  if (lastSutraN > sutraN) {
    errMessages.push('Wrong sutra order! ' + errInfo);
  }

  if (sutraN - lastSutraN > 1) {
    console.log('Warning! Sutra is missing! ' + errInfo);
  }

  if (sutraN === lastSutraN) {
    if (! sutraL || ! lastSutraL) {
      errMessages.push('Wrong sutra order! ' + errInfo);
    }
    else {
      sutraL = sutraL.charCodeAt(0), lastSutraL = lastSutraL.charCodeAt(0);
      if (sutraL - lastSutraL > 1) {
        console.log('Warning! Sutra is missing! ' + errInfo);
      }
      else if (sutraL <= lastSutraL) {
        errMessages.push('Wrong sutra order! ' + errInfo);
      }
    }
  }

  return 0 === errMessages.length ? false : errMessages;
}

function checkSutra_bampoOrder(lastBio, bio, firstBampoAhead, errInfo) {
  let errMessages = [];
  let {sutraNL: lastSutraNL, sutraN: lastSutraN, sutraL: lastSutraL} = lastBio;
  let {sutraNL, sutraN, sutraL, bampoN} = bio;
  let sameSutraNL = lastSutraNL === sutraNL;

  if (! firstBampoAhead && sameSutraNL) {

  }
  else if (! firstBampoAhead && ! sameSutraNL) {

  }
  else if (firstBampoAhead && sameSutraNL) {

  }
  else {

  }
// firstBampoAhead
// sutra NL 同
// bampo 從 2 開始
// sutra NL 不同
// 檢查 sutra NL
// bampo 從 1 開始
// ! firstBampoAhead
// sutra NL 同
// bampo 從 1 開始
// sutra NL 不同
// 檢查 sutra NL
// bampo 從 1 開始

  return 0 === errMessages.length ? false : errMessages;
}

function checkBampoOrder(lastBio, bio) {
  let errMessages = [];
  return 0 === errMessages.length ? false : errMessages;
}

function checkBampo_sutraOrder(lastBio, bio) {
  let errMessages = [];
  return 0 === errMessages.length ? false : errMessages;
}

function isFirstBampoAhead(lastBio, bio) {
  let {sutraNL: lastSutraNL, bampoN} = lastBio, {sutraNL} = bio;
  return lastSutraNL === sutraNL && (bampoN === '1' || bampoN === '1.1');
}

function checkFirstBio(bio) {
  checkFirstSutraNL(bio.sutraNL);

  if (bio.type === 'bampo') {
    console.log('Warning! No sutra before first bampo');
    checkFirstBampoN(bio.bampoN);
  }
}

function checkFirstSutraNL(sutraNL) {
  if (sutraNL !== '1' && sutraNL !== '1a' && sutraNL !== '1A') {
    console.log('Warning! Sutra id not start from 1, 1a, or 1A');
  }
}

function checkFirstBampoN(bampoN) {
  if (bampoN !== '1' && bampoN !== '1.1') {
    console.log('Warning! Bampo n not start from 1 or 1.1');
  }
}