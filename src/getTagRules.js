const repo = process.argv[2];

let tagRules = [
  {
    type: '(pb|jp)',
    correctRegex: /<(pb|jp) id="\d+?-\d+?-\d+?[abcd]"\/>/g,
    suspectedRegex: /<(pb|jp)/g,
    tagNameStrRegex: /pb|jp/g,
    lineWithTagRegex: /^.*?(pb|jp).*?$/mg
  },
  {
    type: 'division',
    correctRegex: new RegExp('<division n="(\\d+?)" t="[^<>\n]+?" i18n="' + repo + '-division-\\1"\\/>', 'g'),
    suspectedRegex: /<division/g,
    tagNameStrRegex: /division/g,  
    lineWithTagRegex: /^.*?division.*?$/mg
  },
  {
    type: 'vol',
    correctRegex: /<vol n="\d+?" t="[\u0f00-\u0fff]+?"\/>/g,
    suspectedRegex: /<vol/g,
    tagNameStrRegex: /vol/g,
    lineWithTagRegex: /^.*?vol.*?$/mg
  },
  {
    type: 'sutra',
    correctRegex: /<sutra id="[\da-zA-Z]*?[a-zA-Z]\d+?[a-zA-Z]?"\/>/g,
    suspectedRegex: /<sutra/g,
    tagNameStrRegex: /sutra/g,
    lineWithTagRegex: /^.*?sutra.*?$/mg
  },
  {
    type: 'bampo',
    correctRegex: /<bampo n="\d+?[a-zA-Z]?\.\d+?"( zh="[^<>\n]+?")*?\/>/g,
    suspectedRegex: /<bampo/g,
    tagNameStrRegex: /bampo/g,
    lineWithTagRegex: /^.*?bampo.*?$/mg
  },
  {
    type: 'head',
    correctRegex: /<head n="\d+?" t="[\u0f00-\u0fff ()]+?[།གཀ]"( (type|zh|lv|st)="[^<>\n]+?")*?\/>/g,
    suspectedRegex: /<head/g,
    tagNameStrRegex: /head/g,
    lineWithTagRegex: /^.*?head.*?$/mg
  }
];

export default function getTagRules(pbWithSuffix) {
  if (! pbWithSuffix) {
    tagRules[0].correctRegex = /<(pb|jp) id="\d+?-\d+?-\d+?"\/>/g;
  }
  return tagRules;
};