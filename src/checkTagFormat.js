const emptyTag = /<[\s\/]*>/g;
const noEndArrow = /<[^>]*?(\n|$)/g;
const noStartArrow = /(^|\n|>)[^<|\n]*>/g;

var errorResult = false;

export default function checkTagFormat(textObjs) {
  let errMessages = [];

  function saveErr(fileName, wrongTags) {
    if (wrongTags.length > 0) {
      errMessages.push(fileName + '\n' + wrongTags.join('\n'));
    }
  }

  textObjs.forEach((textObj) => {
    let text = textObj.text;
    let fileName = textObj.fileName;
    let emptyTags = text.match(emptyTag) || [];
    let noEndArrows = text.match(noEndArrow) || [];
    let noStartArrows = text.match(noStartArrow) || [];
    saveErr(fileName, emptyTags.concat(noEndArrows).concat(noStartArrows));
  });

  let errStr = errMessages.join('\n')
  if ('' !== errStr) {
    console.log('Wrong Tag Format:\n' + errStr);
    throw new Error();
  }
};