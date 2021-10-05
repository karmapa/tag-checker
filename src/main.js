const repo = process.argv[2];
const globPatt = './' + repo + '*/**/' + repo + '[0-9]*.xml';
const pbRegex = /<pb id="\d+?-(\d+?-)?\d+?[abcd]?"\/>/;

import getTextObjs from './getTextObjs';
import checkTagFormat from './checkTagFormat.js';
import checkRepeatPage from './checkRepeatPage.js';
import checkStructure from './checkStructure.js';
import checkVolOrder from './checkVolOrder.js';
import checkPbOrder from './checkPbOrder.js';
import checkSutraBampoOrder from './checkSutraBampoOrder.js';
import checkHeadN from './checkHead.js';

import {confirmPbInFile} from './helper.js';
import {detectPbType} from './detectTag.js';

checkTag();

function checkTag() {
  let textObjs = getTextObjs(globPatt, repo);
  let {fn: fn, text: repo1stText} = textObjs[0];

  confirmPbInFile(fn, repo1stText, pbRegex);
  let pbWithSuffix = detectPbType(repo1stText);

  let shoudUseLooseMode = false;
  if (-1 !== ['taranatha'].indexOf(repo)) {
    shoudUseLooseMode = true;
  }
  checkTagFormat(textObjs, pbWithSuffix, shoudUseLooseMode);
  checkRepeatPage(textObjs);
  checkStructure(textObjs);
  checkVolOrder(textObjs);
  checkPbOrder(textObjs, pbWithSuffix);
  checkSutraBampoOrder(textObjs);
  checkHeadN(textObjs);
}