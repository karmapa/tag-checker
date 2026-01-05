import {warn} from './handleErr.js';

export function getPageLineInfo(charsPerLineCollect, fn, text) {
  let pages = text.replace(/(<pb)/g, '@delimiter@$1')
    .split('@delimiter@');

  pages.shift();

  let pbInfos = pages.map((page) => {
    let pbId = /<pb id="(.+?)"\/>/.exec(page)[1];
    page = page.replace(/<.+?>/g, '')
      .trim()
      .replace(/[\u0f0b\u0f0d\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f8d-\u0fbc]/g, '')

    let pageLineN = (page.match(/\n/g) || []).length + 1;
    let longestLine = page.split(/\r?\n/)
      .map((line, i) => {
        let charN = line.length;

        if (charN > 0) {
          charsPerLineCollect.push(charN)
        }

        return charN;
      }).sort(sortNumber)[0];

    return {pbId: pbId, line: pageLineN, longest: longestLine};
  });

  return {fn: fn, pbInfos: pbInfos};
}

export function reportLongLinePage(charsPerLineCollect, pageLineInfo) {
  let maxOutValue = getMaxOutValue(charsPerLineCollect);

  for (let fnInfo of pageLineInfo) {
    let fn = fnInfo.fn;

    for (let pbInfo of fnInfo.pbInfos) {
      let {pbId, line, longest} = pbInfo;

      if (longest > maxOutValue) {
        //  warn(fn, pbId, 'has', line, 'lines, longest line:', longest);
      }
    }
  }
}

function getMaxOutValue(numbers) {
  let n = numbers.length;

  if (n === 0) {
    return 99999999;
  }

  let sum = numbers.reduce((a, b) => {
    return a + b;
  });
  let mean = Math.ceil(sum / n);

  console.log('Average line length:', mean);
  return mean * 5 / 3;
}

function sortNumber(a, b) {
 return b - a;
}