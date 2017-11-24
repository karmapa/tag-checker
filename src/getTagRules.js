const repo = process.argv[2];
const sutraVsets ={
  'jiangkangyur': 'J',
  'degekangyur': 'd',
  'degetengyur': 'DT',
  '8thkarmapa': '8KM',
  'gampopa': 'GM',
  'gorampa': 'GR',
  'mipam': 'MP',
  'tsongkhapa': 'JTs',
  'lhasakangyur': 'h'
};

const sutraV = sutraVsets[repo];

let tagRules = [
  {
    type: 'pb',
    correctRegex: /^<pb id="\d+?-\d+?-\d+?[abcd]"\/>$/mg,
    suspectedRegex: /<pb /g,
    tagNameStrRegex: /pb/g,
    lineWithTagRegex: /^.*?pb.*?$/mg
  },
  {
    type: 'jp',
    correctRegex: /<jp id="\d+?-\d+?-\d+?[abcd]"\/>/g,
    suspectedRegex: /<jp /g,
    tagNameStrRegex: /jp/g,
    lineWithTagRegex: /^.*?jp.*?$/mg
  },
  {
    type: 'division',
    correctRegex: new RegExp('<division n="(\\d+?)" t="[^"<>\n]+?" i18n="' + repo + '-division-\\1"\\/>', 'g'),
    suspectedRegex: /<division /g,
    tagNameStrRegex: /division/g,  
    lineWithTagRegex: /^.*?division.*?$/mg
  },
  {
    type: 'vol',
    correctRegex: /<vol n="\d+?(-\d+?)?" t="[\u0f00-\u0fff]+?"\/>/g,
    suspectedRegex: /<vol /g,
    tagNameStrRegex: /vol/g,
    lineWithTagRegex: /^.*?vol.*?$/mg
  },
  {
    type: 'sutra',
    correctRegex: new RegExp(`<sutra id="${sutraV}\\d+?[a-zA-Z]?"\\/>`, 'g'),
    suspectedRegex: /<sutra /g,
    tagNameStrRegex: /sutra/g,
    lineWithTagRegex: /^.*?sutra.*?$/mg
  },
  {
    type: 'bampo',
    correctRegex: /<bampo n="\d+?[a-zA-Z]?\.\d+?"( zh="[^"<>\n]+?")*?\/>/g,
    suspectedRegex: /<bampo /g,
    tagNameStrRegex: /bampo/g,
    lineWithTagRegex: /^.*?bampo.*?$/mg
  },
  {
    type: 'head',
    correctRegex: /<head n="\d+?" t="[^"<>\n]+?"( (type|zh|lv|st|ct|tid|sff)="[^"<>\n]+?")*?\/>/g,
    suspectedRegex: /<head /g,
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