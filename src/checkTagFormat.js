import {saveErrs, reportErr} from './handleErr.js';

const repo = process.argv[2];
const emptyTagRegex = /<[\s\/]*>/g;
const noEndArrowRegex = /<[^>]*?(<|\n|$)/g;
const noStartArrowRegex = /(^|\n|>)[^<\n]*?>/g;

let tagRules = [
  {
    type: 'division',
    correctRegex: new RegExp('<division n="(\\d+?)" t="[^<>\n]+?" i18n="' + repo + '-division-\\1"\\/>', 'g'),
    suspectedRegex: /div/g,
    lineWithTagRegex: /^.*?div.*?$/mg
  },
  {
    type: 'vol',
    correctRegex: /<vol n="\d+?" t="[\u0f00-\u0fff]+?"\/>/g,
    suspectedRegex: /vol/g,
    lineWithTagRegex: /^.*?vol.*?$/mg
  },
  {
    type: 'sutra',
    correctRegex: /<sutra id="[\da-zA-Z]*?[a-zA-Z]\d+?[a-zA-Z]?"\/>/g,
    suspectedRegex: /sutra/g,
    lineWithTagRegex: /^.*?sutra.*?$/mg
  },
  {
    type: 'bampo',
    correctRegex: /<bampo n="\d+?[a-zA-Z]?\.\d+?(\.\d+?)?"\/>/g,
    suspectedRegex: /bampo/g,
    lineWithTagRegex: /^.*?bampo.*?$/mg
  },
  {
    type: 'head',
    correctRegex: /<head n="\d+?" t="[\u0f00-\u0fff ]+?"( (type|zh|lv|st)="[^<>\n]+?")*?\/>/g,
    suspectedRegex: /head/g,
    lineWithTagRegex: /^.*?head.*?$/mg
  }
];

export default function checkTagFormat(textObjs) {
  let errMessages = [];
  let pbRule = findPbRule(textObjs[0].text);
  let pbRegex = pbRule.correctRegex;
  tagRules.push(pbRule);

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

function findPbRule(text) {
  let pbWithSuffix = /<(pb|jp) id="\d+?-\d+?-\d+?[abcd]"\/>/.test(text);
  if (pbWithSuffix) {
    return {
      type: '(pb|jp)',
      correctRegex: /<(pb|jp) id="\d+?-\d+?-\d+?[abcd]"\/>/g,
      suspectedRegex: /pb|jp/g,
      lineWithTagRegex: /^.*?(pb|jp).*?$/mg
    };
  }
  else {
    return {
      type: '(pb|jp)',
      correctRegex: /<(pb|jp) id="\d+?-\d+?-\d+?"\/>/g,
      suspectedRegex: /pb|jp/g,
      lineWithTagRegex: /^.*?(pb|jp).*?$/mg
    };
  }
}

function confirmPbInFile(fn, text, pbRegex) {
  if (! pbRegex.test(text)) {
    reportErr('No Pb Tag', [fn]);
  }
}

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