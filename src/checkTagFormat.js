const repo = process.argv[2];
const emptyTag = /<[\s\/]*>/g;
const noEndArrow = /<[^>]*?(\n|$)/g;
const noStartArrow = /(^|\n|>)[^<|\n]*>/g;
const nonPbRules = [
  ['division', new RegExp('<division n="(\\d+?)" t=".+?" i18n="' + repo + '-division-\\1"\\/>')],
  ['vol', /<vol n="\d+?-\d+?" t=".+?"\/>/],
  ['sutra', /<sutra id=".+?"( [a-zA-Z]\w+?=".+?")*?\/>/],
  ['bampo', /<bampo n=".+?"( [a-zA-Z]\w+?=".+?")*?\/>/],
  ['head', /<head n="\d+?" t=".+?"( [a-zA-Z]\w+?=".+?")*?\/>/]
];

const pbRules = [
    ['(pb|jp)', /<(pb|jp) id="\d+?-\d+?-\d+?[abcd]"\/>/],
    ['(pb|jp)', /<(pb|jp) id="\d+?-\d+?-\d+?"\/>/]
]

import reportErr from './reportErr.js';

export default function checkTagFormat(textObjs) {
  let errMessages = [];
  let pbLetterSuffixRegex = pbRules[0][1];
  let pbHasLetterSuffix = textObjs[0].text.match(pbLetterSuffixRegex);
  let pbRule = pbHasLetterSuffix ? pbRules[0] : pbRules[1];
  let pbRegex = pbRule[1];
  let tagRules = nonPbRules.concat([pbRule]);

  function saveErr(fn, wrongTags) {
    if (wrongTags.length > 0) {
      errMessages.push(fn + '\n' + wrongTags.join('\n'));
    }
  }

  textObjs.forEach((textObj) => {
    let text = textObj.text;
    let fn = textObj.fn;
    hasPb(text, pbRegex, fn);
    let emptyTags = text.match(emptyTag) || [];
    let noEndArrows = text.match(noEndArrow) || [];
    let noStartArrows = text.match(noStartArrow) || [];
    let wrongPropFormats = checkPropFormat(text, tagRules);
    saveErr(fn, emptyTags.concat(noEndArrows, noStartArrows, wrongPropFormats));
  });

  reportErr('Worng Tag Format', errMessages);
};

function checkPropFormat(text, tagRules) {
  let wrongPropFormats = [];
  tagRules.forEach((tagRule) => {
    let tagType = tagRule[0];
    let findingRegex = new RegExp('^.+?' + tagType + '.+?$', 'gm');
    let correctRegex = tagRule[1];
    text.replace(findingRegex, (str) => {
      if (! str.match(correctRegex)) {
        wrongPropFormats.push(tagType + ': ' + str);
      }
    });
  });
  return wrongPropFormats;
}

function hasPb(text, pbRegex, fn) {
  if (! text.match(pbRegex)) {
    reportErr('No Pb Tag', [fn]);
  }
}