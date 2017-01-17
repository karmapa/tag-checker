const sutraBampoPbRegex = /<(sutra|bampo).+?>|<pb.+?>(?=([\s\S](?!<pb))*?(?=<sutra|<bampo))/g;
const pbRegex = /<pb id="(.+?)"/;

import {pbExist, bampoExist} from './detectTag.js';
import {analyzeSutra, analyzeBampo} from './analyzeTag.js';
import {lessNumber, sameNumber, numberAdd1, numberJump} from './compareNumber.js';
import {warn, reportErr} from './handleErr.js';

export default function checkSutraBampoOrder(textObjs) {
  let lastBio, lackSutraInBampos = [], firstBampoAhead, errMessages = [];

  textObjs.forEach((textObj) => {
    let {fn, text} = textObj;
    let pb = 'beforePb';

    text.replace(sutraBampoPbRegex, (tag) => {
      if (pbExist(tag)) {
        pb = pbRegex.exec(tag)[1];
        return;
      }

      tagBio = bampoExist(tag) ? analyzeBampo(fn, pb, tag) : analyzeSutra(fn, pb, tag);

      if (lastBio) {
        let {type, fn, pb, tag} =tagBio;
        let {type: lastType, fn: lastFn, pb: lastPb, tag: lastTag} = lastBio;
        let errInfo = lastFn + ' ' + lastPb + ' ' + lastTag + ', ' + fn + ' ' + pb + ' ' + tag;
        checkOrder(errMessages, lastBio, lastType, tagBio, type, firstBampoAhead, errInfo);

        if (lastType === 'bampo' && type === 'sutra') {
          firstBampoAhead = isFirstBampoAhead(lastBio, tagBio);
        }

        if (lackSutraInBampos[0]) {
          if (! firstBampoAhead) {
            warn('There is no sutra tag between bampos!', lackSutraInBampos[0]);
          }
          lackSutraInBampos = [];
        }

        checkBampoOrder(errMessages, lastBio, bio, lackSutraInBampos, errInfo);

        lastBio = tagBio;
      }
      else {
        check1stBio(tagBio);
        lastBio = tagBio;
      }
    });
  });

  reportErr('Wrong Sutra Bampo Order', errMessages);
}

function checkOrder(store, lastBio, lastType, bio, type, firstBampoAhead, errInfo) {
  if (lastType === 'sutra' && type === 'sutra') {
    checkSutraOrder(store, lastBio, bio, errInfo);
  }
  else if (lastType === 'sutra' && type === 'bampo') {
    checkSutra_bampoOrder(store, lastBio, bio, firstBampoAhead, errInfo);
  }
  else if (lastType === 'bampo' && type === 'sutra') {
    checkBampo_sutraOrder(store, lastBio, bio, errInfo);
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
      if (lessNumber(lastSutraL, sutraL) || sameNumber(lastSutraL, sutraL)) {
        store.push('Wrong sutra order! ' + errInfo);
      }
      else {
        if (numberJump(lastSutraL, sutraL)) {
          warn('Sutra is missing! ' + errInfo);
        }
        return true;
      }
    }
  }
  else {
    if (numberAdd1(lastSutraN, sutraN) && sutraL && sutraL !== 'a' && sutraL !== 'A' || numberJump(lastSutraN, sutraN)) {
      warn('Sutra may be missing! ' + errInfo);
    }
    return true;
  }
}

function checkSutra_bampoOrder(store, lastBio, bio, firstBampoAhead, errInfo) {
  let {sutraNL: lastSutraNL, sutraN: lastSutraN, sutraL: lastSutraL} = lastBio;
  let {sutraNL, sutraN, sutraL, bampoN} = bio;
  let sameSutraNL = lastSutraNL === sutraNL;

  if (! sameSutraNL) {
    let correctSutraNL = checkSutraNL_Order(store, lastSutraN, lastSutraL, sutraN, sutraL, errInfo);
    if (correctSutraNL) {
      check1stBampo(bampoN, errInfo);
    }
  }
  else if (firstBampoAhead) {
    check2ndBampo(bampoN, errInfo);
  }
  else {
    check1stBampo(store, bampoN, errInfo);
  }
}

function check1stBampo(bampoN, errInfo) {
  if (1 === bampoN) {
    return true;
  }
  else {
    warn('Bampo n is not 1', errInfo);
  }
}

function check2ndBampo(store, bampoN, errInfo) {
  if (1 === bampoN ) {
    store.push('Repeat bampo n 1', errInfo);
  }
  else if (bampoN !== 2) {
    warn('Bampo n is not 2', errInfo);
  }
}

function checkBampo_sutraOrder(store, lastBio, bio, errInfo) {
  let {sutraN: lastSutraN, sutraL: lastSutraL} = lastBio;
  let {sutraN, sutraL} = bio;

  if (! isFirstBampoAhead(lastBio, bio)) {
    checkSutraNL_Order(store, lastSutraN, lastSutraL, sutraN, sutraL, errInfo);
  }
}

function isFirstBampoAhead(lastBio, bio) {
  let {sutraNL: lastSutraNL, bampoN} = lastBio, {sutraNL} = bio;
  return lastSutraNL === sutraNL && '1' === bampoN;
};

function checkBampoOrder(store, lastBio, bio, lackSutraInBampos, errInfo) {
  let {sutraNL: lastSutraNL, sutraN: lastSutraN, sutraL: lastSutraL, bampoN: lastBampoN} = lastBio;
  let {sutraNL, sutraN, sutraL, bampoN} = bio;
  let sameSutraNL = lastSutraNL === sutraNL;

  if (sameSutraNL) {
    if (bampoN <= lastBampoN) {
      errMessages.push('Wrong bampo order: ' + errInfo);
    }
    else if (numberJump(lastBampoN, bampoN)) {
      warn('Bampo tag might be missing!', errInfo);
    }
  }
  else {
    let correctSutraNL = checkSutraNL_Order(store, lastSutraN, lastSutraL, sutraN, sutraL, errInfo);
    if (correctSutraNL) {
      let bampoNIs1 = check1stBampo(bampoN, errInfo);
      if (bampoNIs1) {
        lackSutraInBampos.push(errInfo);
      }
    }
  }
}

function check1stBio(bio) {
  checkFirstSutraNL(bio.sutraNL);

  if (bio.type === 'bampo') {
    warn('No sutra before first bampo');
    check1stBampo(bio.bampoN, 'from the beginning');
  }
}

function checkFirstSutraNL(sutraNL) {
  if (sutraNL !== '1' && sutraNL !== '1a' && sutraNL !== '1A') {
    warn('Sutra id not start from 1, 1a, or 1A');
  }
}