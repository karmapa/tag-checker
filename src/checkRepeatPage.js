const pbRegex = /<pb id="(.+?)"/g;
const jpRegex = /<jp id="(.+?)"/g;

import reportErr from './reportErr.js';

export default function checkReteatPage(textObjs) {
  let errMessages = [];
  let pageTypes = [{pageType: 'pb', pageRegex: pbRegex}, {pageType: 'jp', pageRegex: jpRegex}];

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
          errMessages.push(pageType + ' ' + pageId + ' in ' + storedId + ' and ' + fn);
        }
      });
    });
  });

  reportErr('Repeat Page', errMessages);
}