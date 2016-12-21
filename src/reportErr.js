export default function reportErr(errType, errMessages) {
  let errStr = errMessages.join('\n')
  if ('' !== errStr) {
    console.log(errType + ':\n', errStr);
    throw new Error();
  }
}