import glob from 'glob';
import fs from 'fs';
import nSort from 'javascript-natural-sort';

export default function getTextObjs(globPat, repo) {
  let rootRegex = new RegExp('\\.[\\\\/]' + repo + '[\\\\/]');
  return glob.sync(globPat)
    .sort(nSort)
    .map((route) => {
      let fileName = route.replace(rootRegex, '');
      let text = fs.readFileSync(route, 'utf8');

      text = text.replace(/<\/?(translator|reviser|note|tr|tempnote|add|extra|pr)( [^>]*?)?\/?>/g, '');

      return {fn: fileName, text: text};
    });
};