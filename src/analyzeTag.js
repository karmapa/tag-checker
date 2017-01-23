const volAnalyzeRegex = /<vol n="((\d+?)(-(\d+?))?)"/;
const sutraRegex = /<sutra id="([\da-zA-Z]*?[a-zA-Z])((\d+?)([a-zA-Z])?)"/;
const headAnalyzeRegex = /<head n="(\d+?)" t="(.+?)"/;
const bampoRegex = /<bampo n="((\d+?)([a-zA-Z])?)\.(\d+?)"/;
const pb4AnalyzeRegex = /<pb id="((\d+?)-(\d+?))-((\d+?)([abcd]))"/;
const pbAnalyzeRegex = /<pb id="((\d+?)-(\d+?))-(\d+?)"/;

export function analyzeVol(fn, tagStr) {
  let bio = volAnalyzeRegex.exec(tagStr);
  return {
    fn: fn,
    tag: bio[0],
    volN: bio[1],
    vol1n: Number(bio[2]),
    vol2n: Number(bio[4])
  };
};

export function analyzeSutra(fn, pb, tag) {
  let bio = sutraRegex.exec(tag);
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
};

export function analyzeHead(fn, pb, tag) {
  let bio = headAnalyzeRegex.exec(tag);
  return {
    type: 'head',
    fn: fn,
    pb: pb,
    tag: bio[0],
    headN: Number(bio[1]),
    tName: bio[2]
  };
};

export function analyzeBampo(fn, pb, tag) {
  let bio = bampoRegex.exec(tag);
  return {
    type: 'bampo',
    pb: pb,
    fn: fn,
    tag: bio[0],
    sutraNL: bio[1],
    sutraN: Number(bio[2]),
    sutraL: bio[3],
    bampoN: Number(bio[4])
  };
};

export function analyzePb4(fn, tagStr) {
  let bio = pb4AnalyzeRegex.exec(tagStr);
  return {
    fn: fn,
    tag: bio[0],
    pbVolN: bio[1],
    pbVol1n: Number(bio[2]),
    pbVol2n: Number(bio[3]),
    pbNL: bio[4],
    pbN: Number(bio[5]),
    pbL: bio[6]
  };
};

export function analyzePb(fn, tagStr) {
  let bio = pbAnalyzeRegex.exec(tagStr);
  return {
    fn: fn,
    tag: bio[0],
    pbVolN: bio[1],
    pbVol1n: Number(bio[2]),
    pbVol2n: Number(bio[3]),
    pbN: Number(bio[4])
  };
};