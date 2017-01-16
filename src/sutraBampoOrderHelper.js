export function isFirstBampoAhead(lastBio, bio) {
  let {sutraNL: lastSutraNL, bampoN} = lastBio, {sutraNL} = bio;
  return lastSutraNL === sutraNL && (bampoN === '1' || bampoN === '1.1');
};

export function checkFirstBampoN(bampoN, errInfo = '') {
  if (bampoN !== '1' && bampoN !== '1.1') {
    console.log('Warning! Bampo n is not 1 or 1.1', errInfo);
  }
};

export function checkSutraNL_Order(store, lastSutraN, lastSutraL, sutraN, sutraL, errInfo) {
  if (sutraN - 1 === lastSutraN) {
    return errMessages;
  }

  if (lastSutraN > sutraN) {
    errMessages.push('Wrong sutra order! ' + errInfo);
  }
  else if (sutraN - lastSutraN > 1) {
    console.log('Warning! Sutra is missing! ' + errInfo);
  }
  else if (sutraN === lastSutraN) {
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
};