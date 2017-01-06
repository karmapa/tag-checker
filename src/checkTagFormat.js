import *  as regexs from './regexs.js';
import reportErr from './reportErr.js';

// cR correct regex, DgR global detect regex, LDR line detect regex
const tagRules = [
  {type: 'division', cR: regexs.divXWgRegex, DgR: regexs.divDgRegex, LDR: regexs.divLDRegex},
  {type: 'vol', cR: regexs.volXWgRegex, DgR: regexs.volDgRegex, LDR: regexs.volLDRegex},
  {type: 'sutra', cR: regexs.sutraXWgRegex, DgR: regexs.sutraDgRegex, LDR: regexs.sutraLDRegex},
  {type: 'bampo', cR: regexs.bampoXWgRegex, DgR: regexs.bampoDgRegex, LDR: regexs.bampoLDRegex},
  {type: 'head', cR: regexs.headXWgRegex, DgR: regexs.headDgRegex, LDR: regexs.headLDRegex}
];

export default function checkTagFormat(textObjs) {
  let errMessages = [];
  let pbRule = findPbRule(textObjs[0].text);
  let pbRegex = pbRule.cR;
  tagRules.push(pbRule);

  function saveErr(fn, wrongTags) {
    if (wrongTags.length > 0) {
      errMessages.push(fn + '\n' + wrongTags.join('\n'));
    }
  }

  textObjs.forEach((textObj) => {
    let {fn, text} = textObj;

    confirmPbInFile(fn, text, pbRegex);

    let emptyTags = text.match(regexs.emptyTag) || [];
    let noEndArrows = text.match(regexs.noEndArrow) || [];
    let noStartArrows = text.match(regexs.noStartArrow) || [];
    let wrongPropFormats = checkPropFormat(text, tagRules);
    saveErr(fn, emptyTags.concat(noEndArrows, noStartArrows, wrongPropFormats));
  });

  reportErr('Worng Tag Format', errMessages);
};

function findPbRule(text) {
  let jpbLetterSuffixRegex = regexs.jpb4XWRegex;
  let pbHasLetterSuffix = jpbLetterSuffixRegex.test(text);
  if (pbHasLetterSuffix) {
    return {type: '(pb|jp)', cR: regexs.jpb4XWgRegex, DgR: regexs.jpbDgRegex, LDR: regexs.jpbLDRegex};
  }
  else {
    return {type: '(pb|jp)', cR: regexs.jpbXWgRegex, DgR: regexs.jpbDgRegex, LDR: regexs.jpbLDRegex};
  }
}

function checkPropFormat(text, tagRules) {
  let wrongPropFormats = [];

  tagRules.forEach((tagRule) => {
    let {type, cR, LDR, DgR} = tagRule;

    text.replace(LDR, (str) => {
      let suspectedTagsN = type !== 'division' ? str.match(DgR).length : str.match(DgR).length / 2;
      let correctTags = str.match(cR);
      if (! correctTags || correctTags.length !== suspectedTagsN) {
        wrongPropFormats.push(type + ': ' + str);
      }
    });
  });
  return wrongPropFormats;
}

function confirmPbInFile(fn, text, pbRegex) {
  if (! pbRegex.test(text)) {
    reportErr('No Pb Tag', [fn]);
  }
}