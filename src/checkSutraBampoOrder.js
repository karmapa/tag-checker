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
    checkSutra_bampoOrder(store, lastBio, bio, firstBampoAhead, errInfo);
  }
  else if (lastType === 'bampo' && type === 'sutra') {
    checkBampo_sutraOrder(store, lastBio, bio, errInfo);
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
    if (numberAdd1(lastSutraN, sutraN) && sutraL && sutraL !== 'a' || numberJump(lastSutraN, sutraN)) {
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
    check1stBampoN(store, bampoN, errInfo);
  }
}

function check1stBampo(bampoN, errInfo) {
  if (bampoN !== 1) {
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