const pageTypes = ['pb', 'jp'];

import reportErr from './reportErr.js';

export default function checkReteatPage(textObjs) {
  let errMessages = [];

  pageTypes.forEach((pageType) => {
    let pageRegex = new RegExp('<' + pageType + ' id="([^<>]+)"', 'g');
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