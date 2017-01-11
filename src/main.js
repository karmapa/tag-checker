const repo = process.argv[2];
const globPatt = './' + repo + '*/**/' + repo + '[0-9]*.xml'; 

import getTextObjs from './getTextObjs';
import checkTagFormat from './checkTagFormat.js';
import checkRepeatPage from './checkRepeatPage.js';
//import checkStructure from './checkStructure.js';
//import checkVolPbOrder from './checkVolPbOrder.js';
//import checkSutraBampoOrder from './checkSutraBampoOrder.js';
//import checkHeadN from './checkHead.js';

checkTag(globPatt);

function checkTag(globPatt) {
  let textObjs = getTextObjs(globPatt);
  checkTagFormat(textObjs);
  checkRepeatPage(textObjs);
  //checkStructure(textObjs);
  //checkVolPbOrder(textObjs);
  //checkSutraBampoOrder(textObjs);
  //checkHeadN(textObjs);
}