const volAnalyzeRegex = /<vol n="((\d+?)(-(\d+?))?)"/;
const sutraRegex = /<sutra id="[\da-zA-Z]*?[a-zA-Z]((\d+?)([a-zA-Z])?)"/;
const headAnalyzeRegex = /<head n="(\d+?)" (t|bo|tw|en|cn)="(.+?)"/;
const bampoRegex = /<bampo n="((\d+?)([a-zA-Z])?)\.(\d+?)"/;
const pb4AnalyzeRegex = /<pb id="((\d+?)-?(\d+?)?)-((\d+?)([abcd]))"/;
const pbAnalyzeRegex = /<pb id="((\d+?)-?(\d+?)?)-(\d+?)"/;

export function analyzeVol(fn, tagStr) {
  let volBio = volAnalyzeRegex.exec(tagStr);
  return {
    fn: fn,
    tag: volBio[0],
    volN: volBio[1],
    vol1n: Number(volBio[2]),
    vol2n: Number(volBio[4])
  };
}

export function analyzeSutra(fn, pb, tag) {
  let sutraBio = sutraRegex.exec(tag);
  return {
    type: 'sutra',
    pb: pb,
    fn: fn,
    tag: sutraBio[0],
    sutraNL: sutraBio[1],
    sutraN: Number(sutraBio[2]),
    sutraL: sutraBio[3]
  }
}

export function analyzeHead(fn, pb, tag) {
  let headBio = headAnalyzeRegex.exec(tag);
  return {
    type: 'head',
    fn: fn,
    pb: pb,
    tag: headBio[0],
    headN: Number(headBio[1]),
    tName: headBio[2]
  };
}

export function analyzeBampo(fn, pb, tag) {
  let bampoBio = bampoRegex.exec(tag);
  return {
    type: 'bampo',
    pb: pb,
    fn: fn,
    tag: bampoBio[0],
    sutraNL: bampoBio[1],
    sutraN: Number(bampoBio[2]),
    sutraL: bampoBio[3],
    bampoN: Number(bampoBio[4])
  };
}

export function analyzePb4(fn, tagStr) {
  let pb4Bio = pb4AnalyzeRegex.exec(tagStr);
  return {
    fn: fn,
    tag: pb4Bio[0],
    pbVolN: pb4Bio[1],
    pbVol1n: Number(pb4Bio[2]),
    pbVol2n: pb4Bio[3] ? Number(pb4Bio[3]) : 1,
    pbNL: pb4Bio[4],
    pbN: Number(pb4Bio[5]),
    pbL: pb4Bio[6]
  };
}

export function analyzePb(fn, tagStr) {
  let pbBio = pbAnalyzeRegex.exec(tagStr);
  return {
    fn: fn,
    tag: pbBio[0],
    pbVolN: pbBio[1],
    pbVol1n: Number(pbBio[2]),
    pbVol2n: pbBio[3] ? Number(pbBio[3]) : 1,
    pbN: Number(pbBio[4])
  };
}