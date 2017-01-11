export function reportErr(errType, errMessages) {
  let errStr = errMessages.join('\n')
  if ('' !== errStr) {
    console.log(errType + ':\n', errStr);
    throw new Error();
  }
};

export function saveErrs(wholeErrs, newErrs = [], additionalMessage) {
  if (newErrs.length > 0) {
    if (additionalMessage) {
      wholeErrs.splice(wholeErrs.length - 1, 0, additionalMessage);
    }
    wholeErrs.splice(wholeErrs.length - 1, 0, ...newErrs);
  }
};

export function saveErr(wholeErrs, errMessage) {
  if (errMessage) {
    wholeErrs.splice(wholeErrs.length - 1, 0, errMessage);
  }
} 