const repo = process.argv[2];
const emptyTag = /<[\s\/]*>/g;
const noEndArrow = /<[^>]*?(\n|$)/g;
const noStartArrow = /(^|\n|>)[^<|\n]*>/g;
const tagRegexs = [
  ['division', new RegExp('<division n="(\\d+?)" t=".+?" i18n="' + repo + '-division-\\1"\\/>')],
  ['vol', /<vol n="\d+?-\d+?" t=".+?"\/>/],
  ['sutra', /<sutra id=".+?"\/>/],
  ['bampo', /<bampo n=".+?"( \w+?=".+?")*?\/>/],
  ['head', /<head n="\d+?" t=".+?"( \w+?=".+?")*?\/>/],
  ['(pb|jp)', /<(pb|jp) id="\d+?-\d+?-\d+?[a-d]?"\/>/]
];

import reportErr from './reportErr.js';

export default function checkTagFormat(textObjs) {
  let errMessages = [];

  function saveErr(fileName, wrongTags) {
    if (wrongTags.length > 0) {
      errMessages.push(fileName + '\n' + wrongTags.join('\n'));
    }
  }

  textObjs.forEach((textObj) => {
    let text = textObj.text;
    let fileName = textObj.fileName;
    let emptyTags = text.match(emptyTag) || [];
    let noEndArrows = text.match(noEndArrow) || [];
    let noStartArrows = text.match(noStartArrow) || [];
    let wrongTagContents = checkTagContent(text);
    saveErr(fileName, emptyTags.concat(noEndArrows).concat(noStartArrows).concat(wrongTagContents));
  });

  reportErr('Worng Tag Format', errMessages);
};

function checkTagContent(text) {
  let wrongTagContents = [];
  tagRegexs.forEach((tagRegex) => {
    let tagType = tagRegex[0];
    let findingRegex = new RegExp('^.+?' + tagType + '.+?$', 'gm');
    let correctRegex = tagRegex[1];
    text.replace(findingRegex, (str) => {
      if (! str.match(correctRegex)) {
        wrongTagContents.push(tagType + ': ' + str);
      }
    });
  });
  return wrongTagContents;
}