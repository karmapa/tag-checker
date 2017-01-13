const repo = process.argv[2];
const globPatt = './' + repo + '*/**/' + repo + '[0-9]*.xml'; 
const pbRegex = /<pb id="\d+?-\d+?-\d+?[abcd]?"\/>/;

import getTextObjs from './getTextObjs';
import checkTagFormat from './checkTagFormat.js';
import checkRepeatPage from './checkRepeatPage.js';
import checkStructure from './checkStructure.js';
import checkVolPbOrder from './checkVolPbOrder.js';
import checkSutraBampoOrder from './checkSutraBampoOrder.js';
import checkHeadN from './checkHead.js';

import {confirmPbInFile} from './helper.js';
import {detectPbType} from './detectTag.js';

checkTag(globPatt);

function checkTag(globPatt) {
  let textObjs = getTextObjs(globPatt);
  let {fn: fn, text: repo1stText} = textObjs[0];

  confirmPbInFile(fn, repo1stText, pbRegex);
  let pbWithSuffix = detectPbType(repo1stText);

  checkTagFormat(textObjs, pbWithSuffix);
  checkRepeatPage(textObjs);
  checkStructure(textObjs);
//  checkVolPbOrder(textObjs);
//  checkSutraBampoOrder(textObjs);
//  checkHeadN(textObjs);
}