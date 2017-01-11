export function reportErr(errType, errMessages) {
  let errStr = errMessages.join('\n')
  if ('' !== errStr) {
    console.log(errType + ':\n', errStr);
    throw new Error();
  }
};

export function saveErr(wholeErrs, newErrs) {
  if (newErrs.length > 0) {
    wholeErrs.splice(wholeErrs.length - 1, 0, ...newErrs);
  }
};