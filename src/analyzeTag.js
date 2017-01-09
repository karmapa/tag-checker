import {
  sutraXIRegex, bampoXIRegex, pb4XIRegex, pbXIRegex, headSIRegex, pbSIRegex, sutraDRegex, pbDRegex
} from './regexs.js';

export function analyzeHead(fn, pb, tag) {
  let bio = headSIRegex.exec(tag);
  return {
    type: 'head',
    fn: fn,
    pb: pb,
    tag: bio[0],
    headN: Number(bio[1])
  };
}

export function analyzePb4(fn, tag) {
  let bio = pb4XIRegex.exec(tag);
  return {
    fn: fn,
    tag: bio[0],
    pbVolN: bio[1],
    vol1n: bio[2],
    vol2n: bio[3],
    pbNL: bio[4],
    pbN: bio[5],
    pbL: bio[6]
  };
}

export function analyzePb(fn, tag) {
  let bio = pbXIRegex.exec(tag);
  return {
    fn: fn,
    tag: bio[0],
    pbVolN: bio[1],
    vol1n: bio[2],
    vol2n: bio[3],
    pbN: bio[4]
  };
}

export function analyzeTag(tag, pb, fn) {
  if (pbDRegex.test(tag)) {
    return {type: 'pb', pb: pbSIRegex.exec(tag)[1]};
  }
  else if (sutraDRegex.test(tag)) {
    return analyzeSutra(tag, pb, fn);
  }
  else {
    return analyzeBampo(tag, pb, fn);
  }
}

function analyzeBampo(tag, pb, fn) {
  let bio = bampoXIRegex.exec(tag);
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
  let bio = sutraXIRegex.exec(tag);
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