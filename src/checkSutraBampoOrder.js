const sutraBampoPbRegex = /<(sutra|bampo).+?>|<pb.+?>(?=([\s\S](?!<pb))*?(?=<sutra|<bampo))/g;
const pbRegex = /<pb id="(.+?)"/;

import {pbExist, bampoExist} from './detectTag.js';
import {analyzeSutra, analyzeBampo} from './analyzeTag.js';
import {lessNumber, sameNumber, numberAdd1, numberJump} from './compareNumber.js';
import {warn, reportErr} from './handleErr.js';

export default function checkSutraBampoOrder(textObjs) {
  let lastBio, firstBampoShouldBeAhead, firstBampoAhead, errMessages = [];

  textObjs.forEach((textObj) => {
    let {fn, text} = textObj;
    let pb = 'beforePb';

    text.replace(sutraBampoPbRegex, (tag) => {
      if (pbExist(tag)) {
        pb = pbRegex.exec(tag)[1];
        return;
      }

      let bio = bampoExist(tag) ? analyzeBampo(fn, pb, tag) : analyzeSutra(fn, pb, tag);

      if (! lastBio) {
        check1stBio(bio);
      }
      else {
        let {type: lastType, fn: lastFn, pb: lastPb, tag: lastTag} = lastBio;
        let {type, fn, pb, tag} =bio;
        let errInfo = lastFn + ' ' + lastPb + ' ' + lastTag + ', ' + fn + ' ' + pb + ' ' + tag;

        if (lastType === 'bampo' && type === 'sutra') {
          firstBampoAhead = checkBampo_sutraOrder(errMessages, lastBio, bio, errInfo);
        }

        if (firstBampoShouldBeAhead) {
          if (! firstBampoAhead) {
            warn('Sutra tag may be missing before bampo n 1!', fn, pb, tag);
          }
          firstBampoShouldBeAhead = false;
        }

        if (lastType === 'sutra' && type === 'sutra') {
          checkSutraOrder(errMessages, lastBio, bio, errInfo);
          firstBampoAhead = false;
        }
        else if (lastType === 'sutra' && type === 'bampo') {
          firstBampoShouldBeAhead = checkSutra_bampoOrder(errMessages, lastBio, bio, firstBampoAhead, errInfo);
          firstBampoAhead = false;
        }
        else if (lastType === 'bampo' && type === 'bampo') {
          firstBampoShouldBeAhead = checkBampoOrder(errMessages, lastBio, bio, errInfo);
        }
      }

      lastBio = bio;
    });
  });

  reportErr('Wrong Sutra Bampo Order', errMessages);
}

function check1stBio(bio) {
  check1stSutraNL(bio.sutraNL);

  if (bio.type === 'bampo') {
    warn('No sutra before first bampo');
    if (! bampoNis1) {
      warn('Bampo n is not 1 from the beginning!');
    }
  }
}

function check1stSutraNL(sutraNL) {
  if (sutraNL !== '1' && sutraNL !== '1a' && sutraNL !== '1A') {
    warn('Sutra id not start from 1, 1a, or 1A');
  }
}

function bampoNis1(bampoN) {
  return 1 === bampoN;
}

function checkSutraOrder(store, lastBio, bio, errInfo) {
  let {sutraV: lastSutraV, sutraN: lastSutraN, sutraL: lastSutraL} = lastBio;
  let {sutraV, sutraN, sutraL} = bio;

  if (lastSutraV !== sutraV) {
    store.push('Sutra id not consistent! ' + errInfo);
  }

  checkSutraNL_Order(store, lastSutraN, lastSutraL, sutraN, sutraL, errInfo);
}

function checkSutraNL_Order(lastSutraN, lastSutraL, sutraN, sutraL, errInfo) {
  if (lessNumber(lastSutraN, sutraN)) {
    warn('Wrong sutra order! ' + errInfo);
  }
  else if (sameNumber(lastSutraN, sutraN)) {
    if (! sutraL || ! lastSutraL) {
      warn('Wrong sutra order! ' + errInfo);
    }
    else {
      sutraL = sutraL.charCodeAt(0), lastSutraL = lastSutraL.charCodeAt(0);
      if (lessNumber(lastSutraL, sutraL) || sameNumber(lastSutraL, sutraL)) {
        warn('Wrong sutra order! ' + errInfo);
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
    let correctSutraNL = checkSutraNL_Order(lastSutraN, lastSutraL, sutraN, sutraL, errInfo);
    if (correctSutraNL && bampoNis1(bampoN)) {
      return 'firstBampoShouldBeAhead';
    }
  }
  else if (firstBampoAhead) {
    check2ndBampo(store, bampoN, errInfo);
  }
  else if (! bampoNis1(bampoN)) {
    store.push('Bampo n is not 1 ', errInfo);
  }
}

function check2ndBampo(store, bampoN, errInfo) {
  if (1 === bampoN) {
    store.push('Repeat bampo n 1 ', errInfo);
  }
  else if (bampoN > 2) {
    warn('Bampo may be missing! ', errInfo);
  }
}

function checkBampo_sutraOrder(store, lastBio, bio, errInfo) {
  let {sutraNL: lastSutraNL, sutraN: lastSutraN, sutraL: lastSutraL, bampoN} = lastBio;
  let {sutraNL, sutraN, sutraL} = bio;

  if (! is1stBampoAhead(lastSutraNL, bampoN, sutraNL)) {
    checkSutraNL_Order(store, lastSutraN, lastSutraL, sutraN, sutraL, errInfo);
  }
  else {
    return true;
  }
}

function is1stBampoAhead(lastSutraNL, bampoN, sutraNL) {
  return lastSutraNL === sutraNL && 1 === bampoN;
}

function checkBampoOrder(store, lastBio, bio, errInfo) {
  let {sutraNL: lastSutraNL, sutraN: lastSutraN, sutraL: lastSutraL, bampoN: lastBampoN} = lastBio;
  let {sutraNL, sutraN, sutraL, bampoN} = bio;

  if (lastSutraNL === sutraNL) {
    if (bampoN <= lastBampoN) {
      store.push('Wrong bampo order: ' + errInfo);
    }
    else if (numberJump(lastBampoN, bampoN)) {
      warn('Bampo tag might be missing!', errInfo);
    }
  }
  else {
    let correctSutraNL = checkSutraNL_Order(store, lastSutraN, lastSutraL, sutraN, sutraL, errInfo);
    if (correctSutraNL) {
      if (bampoNis1(bampoN)) {
        return true;
      }
      else {
        warn('Sutra and bampo tag might be missing!', errInfo);
      }
    }
  }
}