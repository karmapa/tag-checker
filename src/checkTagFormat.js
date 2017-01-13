import getTagRules from './getTagRules.js';
import {saveErrs, reportErr, warn} from './handleErr.js';
import {confirmPbInFile} from './helper.js';
import {sameNumber} from './compareNumber.js';

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
    let wrongPropFormats = checkPropFormat(fn, text, tagRules);
    saveErrs(errMessages, [...emptyTags, ...noEndArrows, ...noStartArrows, ...wrongPropFormats], fn);
  });

  reportErr('Wrong Tag Format', errMessages);
};

function checkPropFormat(fn, text, tagRules) {
  let wrongPropFormats = [];

  tagRules.forEach((tagRule) => {
    let {type, lineWithTagRegex, suspectedRegex, tagNameStrRegex, correctRegex} = tagRule;

    text.replace(lineWithTagRegex, (str) => {
      let suspectedTagsN = (str.match(suspectedRegex) || []).length;
      let tagNameStrN = type !== 'division' ? str.match(tagNameStrRegex).length : str.match(tagNameStrRegex).length / 2;
      let correctTagsN = (str.match(correctRegex) || []).length;

      if (! sameNumber(correctTagsN, suspectedTagsN)) {
        wrongPropFormats.push(type + ': ' + str);
      }
      else if (! sameNumber(correctTagsN, tagNameStrN)) {
        warn('Suspected Wrong Tag Format', fn, str);
      }
    });
  });
  return wrongPropFormats;
}