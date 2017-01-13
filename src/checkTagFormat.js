import getTagRules from './getTagRules.js';
import {saveErrs, reportErr} from './handleErr.js';

const emptyTagRegex = /<[\s\/]*>/g;
const noEndArrowRegex = /<[^>]*?(<|\n|$)/g;
const noStartArrowRegex = /(^|\n|>)[^<\n]*?>/g;

export default function checkTagFormat(textObjs, pbWithSuffix) {
  let errMessages = [];
  let tagRules = getTagRules(pbWithSuffix);
  let pbRegex = tagRules[0].correctRegex;

  textObjs.forEach((textObj) => {
    let {fn, text} = textObj;

    confirmPbInFile(fn, text, pbRegex);

    let emptyTags = text.match(emptyTagRegex) || [];
    let noEndArrows = text.match(noEndArrowRegex) || [];
    let noStartArrows = text.match(noStartArrowRegex) || [];
    let wrongPropFormats = checkPropFormat(text, tagRules);
    saveErrs(errMessages, [...emptyTags, ...noEndArrows, ...noStartArrows, ...wrongPropFormats], fn);
  });

  reportErr('Worng Tag Format', errMessages);
};

function confirmPbInFile(fn, text, pbRegex) {
  if (! pbRegex.test(text)) {
    reportErr('No Pb Tag', [fn]);
  }
};

function checkPropFormat(text, tagRules) {
  let wrongPropFormats = [];

  tagRules.forEach((tagRule) => {
    let {type, lineWithTagRegex, suspectedRegex, correctRegex} = tagRule;

    text.replace(lineWithTagRegex, (str) => {
      let suspectedTagsN = type !== 'division' ? str.match(suspectedRegex).length : str.match(suspectedRegex).length / 2;
      let correctTagsN = (str.match(correctRegex) || []).length;
      if (correctTagsN !== suspectedTagsN) {
        wrongPropFormats.push(type + ': ' + str);
      }
    });
  });
  return wrongPropFormats;
}