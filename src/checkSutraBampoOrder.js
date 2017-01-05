const sutraBampoPbRegex = /<(sutra|bampo).+?>|<pb.+?>(?=([\s\S](?!<pb))*?(?=<sutra|<bampo))/g;

import reportErr from './reportErr.js';
import analyzeTag from './analyzeTag.js';
import {checkFirstBampoN, checkSutraNlOrder, isFirstBampoAhead} from './sutraBampoOrderHelper.js';

export default function checkSutraBampoOrder(textObjs) {
  let lastBio, lackSutraInBampos, firstBampoAhead, errMessages = [];

  textObjs.forEach((textObj) => {
    let pb = 'beforePb', fn = textObj.fileName;

    textObj.text.replace(sutraBampoPbRegex, (tag) => {
      let tagBio = analyzeTag(tag, pb, fn);
      let type = tagBio.type;

      if (type === 'pb') {
        pb = tagBio.pb;
      }
      else if (lastBio) {
        let lastType = lastBio.type;
        let wrongOrder = checkOrder(lastBio, tagBio, firstBampoAhead);
        if (wrongOrder) {
          errMessages = errMessages.concat(wrongOrder);
        }

        if (lastType === 'bampo' && type === 'sutra') {
          firstBampoAhead = isFirstBampoAhead(lastBio, tagBio);
        }

        if (lackSutraInBampos) {
          if (! firstBampoAhead) {
            console.log('Warning! There is no sutra tag between bampos!', lackSutraInBampos.join(' '));
          }
          lackSutraInBampos = false;
        }

        if (lastType === 'bampo' && type === 'bampo' && ! wrongOrder && lastBio.sutraNL !== tagBio.sutraNL) {
          lackSutraInBampos = [lastBio.fn, lastBio.pb, lastBio.tag, tagBio.fn, tagBio.pb, tagBio.tag];
        }

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
  }
  else if (lastType === 'bampo' && type === 'sutra') {
    return checkBampo_sutraOrder(lastBio, bio, errInfo);
  }
  else {
    return checkBampoOrder(lastBio, bio, firstBampoAhead);
  }
}

function checkSutraOrder(lastBio, bio, errInfo) {
  let errMessages = [];
  let {sutraN: lastSutraN, sutraL: lastSutraL} = lastBio;
  let {sutraN, sutraL} = bio;

  if (lastBio.sutraV !== bio.sutraV) {
    errMessages.push('Sutra id not consistent! ' + errInfo);
  }

  let wrongSutraNlOrder = checkSutraNlOrder(lastSutraN, lastSutraL, sutraN, sutraL, errInfo);
  if (wrongSutraNlOrder[0]) {
    errMessages = errMessages.concat(wrongSutraNlOrder);
  }

  return 0 === errMessages.length ? false : errMessages;
}

function checkSutra_bampoOrder(lastBio, bio, firstBampoAhead, errInfo) {
  let errMessages = [];
  let {sutraNL: lastSutraNL, sutraN: lastSutraN, sutraL: lastSutraL} = lastBio;
  let {sutraNL, sutraN, sutraL, bampoN} = bio;
  let sameSutraNL = lastSutraNL === sutraNL;

  if (! firstBampoAhead && sameSutraNL) {
    checkFirstBampoN(bampoN, errInfo);
  }
  else if (! firstBampoAhead && ! sameSutraNL) {
    let wrongSutraNlOrder = checkSutraNlOrder(lastSutraN, lastSutraL, sutraN, sutraL, errInfo);
    if (wrongSutraNlOrder[0]) {
      errMessages = errMessages.concat(wrongSutraNlOrder);
    }
    else {
      checkFirstBampoN(bampoN, errInfo);
    }
  }
  else if (firstBampoAhead && sameSutraNL) {
    check2ndBampoN(bampoN, errInfo);
  }
  else {
    let wrongSutraNlOrder = checkSutraNlOrder(lastSutraN, lastSutraL, sutraN, sutraL, errInfo);
    if (wrongSutraNlOrder[0]) {
      errMessages = errMessages.concat(wrongSutraNlOrder);
    }
    else {
      checkFirstBampoN(bampoN, errInfo);
    }
  }

  return 0 === errMessages.length ? false : errMessages;
}

function checkBampo_sutraOrder(lastBio, bio, errInfo) {
  let errMessages = [];
  let {sutraN: lastSutraN, sutraL: lastSutraL} = lastBio;
  let {sutraN, sutraL} = bio;

  if (! isFirstBampoAhead(lastBio, bio)) {
    errMessages = checkSutraNlOrder(lastSutraN, lastSutraL, sutraN, sutraL, errInfo);
  }

  return 0 === errMessages.length ? false : errMessages;
}

function checkBampoOrder(lastBio, bio, errInfo) {
  let errMessages = [];
  let {sutraNL: lastSutraNL, sutraN: lastSutraN, sutraL: lastSutraL, bampo1n: lastBampo1n, bampo2n: lastBampo2n} = lastBio;
  let {sutraNL, sutraN, sutraL, bampo1n, bampo2n} = bio;
  let sameSutraNL = lastSutraNL === sutraNL;

  if (sameSutraNL) {
    if (! lastBampo2n && ! bampo2n) {
      if (bampo1n <= lastBampo1n) {
        errMessages.push('Wrong bampo order: ' + errInfo);
      }
      else if (bampo1n - lastBampo1n > 1) {
        console.log('Warning! Bampo tag might be missing!', errInfo);
      }
    }
    else if (! lastBampo2n && bampo2n) {
      if (bampo2n !== 1) {
        console.log('Warning! Bampo tag might be missing!', errInfo);
      }
    }
    else if (lastBampo2n && bampo2n && lastBampo1n === bampo1n) {
      if (bampo2n <= lastBampo2n) {
        errMessages.push('Wrong bampo order: ' + errInfo);
      }
      else if (bampo2n - lastBampo2n > 1) {
        console.log('Warning! Bampo tag might be missing!', errInfo);
      }
    }
    else if (lastBampo2n && bampo2n && lastBampo1n !== bampo1n) {
      if (bampo1n < lastBampo1n) {
        errMessages.push('Wrong bampo order: ' + errInfo);
      }
      else if (bampo1n - lastBampo1n > 1) {
        console.log('Warning! Bampo tag might be missing!', errInfo);
      }

      if (bampo2n !== 1) {
        console.log('Warning! Bampo tag might be missing!', errInfo);
      }
    }
  }

  return 0 === errMessages.length ? false : errMessages;
}

function checkFirstBio(bio) {
  checkFirstSutraNL(bio.sutraNL);

  if (bio.type === 'bampo') {
    console.log('Warning! No sutra before first bampo');
    checkFirstBampoN(bio.bampoN, 'from the beginning');
  }
}

function checkFirstSutraNL(sutraNL) {
  if (sutraNL !== '1' && sutraNL !== '1a' && sutraNL !== '1A') {
    console.log('Warning! Sutra id not start from 1, 1a, or 1A');
  }
}

function check2ndBampoN(bampoN, errInfo = '') {
  if (bampoN !== '2' && bampoN !== '2.1') {
    console.log('Warning! Bampo n is not 2 or 2.1', errInfo);
  }
}