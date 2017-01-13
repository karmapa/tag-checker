const pageTypes = [
  {pageType: 'pb', pageRegex: /<pb id="(.+?)"/g},
  {pageType: 'jp', pageRegex: /<jp id="(.+?)"/g}
];

import {reportErr} from './handleErr.js';

export default function checkReteatPage(textObjs) {
  let errMessages = [];

  pageTypes.forEach((pageTypeObj) => {
    let {pageType, pageRegex} = pageTypeObj;
    let pageIdStore = {};

    textObjs.forEach((textObj) => {
      let {fn, text} = textObj;

      text.replace(pageRegex, (tag, pageId) => {
        let storedIdFn = pageIdStore[pageId];

        if (! storedIdFn) {
          pageIdStore[pageId] = fn;
        }
        else {
          errMessages.push(pageType + ' ' + pageId + ' in ' + storedIdFn + ' and ' + fn);
        }
      });
    });
  });
  reportErr('Repeat Page', errMessages);
}