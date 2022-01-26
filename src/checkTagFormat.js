import getTagRules from './getTagRules.js';
import {saveErrs, reportErr, warn} from './handleErr.js';
import {confirmPbInFile, countTag} from './helper.js';
import {sameNumber} from './compareNumber.js';

const emptyTagRegex = /<[\s\/]*>/g;
const noEndArrowRegex = /<[^>]*?(<|\n|$)/g;
const noStartArrowRegex = /(^|\n|>)[^<\n]*?>/g;
const undefinedTagRegex = /<(?!(division|vol|head|pb|jp|mp|sutra|bampo|headnote|\/?question_mark|\/?stitle|\/?ttitle|\/?small|d|pedurma|note|\/?s|V|L|D|M|WB|g|graphic|\/?voltext)).+/g;

export default function checkTagFormat(textObjs, pbWithSuffix, looseMode) {
  let errMessages = [];
  let tagRules = getTagRules(pbWithSuffix);
  let pbRegex = tagRules[0].correctRegex;

  textObjs.forEach((textObj) => {
    let {fn, text} = textObj;

    confirmPbInFile(fn, text, pbRegex);

    let emptyTags = text.match(emptyTagRegex) || [];
    let noEndArrows = text.match(noEndArrowRegex) || [];
    let noStartArrows = text.match(noStartArrowRegex) || [];
    let undefinedTags = text.match(undefinedTagRegex) || [];
    let wrongPropFormats = checkPropFormat(fn, text, tagRules);

    if (looseMode) {
      const warningTags = [...emptyTags, ...noEndArrows, ...noStartArrows, ...undefinedTags];

      if (warningTags.length > 0) {
        let warningMessage = warningTags.join('\n');
        warn(`Strange Tag Format:\n${warningMessage}\n${fn}\n`);
      }

      saveErrs(errMessages, [...wrongPropFormats], fn);
    }
    else {
      saveErrs(errMessages, [...emptyTags, ...noEndArrows, ...noStartArrows, ...undefinedTags, ...wrongPropFormats], fn);
    }
  });

  reportErr('Wrong Tag Format', errMessages);
}

function checkPropFormat(fn, text, tagRules) {
  let wrongPropFormats = [];

  tagRules.forEach((tagRule) => {
    let {type, lineWithTagRegex, suspectedRegex, tagNameStrRegex, correctRegex} = tagRule;

    text.replace(lineWithTagRegex, (str) => {
      let suspectedTagsN = countTag(str, suspectedRegex);
      let tagNameStrN = type !== 'division' ? countTag(str, tagNameStrRegex) : countTag(str, tagNameStrRegex) / 2;
      let correctTagsN = countTag(str, correctRegex);

      if (! sameNumber(correctTagsN, suspectedTagsN)) {
        wrongPropFormats.push(type + ': ' + str);
      }
      else if (! sameNumber(correctTagsN, tagNameStrN)) {
        warn('Suspected Wrong ' + type + ' Format', fn, str);
      }
    });
  });
  return wrongPropFormats;
}