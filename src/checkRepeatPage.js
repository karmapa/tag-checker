import {pbSIgRegex, jpSIgRegex} from './regexs.js';
import reportErr from './reportErr.js';

export default function checkReteatPage(textObjs) {
  let errMessages = [];
  let pageTypes = [{type: 'pb', pageRegex: pbSIgRegex}, {type: 'jp', pageRegex: jpSIgRegex}];

  pageTypes.forEach((pageTypeObj) => {
    let {type, pageRegex} = pageTypeObj;
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