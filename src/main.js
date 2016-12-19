const repo = process.argv[2];
const globPatt = './' + repo + '*/**/' + repo + '[0-9]*.xml'; 

import getTextObjs from './getTextObjs';
import checkTagFormat from './checkTagFormat';

checkTag(globPatt);

async function checkTag(globPatt) {
  let textObjs = await getTextObjs(globPatt);
  checkTagFormat(textObjs);
}