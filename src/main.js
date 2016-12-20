const repo = process.argv[2];
const globPatt = './' + repo + '*/**/' + repo + '[0-9]*.xml'; 

import getTextObjs from './getTextObjs';
import checkTagFormat from './checkTagFormat.js';
import checkRepeatPage from './checkRepeatPage.js';

checkTag(globPatt);

function checkTag(globPatt) {
  let textObjs = getTextObjs(globPatt);
  checkTagFormat(textObjs);
  checkRepeatPage(textObjs);
}