const pageTypes = [
  {pageType: 'pb', pageRegex: /<pb id="(.+?)"/g},
  {pageType: 'jp', pageRegex: /<jp id="(.+?)"/g}
];

import {saveErr, reportErr} from './reportErr.js';

export default function checkReteatPage(textObjs) {
  let errMessages = [];

  pageTypes.forEach((pageTypeObj) => {
    let {pageType, pageRegex} = pageTypeObj;
    let pageIdStore = {};

    textObjs.forEach((textObj) => {
      let fn = textObj.fn;

      textObj.text.replace(pageRegex, (tag, pageId) => {
        let storedId = pageIdStore[pageId];

        if (! storedId) {
          pageIdStore[pageId] = fn;
        }
        else {
          saveErr(errMessages, pageType + ' ' + pageId + ' in ' + storedId + ' and ' + fn);
        }
      });
    });
  });

  reportErr('Repeat Page', errMessages);
}