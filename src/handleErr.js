export function reportErr(errType, errMessages) {
  let errStr = errMessages.join('\n');
  if ('' !== errStr) {
    console.log(errType + ':\n', errStr);
    throw new Error();
  }
};

export function saveErrs(wholeErrs, newErrs = [], additionalMessage) {
  if (newErrs.length > 0) {
    if (additionalMessage) {
      wholeErrs.push(additionalMessage);
    }
    wholeErrs.push(...newErrs);
  }
};

export function saveErr(wholeErrs, errMessage) {
  if (errMessage) {
    wholeErrs.push(errMessage);
  }
};

export function warn() {
  console.log('Warning!', ...arguments);
};