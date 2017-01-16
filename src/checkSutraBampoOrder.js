const sutraBampoPbRegex = /<(sutra|bampo).+?>|<pb.+?>(?=([\s\S](?!<pb))*?(?=<sutra|<bampo))/g;
const pbRegex = /<pb id="(.+?)"/;

import {pbExist, bampoExist} from './detectTag.js';
import {analyzeSutra, analyzeBampo} from './analyzeTag.js';
import {lessNumber, sameNumber, numberAdd1, numberJump} from './compareNumber.js';
import {warn, reportErr} from './handleErr.js';

export default function checkSutraBampoOrder(textObjs) {
  let lastBio, lackSutraInBampos, firstBampoAhead, errMessages = [];

  textObjs.forEach((textObj) => {
    let {fn, text} = textObj;
    let pb = 'beforePb';

    text.replace(sutraBampoPbRegex, (tag) => {
      if (pbExist(tag)) {
        pb = pbRegex.exec(tag)[1];
        return;
      }

      tagBio = bampoExist(tag) ? analyzeBampo(fn, pb, tag) : analyzeSutra(fn, pb, tag);
      let type === tagBio.type;

      if (lastBio) {
        let lastType = lastBio.type;
        checkOrder(errMessages, lastBio, tagBio, firstBampoAhead);

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

function checkOrder(store, lastBio, bio, firstBampoAhead) {
  let {type: lastType, pb: lastPb, fn: lastFn, tag: lastTag} = lastBio;
  let {type, pb, fn, tag} = bio;
  let errInfo = lastFn + ' ' + lastPb + ' ' + lastTag + ', ' + fn + ' ' + pb + ' ' + tag;

  if (lastType === 'sutra' && type === 'sutra') {
    checkSutraOrder(store, lastBio, bio, errInfo);
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

function checkSutraOrder(store, lastBio, bio, errInfo) {
  let {sutraV: lastSutraV, sutraN: lastSutraN, sutraL: lastSutraL} = lastBio;
  let {sutraV, sutraN, sutraL} = bio;

  if (lastSutraV !== sutraV) {
    store.push('Sutra id not consistent! ' + errInfo);
  }

  checkSutraNL_Order(store, lastSutraN, lastSutraL, sutraN, sutraL, errInfo);
}

function checkSutraNL_Order(store, lastSutraN, lastSutraL, sutraN, sutraL, errInfo) {
  if (lessNumber(lastSutraN, sutraN)) {
    store.push('Wrong sutra order! ' + errInfo);
  }
  else if (sameNumber(lastSutraN, sutraN)) {
    if (! sutraL || ! lastSutraL) {
      store.push('Wrong sutra order! ' + errInfo);
    }
    else {
      sutraL = sutraL.charCodeAt(0), lastSutraL = lastSutraL.charCodeAt(0);
      if (numberJump(lastSutraL, sutraL)) {
        warn('Sutra is missing! ' + errInfo);
      }
      else if (! numberAdd1(lastSutraL, sutraL)) {
        store.push('Wrong sutra order! ' + errInfo);
      }
    }
  }
  else if (numberAdd1(lastSutraN, sutraN)) {
    if (sutraL && sutraL !== 'a') {
      warn('Sutra may be missing! ' + errInfo);
    }
  }
  else {
    warn('Sutra is missing! ' + errInfo);
  }
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