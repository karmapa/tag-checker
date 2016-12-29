const sutraBampoPbRegex = /<(sutra|bampo).+?>|<pb.+?>(?=([\s\S](?!<pb))*?(?=<sutra|<bampo))/g;
const sutraRegex = /<sutra id="([\da-zA-Z]*?[a-zA-Z])((\d+?)([a-zA-Z])?)"/;
const bampoRegex = /<bampo n="([\da-zA-Z]+?)\.(\d+?)(\.(\d+?))?"/;
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
  console.log(tagBio);
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
    bampo1n: bio[2],
    bampo2n: bio[4]
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