const sutraRegex = /<sutra id="([\da-zA-Z]*?[a-zA-Z])((\d+?)([a-zA-Z])?)"/;
const bampoRegex = /<bampo n="((\d+?)([a-zA-Z])?)\.((\d+?)(\.(\d+?))?)"/;
const pbRegex = /<pb id="(.+?)"/;

export default function analyzeTag(tag, pb, fn) {
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
    sutraN: Number(bio[2]),
    sutraL: bio[3],
    bampoN: bio[4],
    bampo1n: Number(bio[5]),
    bampo2n: Number(bio[7])
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