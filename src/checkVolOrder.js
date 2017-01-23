import {volExist} from "./detectTag.js";
import {analyzeVol} from "./analyzeTag.js";
import {warn, reportErr} from "./handleErr.js";

export default function checkVolOrder(textObjs) {
  let lastVolBio, errMessages = [];

  check1stTextVol(textObjs[0].text);

  textObjs.forEach((textObj) => {
    let {fn, text} = textObj;

    if (volExist(text)) {
      let volBio = analyzeVol(text);

      if (lastVolBio) {
        check2VolOrder(errMessages, lastVolBio, volBio);
      }
      else {
        lastVolBio = volBio;
      }
    }
  });

  reportErr('Error! Wrong Tag Order!', errMessages);
};

function check1stTextVol(text) {
  let volN = analyzeVol('first file', text).volN;
  if (! volExist(text) || volN !== '1' && volN !== '1-1') {
    warn('No vol tag or volN not 1 or 1-1 in first file!');
  }
}

function check2VolOrder(store, lastBio, bio) {

}