const repo = process.argv[2];
const globPatt = './' + repo + '*/**/' + repo + '[0-9]*.xml'; 

import getTextObjs from './getTextObjs';

checkTag(globPatt);

async function checkTag(globPatt) {
  let textObjs = await getTextObjs(globPatt);
  console.log(textObjs[0].fileName);
}