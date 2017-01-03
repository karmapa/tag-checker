const sutraBampoPbRegex = /<(sutra|bampo).+?>|<pb.+?>(?=([\s\S](?!<pb))*?(?=<sutra|<bampo))/g;
const sutraRegex = /<sutra id="([\da-zA-Z]*?[a-zA-Z])((\d+?)([a-zA-Z])?)"/;
const bampoRegex = /<bampo n="([\da-zA-Z]+?)\.((\d+?)(\.(\d+?))?)"/;
const pbRegex = /<pb id="(.+?)"/;

import reportErr from './reportErr.js';

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

function analyzeTag(tag, pb, fn) {
  if (hasPb(tag)) {
    return {type: 'pb', pb: tag.match(pbRegex)[1]};
  }
  else if (hasBampo(tag)) {
    return analyzeBampo(tag, pb, fn);
  }
  else {
    return analyzeSutra(tag, pb, fn);
  }
}

function hasPb(str) {
  return /pb/.test(str);
}

function hasBampo(str) {
  return /bampo/.test(str);
}

function analyzeBampo(tag, pb, fn) {
  let bio = tag.match(bampoRegex);
  return {
    type: 'bampo',
    pb: pb,
    fn: fn,
    tag: bio[0],
    sutraNL: bio[1],
    bampoN: Number(bio[2]),
    bampo1n: Number(bio[3]),
    bampo2n: Number(bio[5])
  }
}

function analyzeSutra(tag, pb, fn) {
  let bio = tag.match(sutraRegex);
  return {
    type: 'sutra',
    pb: pb,
    fn: fn,
    tag: bio[0],
    sutraV: bio[1],
    sutraNL: bio[2],
    sutraN: Number(bio[3]),
    sutraL: bio[4]
  }
}

function checkOrder(lastBio, bio, firstBampoAhead) {
  let {type: lastType, pb: lastPb, fn: lastFn, tag: lastTag} = lastBio;
  let {type, pb, fn, tag} = bio;
  let errInfo = lastTag + ' ' + lastFn + ' ' + lastPb + ', ' + tag + ' ' + fn + ' ' + pb;

  if (lastType === 'sutra' && type === 'sutra') {
    return checkSutraOrder(lastBio, bio, errInfo);
  }
  else if (lastType === 'sutra' && type === 'bampo') {
    checkSutra_bampoOrder(lastBio, bio, firstBampoAhead);
    // 如果 sutraNL 不同，firstBampoAhead 下，不要報錯
  }
  else if (lastType === 'bampo' && type === 'sutra') {
    checkSutra_bampoOrder(lastBio, bio);
  }
  else {
    checkBampoOrder(lastBio, bio, firstBampoAhead);
    // 如果 sutraNL 不同，不要報錯
  }
}

function checkSutraOrder(lastBio, bio, errInfo) {
  let errMessages = [];
  let {sutraN: lastSutraN} = lastBio;
  let {sutraN} = bio;

  if (lastBio.sutraV !== bio.sutraV) {
    errMessages.push('Sutra id not consistent! ' + errInfo);
  }

  if (lastSutraN > sutraN) {
    errMessages.push('Wrong sutra order! ' + errInfo);
  }

  return 0 === errMessages.length ? false : errMessages;
}

function checkBampoOrder(lastBio, bio) {

}

function checkSutra_bampoOrder(lastBio, bio, firstBampoAhead) {

}

function checkBampo_sutraOrder(lastBio, bio) {

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