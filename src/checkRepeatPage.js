const pageTypes = ['pb', 'jp'];

import reportErr from './reportErr.js';

export default function checkReteatPage(textObjs) {
  let errMessages = [];

  pageTypes.forEach((pageType) => {
    let pageRegex = new RegExp('<' + pageType + ' id="([^<>]+)"', 'g');
    let pageIdStore = {};

    textObjs.forEach((textObj) => {
      let fileName = textObj.fileName;

      textObj.text.replace(pageRegex, (tag, pageId) => {
        let storedId = pageIdStore[pageId];

        if (! storedId) {
          pageIdStore[pageId] = fileName;
        }
        else {
          errMessages.push(pageId + ' in ' + storedId + ' and ' + fileName);
        }
      });
    });
  });

  reportErr(errMessages);
}