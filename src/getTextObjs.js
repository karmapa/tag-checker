import glob from 'glob';
import Path from 'path';
import fs from 'fs';
import nSort from 'javascript-natural-sort';

export default function getTextObjs(globPat) {
  return glob.sync(globPat)
    .sort(nSort)
    .map((route) => {
      let fileName = Path.basename(route);
      let text = fs.readFileSync(route, 'utf8');
      return {fn: fileName, text: text};
    });
};