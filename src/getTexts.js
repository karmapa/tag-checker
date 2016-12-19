import glob from 'glob';
import Path from 'path';
import fs from 'fs';
import nSort from 'javascript-natural-sort';

export default async function getTexts(globPat) {
  let texts = [];

  let routes = await new Promise((resolve) => {
    glob(globPat, (err, routes) => {
      resolve(routes.sort(nSort));
    });
  });

  for (let i = 0; i < routes.length; i++) {
    let route = routes[i];
    let fileName = Path.basename(route);

    let text = await new Promise((resolve) => {
      fs.readFile(route, 'utf8', (err, text) => {
        resolve({'fileName': fileName, 'text': text});
      });
    });
    texts.push(text);
  }

  return texts;
};