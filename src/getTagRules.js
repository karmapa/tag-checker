const repo = process.argv[2];

let tagRules = [
  {
    type: 'division',
    correctRegex: new RegExp('<division n="(\\d+?)" t="[^<>\n]+?" i18n="' + repo + '-division-\\1"\\/>', 'g'),
    suspectedRegex: /division/g,
    lineWithTagRegex: /^.*?division.*?$/mg
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

let pbRules = {
  pb4Rule: {
    type: '(pb|jp)',
    correctRegex: /<(pb|jp) id="\d+?-\d+?-\d+?[abcd]"\/>/g,
    suspectedRegex: /pb|jp/g,
    lineWithTagRegex: /^.*?(pb|jp).*?$/mg
  },
  pbRule: {
    type: '(pb|jp)',
    correctRegex: /<(pb|jp) id="\d+?-\d+?-\d+?"\/>/g,
    suspectedRegex: /pb|jp/g,
    lineWithTagRegex: /^.*?(pb|jp).*?$/mg
  }
};

export default function getTagRules(pbWithSuffix) {
  if (pbWithSuffix) {
    return tagRules.push(pbRules.pb4Rule);
  }
  return tagRules.push(pbRules.pbRule);
};