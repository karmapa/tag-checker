const sutraBampoPbRegex = /<(sutra|bampo).+?>|<pb.+?>(?=([\s\S](?!<pb))*?(?=<sutra|<bampo))/g;
const sutraRegex = /<sutra id="([\da-zA-Z]*?[a-zA-Z])((\d+?)([a-zA-Z])?)"/;
const bampoRegex = /<bampo n="([\da-zA-Z]+?)\.((\d+?)(\.(\d+?))?)"/;
const pbRegex = /<pb id="(.+?)"/;

export default function checkSutraBampoOrder(textObjs) {
  let lastBio;

  textObjs.forEach((textObj) => {
    let pb = 'beforePb', fn = textObj.fileName;

    textObj.text.replace(sutraBampoPbRegex, (tag) => {
      let tagBio = analyzeTag(tag, pb, fn);

      if (tagBio.type === 'pb') {
        pb = tagBio.pb;
      }
      else {
        checkOrder(lastBio, tagBio);
        lastBio = tagBio;
      }
    });
  });
}

function checkOrder(lastBio, tagBio) {
  if (lastBio) {

  }
  else {
    checkFirstBio(tagBio);
  }
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
    sutraNL: bio[1],
    bampoN: bio[2],
    bampo1n: bio[3],
    bampo2n: bio[5]
  }
}

function analyzeSutra(tag, pb, fn) {
  let bio = tag.match(sutraRegex);
  return {
    type: 'sutra',
    pb: pb,
    fn: fn,
    sutraV: bio[1],
    sutraNL: bio[2],
    sutraN: bio[3],
    sutraL: bio[4]
  }
}