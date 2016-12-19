const repo = process.argv[2];
const globPatt = './' + repo + '*/**/' + repo + '[0-9]*.xml'; 

import getTexts from './getTexts';

checkTag(globPatt);

async function checkTag(globPatt) {
  let texts = await getTexts(globPatt);
  console.log(texts[0].fileName);
}