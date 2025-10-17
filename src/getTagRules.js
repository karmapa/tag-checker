const repo = process.argv[2];
const sutraVsets = {
  // kangyur
  'jiangkangyur': 'J',
  'degekangyur': 'd',
  'lhasakangyur': 'h',
  'conekangyur': 'C',
  'urgakangyur': 'U',
  'narthangkangyur': 'N',
  'pekingkangyur': 'P',
  'qianlong': 'Q',
  'koreakangyur': 'KO',
  // tengyur
  'degetengyur': 'D',
  'pedurmatengyur': 'BT',
  // བཀའ་བརྒྱུད་པ།
  'tilopa': 'TILO',
  'naropa': 'NARO',
  'marpa': 'MARPA',
  'milarepa': 'MILA',
  '1stkarmapa': '1KM',
  '2ndkarmapa': '2KM',
  '7thkarmapa': '7KM',
  '8thkarmapa': '8KM',
  'padkar': 'PK',
  'gampopa': 'GM',
  // kamtshang
  'kamtshangnamthar': 'kamtshangnamthar',
  'kamtshangmithrugpa': 'kamtshangmithrugpa',
  'kamtshanggampopa': 'kamtshanggampopa',
  'kamtshanggarchen': 'kamtshanggarchen',
  'kamtshangchagchen': 'kamtshangchagchen',
  'kamtshangnyengyud': 'kamtshangnyengyud',
  'kamtshangrimnyi': 'kamtshangrimnyi',
  'kamtshangbarava': 'kamtshangbarava',
  'kamtshanglogtripala': 'kamtshanglogtripala',
  'kamtshangzogchen': 'kamtshangzogchen',
  'kamtshangbuton': 'kamtshangbuton',
  'kamtshangngawangdragpa': 'kamtshangngawangdragpa',
  'kamtshangnaroyoga': 'kamtshangnaroyoga',
  'kamtshangpaworinpoche': 'kamtshangpaworinpoche',
  'kamtshangtsurphujamyang': 'kamtshangtsurphujamyang',
  'kamtshang3rdkarmapa': 'kamtshang3rdkarmapa',
  'kamtshangtsewangyal': 'kamtshangtsewangyal',
  'kamtshanggolotsawa': 'kamtshanggolotsawa',
  'kamtshanggzhanfenwangpo': 'kamtshanggzhanfenwangpo',
  'kamtshangthorbu': 'kamtshangthorbu',
  'kamtshangupamarton': 'kamtshangupamarton',
  'kamtshanggzhonuhoe': 'kamtshanggzhonuhoe',
  'kamtshangzabmonangdon': 'kamtshangzabmonangdon',
  'kamtshangkontsek': 'kamtshangkontsek',
  // sakya ས་སྐྱ།
  // 1-5
  'sonamgyaltsen': 'SG',
  'sakyalotsawa': 'SL',
  'dragpagyaltsen': 'KD',
  'ngawangkungasonam': 'ANK',
  'ngawangkungalodroe': 'NKL',
  // 6-10
  'goekhugpalhatse': 'GK',
  'chomdenrigral': 'RR',
  'panglotsalodrotenpa': 'PL',
  'zhonnulodroe': 'RD',
  'rongtonsakyagyaltsen': 'RSG',
  // 11-15
  'gyaltsabje': 'GJ',
  'tagtsanglotsawa': 'TL',
  'ludrubgyatso': 'LG',
  'ngorkhenpaldon': 'NPD',
  'sangyephuntsok': 'SP',
  // 16-20
  'ngawanglegpa': 'NL', //
  'kungatenpaigyaltsen': 'JTG', //
  'sakyapalamabiographies': 'NT',
  'earlysakyapamasters': 'KH',
  'earlysakyapatantras': 'KHG',
  // 21-26
  'earlysakyapamastertantras': 'KHN',
  'tsarchenlosalgyamtso': 'TSR',
  'shangpakagyud': 'NG',
  'sakyapatantracollection': 'GT',
  'greatsixsutras': 'Ztsa',
  'mindtrainingsutras': 'LJ',
  // others
  'gorampa': 'GR',
  'shakyachogden': 'skc',
  // 寧瑪
  'longchenpa': 'LCR',
  'mipam': 'MP',
  // 格魯
  'tsongkhapa': 'JTs',
  // 'gyaltsabje': 'GJ', 和薩迦派重複
  'khedrupje': 'KDJ',
  'dalailamasungbum': 'DL',
  //
  'bonpokangyur': 'Bon',
  'chodrapal': 'JCP',
  'choglenamgyal': 'JCN',
  'dolpopa': 'JDol',
  'gharungpa': 'JGLG',
  'lodropal': 'JLP',
  'logrosgragspa': 'JNLD',
  'matipanchen': 'JSMP',
  'nyadbonkungapal': 'JNKP',
  'sonamgragpa': 'JZSD',
  'taranatha': 'JT',
  'thugsrjebrtsongrus': 'JKTT',
  'tshalminpa': 'JTSZ',
  'yeshegyatsho': 'JKYG',
  'yontenbzangpo': 'JNYZ',
  'terdzo': 'TD',
  "bshadmdzod": "AK",
  // 法王外文書
  'buddisttextchinesemordentranslation': 'buddisttextchinesemordentranslation',
  'mbas': 'mbas',
  'fgbt': 'fgbt',
  'gjbs': 'gjbs',
  'wbs': 'wbs',
  'sbea': 'sbea',
  'sbeb': 'sbeb',
  'sbec': 'sbec',
  'ebmfs': 'ebmfs',
  'chi': 'chi',
  'fpvo': 'fpvo',
  'ktis': 'ktis',
  'imw': 'imw',
  'tfmt': 'tfmt',
  'tgtrwr': 'tgtrwr',
  'tta': 'tta',
  'dvpt': 'dvpt',
  'twhrlb': 'twhrlb',
  'vsczh': 'vsczh',
  'bcsb': 'bcsb',
  'ohbs': 'ohbs',
  'cbv': 'cbv',
  'tltk': 'tltk',
  'aseb': 'aseb',
  'bva': 'bva',
  'ate': 'ate',
  'opeb': 'opeb',
  'thdeb': 'thdeb',
  'baodv': 'baodv',
  'trew': 'trew',
  'bad': 'bad',
  'sls': 'sls',
  'emss': 'emss',
  'pdb': 'pdb',
  'svs': 'svs',
  'smnbb': 'smnbb',
  'fwhk': 'fwhk',
  'gbs': 'gbs',
  'gsne': 'gsne'
};

const sutraV = sutraVsets[repo];

let tagRules = [
  {
    type: 'pb',
    correctRegex: /^<pb id="\d+?-(\d+?-)?\d+?[abcdef]?"\/>$/mg,
    suspectedRegex: /<pb /g,
    tagNameStrRegex: /pb/g,
    lineWithTagRegex: /^.*?pb.*$/mg
  },
  {
    type: 'jp',
    correctRegex: /<jp id="\d+?-\d+?-\d+?[abcd]"\/>/g,
    suspectedRegex: /<jp /g,
    tagNameStrRegex: /jp/g,
    lineWithTagRegex: /^.*?jp.*$/mg
  },
  {
    type: 'division',
    correctRegex: new RegExp('<division n="(\\d+?)(\\.\\d+?)?" t="[^"<>\n]+?"( (bo|en|tw|cn)="[^"<>\n]+?")*?( i18n="' + repo + '-division-\\d+")?\\/>', 'g'),
    suspectedRegex: /<division /g,
    tagNameStrRegex: /division/g,
    lineWithTagRegex: /^.*?division.*$/mg
  },
  {
    type: 'vol',
    correctRegex: /<vol n="\d+?(-\d+?)?"( (t|bo|en|tw|cn)="[^"<>\n]*?")+?\/>/g,
    suspectedRegex: /<vol /g,
    tagNameStrRegex: /vol(?!text|cover|toc)/g,
    lineWithTagRegex: /^.*?vol.*$/mg
  },
  {
    type: 'sutra',
    correctRegex: new RegExp(`<sutra id="${sutraV}\\d+?[a-zA-Z]?"( (t|bo|en|tw|cn)="[^"<>\n]*?")*\\/>`, 'g'),
    suspectedRegex: /<sutra /g,
    tagNameStrRegex: /sutra/g,
    lineWithTagRegex: /^.*?sutra.*$/mg
  },
  {
    type: 'bampo',
    correctRegex: /<bampo n="\d+?[a-zA-Z]?\.\d+?"( (t|bo|en|tw|cn|zh)="[^"<>\n]*?")*\/>/g,
    suspectedRegex: /<bampo /g,
    tagNameStrRegex: /bampo/g,
    lineWithTagRegex: /^.*?bampo.*$/mg
  },
  {
    type: 'head',
    correctRegex: /<head( n="\d+?"| (t|type|zh|lv|st|ct|tid|sff|bo|en|tw|cn|skip)="[^"<>\n]*?")+?\/>/g,
    suspectedRegex: /<head /g,
    tagNameStrRegex: /head(?!note)/g,
    lineWithTagRegex: /^.*?head.*$/mg
  },
  {
    type: 'voltext',
    correctRegex: /<voltext( (t|bo|en|tw|cn|type|id)="[^"<>\n]*?")*?\/?>|<\/voltext>|<voltext\/>/g,
    suspectedRegex: /<voltext |<\/voltext>|<voltext\/>/g,
    tagNameStrRegex: /voltext/g,
    lineWithTagRegex: /^.*?voltext.*$/mg
  }
];

export default function getTagRules(pbWithSuffix) {
  if (! pbWithSuffix) {
    tagRules[0].correctRegex = /<(pb|jp) id="\d+?-(\d+?-)?\d+?"\/>/g;
  }
  return tagRules;
}
