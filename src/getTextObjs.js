import glob from 'glob';
import Path from 'path';
import fs from 'fs';
import nSort from 'javascript-natural-sort';

export default async function getTextObjs(globPat) {
  let textObjs = [];

  let routes = await new Promise((resolve) => {
    glob(globPat, (err, routes) => {
      resolve(routes.sort(nSort));
    });
  });

  for (let i = 0; i < routes.length; i++) {
    let route = routes[i];
    let fileName = Path.basename(route);

    let textObj = await new Promise((resolve) => {
      fs.readFile(route, 'utf8', (err, text) => {
        resolve({'fileName': fileName, 'text': text});
      });
    });
    textObjs.push(textObj);
  }

  return textObjs;
};