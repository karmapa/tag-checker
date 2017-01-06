import {
  sutraXIRegex, bampoXIRegex, headSIRegex, pbSIRegex, sutraDRegex, pbDRegex
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